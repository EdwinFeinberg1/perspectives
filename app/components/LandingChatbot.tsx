"use client";

import React from "react";
import { useChat } from "ai/react";

import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import ChatInputFooter from "./Chatbot/ChatInputFooter";
import PromptSuggestionButton from "./Chatbot/PromptSuggestionButton";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT" | null;

const apiRoute = (m: ModelName) =>
  !m
    ? "/api/chat/empty" // Add an empty API route
    : m === "RabbiGPT"
    ? "/api/chat/judaism"
    : m === "BuddhaGPT"
    ? "/api/chat/buddha"
    : "/api/chat/christianity";

// Prompt suggestions for each model
const SUGGESTIONS: Record<NonNullable<ModelName>, string[]> = {
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
};

interface LandingChatbotProps {
  selectedModel: ModelName;
}

const LandingChatbot: React.FC<LandingChatbotProps> = ({ selectedModel }) => {
  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    id: `landing-${selectedModel?.toLowerCase() || "default"}`,
    api: apiRoute(selectedModel),
  });

  const sendPrompt = (p: string) => {
    if (selectedModel) {
      append({ id: crypto.randomUUID(), role: "user", content: p });
    }
  };

  // Render empty container when no model is selected
  if (!selectedModel) {
    return (
      <div className="h-full flex flex-col overflow-hidden relative">
        <div className="h-full overflow-y-auto space-y-4 bg-black/40 backdrop-blur-sm pb-32 w-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="h-full overflow-y-auto space-y-4 bg-black/40 backdrop-blur-sm pb-32 w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-0">
            <p className="text-[#ddc39a] mb-10 text-xl font-medium">
              Ask <span className="font-bold">{selectedModel}</span> about:
            </p>
            <div className="flex flex-wrap justify-center gap-4 w-full px-[5%]">
              {SUGGESTIONS[selectedModel].map((prompt, i) => (
                <PromptSuggestionButton
                  key={`suggestion-${i}`}
                  text={prompt}
                  onClick={() => sendPrompt(prompt)}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, index) => (
              <Bubble
                key={m.id || index}
                message={{
                  content: m.content,
                  role: m.role as "user" | "assistant",
                }}
                model={selectedModel}
              />
            ))}
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
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default LandingChatbot;
