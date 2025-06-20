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
import { useConversations } from "../context/ConversationsContext";
import { UserIntent } from "./OnboardingFlow";

interface LandingChatbotProps {
  conversationId: string;
  selectedModels: ModelName[];
  /**
   * Callback to update the currently-selected model(s) in the parent page. The
   * LandingChatbot will always pass an array containing exactly one model – the
   * one the user most recently selected via the chat footer UI.
   */
  setSelectedModels: (models: ModelName[]) => void;
  onFirstMessage?: (models: ModelName[]) => void;
  onLoadingChange?: (loading: boolean) => void;
  userIntent?: UserIntent | null;
}

const LandingChatbot: React.FC<LandingChatbotProps> = ({
  conversationId,
  selectedModels,
  setSelectedModels,
  onFirstMessage,
  onLoadingChange,
  userIntent,
}) => {
  const selectedModel = selectedModels.length > 0 ? selectedModels[0] : null;
  const chatInputRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track which model responded to each message
  const [messageModels, setMessageModels] = useState<Record<string, ModelName>>(
    {}
  );
  const [hasNotifiedFirst, setHasNotifiedFirst] = useState(false);
  const hasSentInitialPromptRef = useRef(false);

  // Add state to track pending model changes for immediate UI feedback
  const [pendingModelChange, setPendingModelChange] =
    useState<ModelName | null>(null);

  // Access conversation updater so we can persist the running transcript.
  const { updateConversation } = useConversations();

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
    maxSteps: 5, // Enable multi-step tool interactions
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

      // Disabled auto-scroll when message finishes
      // smoothScrollToInput();
    },
    onError: (err) => {
      console.error(`Chat error for ${selectedModel}:`, err);
    },
  });

  // Auto-scroll to input form when loading state changes (disabled)
  useEffect(() => {
    // Disabled auto-scroll when loading state changes
    // if (isLoading) {
    //   smoothScrollToInput();
    // }
  }, [isLoading, smoothScrollToInput]);

  // Log current status
  useEffect(() => {
    console.log(`Chat status changed: ${status}`);
  }, [status]);

  // Notify parent about loading state
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Persist transcript only when new messages are added and streaming is done
  const lastSavedCount = useRef(0);

  useEffect(() => {
    if (messages.length === 0) return;

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

    // Persist only when: a) not streaming b) we have more messages than last save
    if (!isLoading && messages.length > lastSavedCount.current) {
      updateConversation(conversationId, {
        messages: messages.map((m) => {
          if (m.role === "assistant") {
            return {
              role: m.role as "assistant",
              content: m.content,
              model: messageModels[m.id] || selectedModel,
            };
          } else {
            return {
              role: m.role as "user",
              content: m.content,
            };
          }
        }),
      });
      lastSavedCount.current = messages.length;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading]);

  // Log error state
  useEffect(() => {
    if (error) {
      console.error(`Chat error detected:`, error);
    }
  }, [error]);

  // Reset the initial prompt ref when conversation changes
  useEffect(() => {
    hasSentInitialPromptRef.current = false;
  }, [conversationId]);

  const sendPrompt = useCallback(
    (p: string) => {
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

        // Disabled auto-scroll after sending message
        // smoothScrollToInput();
      }
    },
    [pendingModelChange, selectedModel, append]
  );

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
  }, [selectedModel, onFirstMessage, sendPrompt]);

  // Send initial prompt from userIntent if available
  useEffect(() => {
    console.log("Initial prompt effect check:", {
      hasUserIntent: !!userIntent,
      hasSentRef: hasSentInitialPromptRef.current,
      hasSelectedModel: !!selectedModel,
      isLoading,
      messagesLength: messages.length,
      userIntentPrompt: userIntent?.initialPrompt,
    });

    // Only proceed if we have everything we need and haven't sent yet
    if (
      !userIntent?.initialPrompt ||
      hasSentInitialPromptRef.current ||
      !selectedModel
    ) {
      return;
    }

    // Wait a bit for the chat to be fully initialized
    const timeoutId = setTimeout(() => {
      // Final check before sending
      if (
        !hasSentInitialPromptRef.current &&
        messages.length === 0 &&
        !isLoading
      ) {
        console.log("Sending initial prompt:", userIntent.initialPrompt);
        hasSentInitialPromptRef.current = true;
        sendPrompt(userIntent.initialPrompt);
      }
    }, 500); // Give enough time for initialization

    // Cleanup
    return () => clearTimeout(timeoutId);
  }, [userIntent, selectedModel, messages.length, isLoading, sendPrompt]); // Added back necessary dependencies

  // Handler for model selection from ChatInputFooter
  const handleModelSelect = (model: string) => {
    if (!model) return;

    console.log(`LandingChatbot: Switching to model ${model}`);
    const modelName = model as ModelName;

    // 1. Update local UI state immediately so the footer reflects the change.
    setPendingModelChange(modelName);

    // 2. Propagate the change upward so PersonalitiesSection (and the global
    //    conversation state) stays in sync.
    setSelectedModels([modelName]);

    // 3. Optionally display a toast for user feedback.
    if (typeof window !== "undefined" && selectedModel !== modelName) {
      const event = new CustomEvent("showToast", {
        detail: { message: `Switched to ${modelName}`, type: "info" },
      });
      window.dispatchEvent(event);
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
            hasReceivedResponse={messages.some(
              (msg) => msg.role === "assistant"
            )}
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
                parts: m.parts,
                toolInvocations: m.toolInvocations,
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
          hasReceivedResponse={messages.some((msg) => msg.role === "assistant")}
        />
      </div>
    </div>
  );
};

export default LandingChatbot;
