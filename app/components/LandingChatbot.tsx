"use client";

import React from "react";
import { useChat } from "ai/react";

import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import ChatInputFooter from "./Chatbot/ChatInputFooter";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT";

const apiRoute = (m: ModelName) =>
  m === "RabbiGPT"
    ? "/api/chat/judaism"
    : m === "BuddhaGPT"
    ? "/api/chat/buddha"
    : "/api/chat/christianity";

const BADGE: Record<ModelName, string> = {
  RabbiGPT: "✡️",
  BuddhaGPT: "☸️",
  PastorGPT: "✝️",
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
    id: `landing-${selectedModel.toLowerCase()}`,
    api: apiRoute(selectedModel),
  });

  const sendPrompt = (p: string) =>
    append({ id: crypto.randomUUID(), role: "user", content: p });

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="px-4 py-3 flex flex-row justify-between items-center space-y-0 bg-black/60 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/60">
            <span className="text-xl">{BADGE[selectedModel]}</span>
            <span className="font-medium">{selectedModel}</span>
          </div>
        </div>
      </div>

      <div className="h-full overflow-y-auto p-4 space-y-4 bg-black/40 backdrop-blur-sm pb-32">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>Ask a question to {selectedModel}</p>
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
        sendPrompt={sendPrompt}
      />
    </div>
  );
};

export default LandingChatbot;
