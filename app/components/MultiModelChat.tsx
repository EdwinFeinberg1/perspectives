"use client";

import React, { useState, useMemo } from "react";
import { useChat, Message } from "ai/react";
import ReactMarkdown from "react-markdown";
import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import ChatInputFooter from "./Chatbot/ChatInputFooter";
import PromptSuggestionButton from "./Chatbot/PromptSuggestionButton";
import { ModelName, ComparisonData } from "../types";

// Extended Message type that includes our custom properties
interface ExtendedMessage extends Message {
  model?: ModelName;
  isComparison?: boolean;
  followupSuggestions?: string[];
}

// Prompt suggestions for multi-model comparison
const MULTI_MODEL_SUGGESTIONS = [
  "What happens after death?",
  "How should we treat others?",
  "What is the purpose of prayer?",
  "How does one find meaning in suffering?",
  "What does your tradition say about forgiveness?",
  "How should we balance tradition and modernity?",
];

// Default follow-ups if none are extracted from the response
const DEFAULT_FOLLOW_UPS = [
  "Can you elaborate on the similarities?",
  "Tell me more about the differences",
  "How do these perspectives approach moral dilemmas?",
];

interface MultiModelChatProps {
  conversationId: string;
  selectedModels: ModelName[];
  setComparisonData: (data: ComparisonData) => void;
  onFirstMessage?: (models: ModelName[]) => void;
}

const MultiModelChat: React.FC<MultiModelChatProps> = ({
  conversationId,
  selectedModels,
  setComparisonData,
  onFirstMessage,
}) => {
  // Simple state for UI
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasNotifiedFirst, setHasNotifiedFirst] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Always initialize all chat hooks at the top level
  const rabbiChat = useChat({
    id: `single-${conversationId}-rabbigpt`,
    api: "/api/chat/judaism",
  });
  const pastorChat = useChat({
    id: `single-${conversationId}-pastorgpt`,
    api: "/api/chat/christianity",
  });
  const buddhaChat = useChat({
    id: `single-${conversationId}-buddhagpt`,
    api: "/api/chat/buddha",
  });
  const imamChat = useChat({
    id: `single-${conversationId}-imamgpt`,
    api: "/api/chat/islam",
  });

  // Initialize comparison chat with custom handler
  const comparisonChat = useChat({
    // Use a unique ID based on the selected models combination so each
    // comparison chat instance has its own independent message history.
    // Sort the model names for deterministic ordering, then join with "&".
    id: `comparison-${conversationId}-${selectedModels
      .slice()
      .sort()
      .join("&")}`,
    api: "/api/chat/compare",
    body: { selectedModels },
    onFinish: (message) => {
      try {
        // Extract JSON data from the response
        const jsonMatch = message.content.match(/```json\s*([\s\S]*?)\s*```/);

        if (jsonMatch && jsonMatch[1]) {
          const jsonData = JSON.parse(jsonMatch[1]);

          if (jsonData.uniquePoints && jsonData.similarities) {
            // Update comparison data in parent component
            setComparisonData({
              uniquePoints: jsonData.uniquePoints,
              similarities: jsonData.similarities,
            });
          }
        }
      } catch (error) {
        console.error("Failed to parse comparison data", error);
      }
    },
  });

  // Create a map of model chats after all hooks are initialized
  const modelChats = useMemo(
    () => ({
      RabbiGPT: rabbiChat,
      PastorGPT: pastorChat,
      BuddhaGPT: buddhaChat,
      ImamGPT: imamChat,
    }),
    [rabbiChat, pastorChat, buddhaChat, imamChat]
  );

  // Determine which chat instance to use based on selection mode
  const activeChat = useMemo(() => {
    if (selectedModels.length > 1) {
      return comparisonChat;
    } else if (selectedModels.length === 1 && selectedModels[0]) {
      return modelChats[selectedModels[0]] || null;
    }
    return null;
  }, [selectedModels, comparisonChat, modelChats]);

  // Handle submitting a prompt
  const handleSubmit = async (prompt: string) => {
    if (!activeChat || selectedModels.length === 0 || isProcessing) return;

    if (!hasNotifiedFirst) {
      onFirstMessage?.(selectedModels);
      setHasNotifiedFirst(true);
    }

    // Hide suggestions once user submits first prompt
    if (!hasPrompted) setHasPrompted(true);

    setIsProcessing(true);

    try {
      // Create user message with proper typing
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: prompt,
      };

      // In multi-select mode, submit to individual models first, then to comparison
      if (selectedModels.length > 1) {
        // Submit to each selected model first
        for (const model of selectedModels) {
          if (!model) continue;
          if (modelChats[model]) {
            await modelChats[model]?.append(userMessage);
          }
        }

        // Wait a moment for the model responses to be processed
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Then submit to comparison API
        await comparisonChat.append(userMessage);
      } else if (selectedModels[0]) {
        // In single-select mode, just submit to the selected model
        const selectedModel = selectedModels[0];
        if (modelChats[selectedModel]) {
          await modelChats[selectedModel]?.append(userMessage);
        }
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to extract follow-up questions from message content
  const extractFollowUpQuestions = (content: string): string[] => {
    try {
      // Match the section heading for "Follow-up Questions"
      const sectionRegex =
        /##?\s*Follow-up Questions\s*\n([\s\S]*?)(?:\n##|$)/i;
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
      const anyMatches = Array.from(
        content.matchAll(anyNumberedQuestionsRegex)
      );
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

  // Get messages to display based on current mode
  const getDisplayMessages = (): ExtendedMessage[] => {
    if (!activeChat) return [];

    const messages = [...activeChat.messages];

    // Format comparison messages to remove JSON
    if (selectedModels.length > 1) {
      return messages.map((msg) => {
        if (msg.role === "assistant") {
          // Clean up JSON from comparison response
          const cleanContent = msg.content
            .replace(/```json\s*[\s\S]*?```\s*/m, "")
            .trim();

          // Extract follow-up questions
          const followupSuggestions = extractFollowUpQuestions(cleanContent);

          // Remove the follow-up section from the displayed content
          const contentWithoutFollowups = removeFollowUpSection(cleanContent);

          return {
            ...msg,
            content: contentWithoutFollowups,
            isComparison: true,
            followupSuggestions,
          } as ExtendedMessage;
        }
        return msg as ExtendedMessage;
      });
    }

    // For single model, just add model info
    return messages.map((msg) => {
      if (msg.role === "assistant") {
        // Extract follow-up questions from single model responses too
        const followupSuggestions = extractFollowUpQuestions(msg.content);

        // Remove the follow-up section from the displayed content
        const contentWithoutFollowups = removeFollowUpSection(msg.content);

        return {
          ...msg,
          content: contentWithoutFollowups,
          model: selectedModels[0],
          followupSuggestions,
        } as ExtendedMessage;
      }
      return msg as ExtendedMessage;
    });
  };

  // Get loading state
  const isLoading = (activeChat?.isLoading || isProcessing) ?? false;

  // Get messages to display
  const displayMessages = getDisplayMessages();

  // Get appropriate suggestions
  const suggestions = selectedModels.length > 1 ? MULTI_MODEL_SUGGESTIONS : [];

  // Render comparison message with markdown
  const renderComparisonMessage = (message: ExtendedMessage, index: number) => {
    const followups = message.followupSuggestions || DEFAULT_FOLLOW_UPS;

    // Share functionality for comparison messages
    const handleShare = async () => {
      if (message.content) {
        // Create shareable text
        const shareText = `ComparisonGPT's perspective:\n\n${message.content}`;

        // Check if Web Share API is available
        if (navigator.share) {
          try {
            await navigator.share({
              title: "ComparisonGPT's Perspective",
              text: shareText,
              url: window.location.href,
            });
          } catch (error) {
            console.error("Error sharing content:", error);
            // Fallback to clipboard
            copyToClipboard(shareText);
          }
        } else {
          // Fallback for browsers that don't support sharing
          copyToClipboard(shareText);
        }
      }
    };

    // Helper function to copy content to clipboard
    const copyToClipboard = (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => alert("Content copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    };

    return (
      <div
        key={`comparison-${message.id || index}`}
        className="comparison-message w-full max-w-[90%] mx-auto"
      >
        <div className="flex flex-col">
          <div className="bg-black/60 border-2 border-[#ddc39a]/20 text-[#ddc39a]/90 rounded-[20px] mx-6 my-3 p-5 text-[16px] shadow-lg backdrop-blur-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#ddc39a]/20">
              <div className="flex items-center">
                <span className="mr-2 text-xl">🔄</span>
                <span className="font-medium">ComparisonGPT</span>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="text-[#ddc39a]/70 hover:text-[#ddc39a] transition-colors"
                title="Share this response"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
            <div className="markdown-content prose prose-invert prose-headings:text-[#ddc39a] prose-p:text-[#ddc39a]/90 prose-li:text-[#ddc39a]/90 max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>

            {/* Follow-up suggestions section */}
            {!isLoading && followups.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#ddc39a]/20">
                <p className="text-[#ddc39a]/80 text-sm mb-3">
                  Follow-up questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {followups.map((suggestion, i) => (
                    <button
                      key={`follow-up-${i}`}
                      onClick={() => handleSubmit(suggestion)}
                      className="px-3 py-1.5 rounded-full bg-[#ddc39a]/10 text-[#ddc39a] text-sm hover:bg-[#ddc39a]/20 transition-colors border border-[#ddc39a]/30"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="h-full overflow-y-auto space-y-4 bg-black/40 backdrop-blur-sm pb-32 w-full">
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-0">
            {selectedModels.length > 0 &&
              suggestions.length > 0 &&
              !hasPrompted && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full px-[5%]">
                  {suggestions.map((prompt, i) => (
                    <PromptSuggestionButton
                      key={`suggestion-${i}`}
                      text={prompt}
                      onClick={() => handleSubmit(prompt)}
                    />
                  ))}
                </div>
              )}
          </div>
        ) : (
          <>
            {displayMessages.map((message, index) => {
              if (message.role === "user") {
                return (
                  <Bubble
                    key={`user-${message.id || index}`}
                    message={{
                      content: message.content,
                      role: "user",
                    }}
                    model={null}
                  />
                );
              } else if (message.role === "assistant") {
                // In multi-select mode, show formatted comparison message
                if (selectedModels.length > 1) {
                  return renderComparisonMessage(message, index);
                }
                // In single-select mode, show normal message
                return (
                  <Bubble
                    key={`model-${message.id || index}`}
                    message={{
                      content: message.content,
                      role: "assistant",
                      followupSuggestions: extractFollowUpQuestions(
                        message.content
                      ),
                    }}
                    model={message.model || selectedModels[0]}
                    onFollowupClick={(question) => handleSubmit(question)}
                    isLoading={isLoading}
                  />
                );
              }
              return null;
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
        selectedModel={
          selectedModels.length > 1 ? "ComparisonGPT" : selectedModels[0]
        }
        input={activeChat?.input || ""}
        isLoading={isLoading}
        handleInputChange={activeChat?.handleInputChange || (() => {})}
        handleSubmit={(e) => {
          e.preventDefault();
          if (activeChat) {
            handleSubmit(activeChat.input);
          }
        }}
      />
    </div>
  );
};

export default MultiModelChat;
