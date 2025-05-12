/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useChat } from "ai/react";
import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import ChatInputFooter from "./Chatbot/ChatInputFooter";
import { ModelName } from "../types";
import {
  extractFollowUpQuestions,
  removeFollowUpSection,
} from "../constants/message-utils";

interface LandingChatbotProps {
  conversationId: string;
  selectedModels: ModelName[];
  onFirstMessage?: (models: ModelName[]) => void;
}

const LandingChatbot: React.FC<LandingChatbotProps> = ({
  conversationId,
  selectedModels,
  onFirstMessage,
}) => {
  const selectedModel = selectedModels.length > 0 ? selectedModels[0] : null;
  const chatInputRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track which model responded to each message
  const [messageModels, setMessageModels] = useState<Record<string, ModelName>>(
    {}
  );
  const [hasNotifiedFirst, setHasNotifiedFirst] = React.useState(false);

  // Add state to track pending model changes for immediate UI feedback
  const [pendingModelChange, setPendingModelChange] =
    useState<ModelName | null>(null);

  // Debounced scroll function to prevent rapid consecutive scrolls
  const smoothScrollToInput = useCallback(() => {
    // Clear any existing timeout to prevent multiple scroll attempts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set a new timeout
    scrollTimeoutRef.current = setTimeout(() => {
      if (chatInputRef.current) {
        // Use a more natural scroll with 'nearest' block alignment
        chatInputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
      scrollTimeoutRef.current = null;
    }, 200); // Slightly longer delay for DOM stability
  }, []);

  // Reset pending model change when selectedModels changes
  useEffect(() => {
    setPendingModelChange(null);
  }, [selectedModels]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  console.log(`LandingChatbot initializing with models:`, selectedModels);

  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    append,
    error,
    status,
  } = useChat({
    // Use only the conversationId without the model to maintain the same conversation
    id: `landing-${conversationId}`,
    // Use our unified chat route that supports model switching
    api: "/api/chat",
    body: {
      // Include the selected model in the request body
      selectedModel: selectedModel,
    },
    onResponse: (response) => {
      console.log(`API Response received for ${selectedModel}:`, {
        status: response.status,
        ok: response.ok,
        headers: Array.from(response.headers.entries()).reduce(
          (acc, [key, value]) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        ),
      });
    },
    onFinish: (message) => {
      console.log(`Message stream finished for ${selectedModel}:`, message);

      // Track which model generated this response - use pendingModelChange if available
      if (message.id) {
        const modelToUse = pendingModelChange || selectedModel;
        if (modelToUse) {
          setMessageModels((prev) => ({
            ...prev,
            [message.id]: modelToUse,
          }));
        }
      }

      // Scroll to input when message finishes
      smoothScrollToInput();
    },
    onError: (err) => {
      console.error(`Chat error for ${selectedModel}:`, err);
    },
  });

  // Auto-scroll to input form when loading state changes
  useEffect(() => {
    if (isLoading) {
      smoothScrollToInput();
    }
  }, [isLoading, smoothScrollToInput]);

  // Log current status
  useEffect(() => {
    console.log(`Chat status changed: ${status}`);
  }, [status]);

  // Log messages when they update
  useEffect(() => {
    if (messages.length > 0) {
      console.log(`Messages updated (${messages.length}):`, messages);

      if (!hasNotifiedFirst) {
        const hasUserMessage = messages.some((m) => m.role === "user");
        if (hasUserMessage) {
          onFirstMessage?.(selectedModels);
          setHasNotifiedFirst(true);
        }
      }

      // Log the last message
      const lastMessage = messages[messages.length - 1];
      console.log(`Last message (${lastMessage.role}):`, {
        content: lastMessage.content,
        id: lastMessage.id,
      });
    }
  }, [messages, onFirstMessage, selectedModels, hasNotifiedFirst]);

  // Log error state
  useEffect(() => {
    if (error) {
      console.error(`Chat error detected:`, error);
    }
  }, [error]);

  // Listen for direct prompt submission events
  useEffect(() => {
    const handleDirectPrompt = (e: Event) => {
      const custom = e as CustomEvent<{ prompt: string; model?: string }>;
      if (custom?.detail?.prompt) {
        if (custom?.detail?.model && selectedModel !== custom.detail.model) {
          // If the model is different, we need to update the selected model first
          const modelName = custom.detail.model as ModelName;
          onFirstMessage?.([modelName]);
          // The prompt will be sent once the model is updated
        } else if (selectedModel) {
          // If the model is the same or not specified, send the prompt directly
          sendPrompt(custom.detail.prompt);
        }
      }
    };

    window.addEventListener("sendPromptDirectly", handleDirectPrompt);
    return () =>
      window.removeEventListener("sendPromptDirectly", handleDirectPrompt);
  }, [selectedModel, onFirstMessage]);

  const sendPrompt = (p: string) => {
    // Use pendingModelChange if available, otherwise use the selected model
    const modelToUse = pendingModelChange || selectedModel;
    if (modelToUse) {
      // Generate a unique ID for the user message
      const userMessageId = crypto.randomUUID();

      // Generate a predictable ID for the expected assistant response
      // This helps us associate the correct model with the response before it arrives
      const predictedAssistantId = `assistant-${Date.now()}`;

      // Pre-emptively update the messageModels with the model that will respond
      setMessageModels((prev) => ({
        ...prev,
        [predictedAssistantId]: modelToUse,
      }));

      append(
        { id: userMessageId, role: "user", content: p },
        {
          body: {
            // Include the current model in the request body
            selectedModel: modelToUse,
          },
        }
      );

      // Scroll to input after sending message
      smoothScrollToInput();
    }
  };

  // Handler for model selection from ChatInputFooter
  const handleModelSelect = (model: string) => {
    if (model) {
      console.log(`LandingChatbot: Switching to model ${model}`);
      const modelName = model as ModelName;

      // Set pending model change for immediate UI feedback
      setPendingModelChange(modelName);

      // Show a brief toast notification that model was switched
      if (typeof window !== "undefined" && selectedModel !== modelName) {
        const event = new CustomEvent("showToast", {
          detail: { message: `Switched to ${modelName}`, type: "info" },
        });
        window.dispatchEvent(event);
      }

      // Always notify parent to update the global state
      // This will update PersonalitiesSection
      onFirstMessage?.([modelName]);
    }
  };

  // Render empty container when no model is selected
  if (selectedModels.length === 0) {
    return (
      <div className="h-full flex flex-col overflow-hidden relative">
        <div className="h-full overflow-y-auto space-y-4 pb-8 w-full"></div>
        <div ref={chatInputRef}>
          <ChatInputFooter
            selectedModel={pendingModelChange || null}
            input=""
            isLoading={false}
            handleInputChange={() => {}}
            handleSubmit={(e) => {
              e.preventDefault();
            }}
            onModelSelect={handleModelSelect}
          />
        </div>
      </div>
    );
  }

  // Single model mode
  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="h-full overflow-y-auto space-y-4 pb-8 w-full">
        {messages.map((m, index) => {
          // Get the model that generated this message, or use current model as fallback
          const messageModel =
            m.role === "assistant"
              ? messageModels[m.id] || selectedModel
              : null;

          return (
            <Bubble
              key={m.id || index}
              message={{
                content:
                  m.role === "assistant"
                    ? removeFollowUpSection(m.content)
                    : m.content,
                role: m.role as "user" | "assistant",
                followupSuggestions:
                  m.role === "assistant"
                    ? extractFollowUpQuestions(m.content)
                    : undefined,
              }}
              model={messageModel}
              onFollowupClick={(question) => sendPrompt(question)}
              isLoading={isLoading}
            />
          );
        })}
        {isLoading && (
          <div className="flex justify-center">
            <LoadingBubble />
          </div>
        )}
      </div>

      <div ref={chatInputRef}>
        <ChatInputFooter
          selectedModel={pendingModelChange || selectedModel}
          input={input}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleSubmit={(e) => {
            e.preventDefault();
            // Use pending model change if available, otherwise use the selected model
            const modelToUse = pendingModelChange || selectedModel;
            if (modelToUse) {
              // Generate a predictable ID for the expected assistant response
              const predictedAssistantId = `assistant-${Date.now()}`;

              // Pre-emptively update the messageModels with the model that will respond
              setMessageModels((prev) => ({
                ...prev,
                [predictedAssistantId]: modelToUse,
              }));

              // Include the current model in the request
              handleSubmit(e, {
                body: {
                  selectedModel: modelToUse,
                },
              });
            }
          }}
          onModelSelect={handleModelSelect}
        />
      </div>
    </div>
  );
};

export default LandingChatbot;
