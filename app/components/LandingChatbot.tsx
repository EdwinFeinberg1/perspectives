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

// Fallback follow-up questions if none can be extracted from responses
const DEFAULT_FOLLOW_UPS = [
  "Can you elaborate on that?",
  "How would you explain this to a beginner?",
  "What scriptural sources support this view?",
];

// Function to extract follow-up questions from message content
const extractFollowUpQuestions = (content: string): string[] => {
  try {
    // Match the section heading for "Follow-up Questions"
    const sectionRegex = /##?\s*Follow-up Questions\s*\n([\s\S]*?)(?:\n##|$)/i;
    const sectionMatch = content.match(sectionRegex);

    if (sectionMatch && sectionMatch[1]) {
      // Extract numbered questions (1. Question text?)
      const numberedQuestionsRegex = /\d+\.\s+(.+?\?)/g;
      const section = sectionMatch[1];

      const matches = Array.from(section.matchAll(numberedQuestionsRegex));
      if (matches && matches.length > 0) {
        return matches.map((match) => match[1].trim());
      }
    }

    // Fallback: Try to find any numbered questions anywhere in the text
    // This helps with inconsistently formatted responses
    const anyNumberedQuestionsRegex = /\d+\.\s+(.+?\?)/g;
    const anyMatches = Array.from(content.matchAll(anyNumberedQuestionsRegex));
    if (anyMatches && anyMatches.length > 0) {
      return anyMatches.map((match) => match[1].trim());
    }

    return DEFAULT_FOLLOW_UPS;
  } catch (error) {
    console.error("Error extracting follow-up questions:", error);
    return DEFAULT_FOLLOW_UPS;
  }
};

// Function to remove the follow-up questions section from message content
const removeFollowUpSection = (content: string): string => {
  try {
    // Remove the "Follow-up Questions" section and everything after it
    return content.replace(/##?\s*Follow-up Questions[\s\S]*$/, "").trim();
  } catch (error) {
    console.error("Error removing follow-up section:", error);
    return content;
  }
};

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
  }, [messages, onFirstMessage, selectedModels]);

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
        conversationId={conversationId}
        selectedModels={selectedModels}
        setComparisonData={setComparisonData}
        onFirstMessage={onFirstMessage}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full px-[5%]">
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
