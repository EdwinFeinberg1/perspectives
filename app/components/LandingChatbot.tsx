"use client";

import React, { useEffect } from "react";
import { useChat } from "ai/react";
import MultiModelChat from "./MultiModelChat";
import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import ChatInputFooter from "./Chatbot/ChatInputFooter";
import { ModelName, ComparisonData } from "../types";
import { getApiRoute } from "../constants/api-routes";
import {
  extractFollowUpQuestions,
  removeFollowUpSection,
} from "../constants/message-utils";

interface LandingChatbotProps {
  conversationId: string;
  selectedModels: ModelName[];
  setComparisonData: (data: ComparisonData) => void;
  onFirstMessage?: (models: ModelName[]) => void;
}

const LandingChatbot: React.FC<LandingChatbotProps> = ({
  conversationId,
  selectedModels,
  setComparisonData,
  onFirstMessage,
}) => {
  const isSingleModelMode = selectedModels.length === 1;
  const selectedModel = isSingleModelMode ? selectedModels[0] : null;

  const [hasNotifiedFirst, setHasNotifiedFirst] = React.useState(false);

  console.log(`LandingChatbot initializing with models:`, selectedModels);

  // Add logging for API route
  const apiRoute = getApiRoute(selectedModel);
  console.log(
    `LandingChatbot using API route: ${apiRoute} for model: ${selectedModel}`
  );

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
    id: `landing-${conversationId}-${
      selectedModel?.toLowerCase() || "default"
    }`,
    api: apiRoute,
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
    },
    onError: (err) => {
      console.error(`Chat error for ${selectedModel}:`, err);
    },
  });

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
    if (selectedModel) {
      append({ id: crypto.randomUUID(), role: "user", content: p });
    }
  };

  // Render empty container when no model is selected
  if (selectedModels.length === 0) {
    return (
      <div className="h-full flex flex-col overflow-hidden relative">
        <div className="h-full overflow-y-auto space-y-4 pb-32 w-full"></div>
        <ChatInputFooter
          selectedModel={null}
          input=""
          isLoading={false}
          handleInputChange={() => {}}
          handleSubmit={(e) => {
            e.preventDefault();
          }}
          onModelSelect={(model) => {
            if (model) {
              const modelName = model as ModelName;
              onFirstMessage?.([modelName]);
            }
          }}
        />
      </div>
    );
  }

  // Render the multi-model chat when multiple models are selected
  if (selectedModels.length > 1) {
    return (
      <MultiModelChat
        conversationId={conversationId}
        selectedModels={selectedModels}
        setComparisonData={setComparisonData}
        onFirstMessage={onFirstMessage}
        updateSelectedModels={(models) => {
          // Only trigger onFirstMessage if there's an actual change
          if (selectedModels.join(",") !== models.join(",")) {
            // This will update the models in the parent component
            onFirstMessage?.(models);
          }
        }}
      />
    );
  }

  // Single model mode
  return (
    <div className="h-full flex flex-col overflow-hidden relative">

      <div className="h-full overflow-y-auto space-y-4 pb-24 w-full">
        {messages.map((m, index) => {
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
              model={selectedModel}
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

      <ChatInputFooter
        selectedModel={selectedModel}
        input={input}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={(e) => {
          handleSubmit(e);
        }}
        onModelSelect={(model) => {
          if (
            model &&
            (selectedModels.length !== 1 || selectedModel !== model)
          ) {
            const modelName = model as ModelName;
            // This will notify the parent and update the selected models
            onFirstMessage?.([modelName]);
          }
        }}
      />
    </div>
  );
};

export default LandingChatbot;
