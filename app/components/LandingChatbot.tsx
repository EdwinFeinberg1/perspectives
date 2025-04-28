"use client";

import React, { useEffect } from "react";
import { useChat } from "ai/react";
import MultiModelChat from "./MultiModelChat";

import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import ChatInputFooter from "./Chatbot/ChatInputFooter";
import PromptSuggestionButton from "./Chatbot/PromptSuggestionButton";
import { ModelName, ComparisonData } from "../types";

// Prompt suggestions for each model
const SUGGESTIONS = {
  RabbiGPT: [
    "Make me a spiritual growth routine",
    "What is the meaning of life?",
    "How can I forgive someone?",
    "Why do prayers feel unanswered?",
    "How to resolve scriptural contradictions?",
    "What is God?",
  ],
  BuddhaGPT: [
    "What are the Four Noble Truths?",
    "How do I begin meditating?",
    "What is non-attachment in daily life?",
    "Why is suffering unavoidable?",
    "Explain the concept of karma",
    "What is enlightenment?",
  ],
  PastorGPT: [
    "What does Christianity teach about love?",
    "How can I strengthen my faith?",
    "What does the Bible say about forgiveness?",
    "How should I pray as a Christian?",
    "Explain the Holy Trinity",
    "What is salvation?",
  ],
  ImamGPT: [
    "What are the Five Pillars of Islam?",
    "How should I pray as a Muslim?",
    "Explain the concept of Ramadan",
    "What does the Quran teach about compassion?",
    "How can I practice mindfulness in Islam?",
    "What is the Islamic view on faith and good deeds?",
  ],
};

interface LandingChatbotProps {
  selectedModels: ModelName[];
  setComparisonData: (data: ComparisonData) => void;
}

const LandingChatbot: React.FC<LandingChatbotProps> = ({
  selectedModels,
  setComparisonData,
}) => {
  const isSingleModelMode = selectedModels.length === 1;
  const selectedModel = isSingleModelMode ? selectedModels[0] : null;

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
    id: `landing-${selectedModel?.toLowerCase() || "default"}`,
    api: apiRoute(selectedModel),
    onResponse: (response) => {
      console.log(`API Response received:`, {
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
      console.log(`Message stream finished:`, message);
    },
    onError: (err) => {
      console.error(`Chat error:`, err);
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
      // Log the last message
      const lastMessage = messages[messages.length - 1];
      console.log(`Last message (${lastMessage.role}):`, {
        content: lastMessage.content,
        id: lastMessage.id,
      });
    }
  }, [messages]);

  // Log error state
  useEffect(() => {
    if (error) {
      console.error(`Chat error detected:`, error);
    }
  }, [error]);

  const sendPrompt = (p: string) => {
    if (selectedModel) {
      console.log(`Sending prompt: "${p}" to ${selectedModel}`);
      append({ id: crypto.randomUUID(), role: "user", content: p });
    }
  };

  // Render empty container when no model is selected
  if (selectedModels.length === 0) {
    return (
      <div className="h-full flex flex-col overflow-hidden relative">
        <div className="h-full overflow-y-auto space-y-4 bg-black/40 backdrop-blur-sm pb-32 w-full"></div>
      </div>
    );
  }

  // Render the multi-model chat when multiple models are selected
  if (selectedModels.length > 1) {
    return (
      <MultiModelChat
        selectedModels={selectedModels}
        setComparisonData={setComparisonData}
      />
    );
  }

  // Single model mode
  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="h-full overflow-y-auto space-y-4 bg-black/40 backdrop-blur-sm pb-32 w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-0">
            <p className="text-[#ddc39a] mb-10 text-xl font-medium">
              Ask <span className="font-bold">{selectedModel}</span> about:
            </p>
            <div className="flex flex-wrap justify-center gap-4 w-full px-[5%]">
              {selectedModel &&
                selectedModel in SUGGESTIONS &&
                SUGGESTIONS[selectedModel as keyof typeof SUGGESTIONS].map(
                  (prompt, i) => (
                    <PromptSuggestionButton
                      key={`suggestion-${i}`}
                      text={prompt}
                      onClick={() => sendPrompt(prompt)}
                    />
                  )
                )}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, index) => {
              console.log(`Rendering message ${index}:`, m);
              return (
                <Bubble
                  key={m.id || index}
                  message={{
                    content: m.content,
                    role: m.role as "user" | "assistant",
                  }}
                  model={selectedModel}
                />
              );
            })}
            {isLoading && (
              <div className="flex justify-center">
                <LoadingBubble />
              </div>
            )}
          </>
        )}
      </div>

      <ChatInputFooter
        selectedModel={selectedModel}
        input={input}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={(e) => {
          console.log(`Form submitted with input: "${input}"`);
          handleSubmit(e);
        }}
      />
    </div>
  );
};

const apiRoute = (m: ModelName) =>
  !m
    ? "/api/chat/empty" // Add an empty API route
    : m === "RabbiGPT"
    ? "/api/chat/judaism"
    : m === "BuddhaGPT"
    ? "/api/chat/buddha"
    : m === "ImamGPT"
    ? "/api/chat/islam"
    : m === "ComparisonGPT"
    ? "/api/chat/compare"
    : "/api/chat/christianity";

export default LandingChatbot;
