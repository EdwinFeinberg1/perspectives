"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useChat, Message } from "ai/react";
import ReactMarkdown from "react-markdown";
import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import ChatInputFooter from "./Chatbot/ChatInputFooter";
import { ModelName, ComparisonData } from "../types";
import { getApiRoute } from "../constants/api-routes";

// Extended Message type that includes our custom properties
interface ExtendedMessage extends Message {
  model?: ModelName;
  isComparison?: boolean;
  followupSuggestions?: string[];
}

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
  updateSelectedModels: (models: ModelName[]) => void;
}

const MultiModelChat: React.FC<MultiModelChatProps> = ({
  conversationId,
  selectedModels,
  setComparisonData,
  onFirstMessage,
  updateSelectedModels,
}) => {
  // Simple state for UI
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasNotifiedFirst, setHasNotifiedFirst] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Add state to track model selection changes
  const [pendingModelChange, setPendingModelChange] =
    useState<ModelName | null>(null);

  // Add state to track which model responded to each message
  const [messageModels, setMessageModels] = useState<Record<string, ModelName>>(
    {}
  );

  // Apply model change when selectedModels changes
  useEffect(() => {
    // Clear any pending model change when selectedModels is updated
    setPendingModelChange(null);
  }, [selectedModels]);

  // Always initialize all chat hooks at the top level
  const rabbiChat = useChat({
    id: `single-${conversationId}-rabbigpt`,
    api: getApiRoute("RabbiGPT"),
    onFinish: (message) => {
      // Track which model generated this response
      if (message.id) {
        setMessageModels((prev) => ({
          ...prev,
          [message.id]: "RabbiGPT",
        }));
      }
    },
  });

  const pastorChat = useChat({
    id: `single-${conversationId}-pastorgpt`,
    api: getApiRoute("PastorGPT"),
    onFinish: (message) => {
      // Track which model generated this response
      if (message.id) {
        setMessageModels((prev) => ({
          ...prev,
          [message.id]: "PastorGPT",
        }));
      }
    },
  });

  const buddhaChat = useChat({
    id: `single-${conversationId}-buddhagpt`,
    api: getApiRoute("BuddhaGPT"),
    onFinish: (message) => {
      // Track which model generated this response
      if (message.id) {
        setMessageModels((prev) => ({
          ...prev,
          [message.id]: "BuddhaGPT",
        }));
      }
    },
  });

  const imamChat = useChat({
    id: `single-${conversationId}-imamgpt`,
    api: getApiRoute("ImamGPT"),
    onFinish: (message) => {
      // Track which model generated this response
      if (message.id) {
        setMessageModels((prev) => ({
          ...prev,
          [message.id]: "ImamGPT",
        }));
      }
    },
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
    api: getApiRoute("ComparisonGPT"),
    body: { selectedModels },
    onFinish: (message) => {
      try {
        // Track which model generated this response
        if (message.id) {
          setMessageModels((prev) => ({
            ...prev,
            [message.id]: "ComparisonGPT",
          }));
        }

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
    // If there's a pending model change, prioritize it
    if (pendingModelChange) {
      return modelChats[pendingModelChange] || null;
    }

    if (selectedModels.length > 1) {
      return comparisonChat;
    } else if (selectedModels.length === 1 && selectedModels[0]) {
      return modelChats[selectedModels[0]] || null;
    }
    return null;
  }, [selectedModels, comparisonChat, modelChats, pendingModelChange]);

  // Get messages to display based on current mode
  const getDisplayMessages = (): ExtendedMessage[] => {
    if (!activeChat || !hasPrompted) return [];

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

        // Use the tracked model for this message if available, or use pending model or selected model
        const messageModel =
          messageModels[msg.id] || pendingModelChange || selectedModels[0];

        return {
          ...msg,
          content: contentWithoutFollowups,
          model: messageModel,
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
        className="comparison-message w-full"
      >
        <div className="flex flex-col">
          <div className="bg-muted border-2 border-border text-foreground rounded-[20px] mx-2 sm:mx-4 my-2 sm:my-3 p-3 sm:p-5 text-[14px] sm:text-[16px] text-left">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/20">
              <div className="flex items-center">
                <span className="mr-2 text-xl">🔄</span>
                <span className="font-medium text-sm sm:text-base">
                  ComparisonGPT
                </span>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Share this response"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:w-[18px] sm:h-[18px]"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
            <div className="markdown-content prose prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>

            {/* Follow-up suggestions section */}
            {!isLoading && followups.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border/20">
                <p className="text-foreground/80 text-sm mb-3">
                  Follow-up questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {followups.map((suggestion, i) => (
                    <button
                      key={`follow-up-${i}`}
                      onClick={() => handleSubmit(suggestion)}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 hover:scale-[1.02] transition-all duration-200 border border-primary/30 shadow-sm hover:shadow-md cursor-pointer font-medium"
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

  // Effect to watch chat message count changes
  useEffect(() => {
    // The displayMessages variable will be recalculated on re-render
    // No need to call any function here
  }, [
    selectedModels,
    ...Object.values(modelChats).map((chat) => chat?.messages?.length || 0),
    comparisonChat?.messages?.length || 0,
  ]);

  // Listen for direct prompt submission events
  useEffect(() => {
    const handleDirectPrompt = (e: Event) => {
      const custom = e as CustomEvent<{ prompt: string; model?: string }>;
      if (custom?.detail?.prompt && !isProcessing) {
        if (custom?.detail?.model) {
          // If a specific model is requested, update the selected models
          const modelName = custom.detail.model as ModelName;

          // Only update if needed
          if (selectedModels.length !== 1 || selectedModels[0] !== modelName) {
            updateSelectedModels([modelName]);
          }

          // Submit with a small delay to allow state to update
          setTimeout(() => {
            handleSubmit(custom.detail.prompt);
          }, 200);
        } else {
          // If no specific model is requested, just submit to currently selected models
          handleSubmit(custom.detail.prompt);
        }
      }
    };

    window.addEventListener("sendPromptDirectly", handleDirectPrompt);
    return () =>
      window.removeEventListener("sendPromptDirectly", handleDirectPrompt);
  }, [selectedModels, isProcessing]);

  // Handle model selection from ChatInputFooter
  const handleModelSelect = (model: string) => {
    if (model && typeof updateSelectedModels === "function") {
      // Update local state immediately for UI feedback
      setPendingModelChange(model as ModelName);

      // Update the selected models array to only include this model
      const modelName = model as ModelName;
      if (selectedModels.length !== 1 || selectedModels[0] !== modelName) {
        console.log(
          `MultiModelChat: Updating selected models to [${modelName}]`
        );
        updateSelectedModels([modelName]);
      }
    }
  };

  // Handle submitting a prompt
  const handleSubmit = async (prompt: string) => {
    // Use pendingModelChange if available
    const effectiveModels = pendingModelChange
      ? [pendingModelChange]
      : selectedModels;

    if (!activeChat || effectiveModels.length === 0 || isProcessing) return;

    if (!hasNotifiedFirst) {
      onFirstMessage?.(effectiveModels);
      setHasNotifiedFirst(true);
    }

    // Mark that a prompt has been submitted
    setHasPrompted(true);

    // Set processing state SYNCHRONOUSLY before any async operations
    setIsProcessing(true);

    try {
      // Create user message with proper typing
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: prompt,
      };

      // Run in a microtask to allow UI to update first
      await Promise.resolve();

      // For single model selection (including pending model change)
      if (effectiveModels.length === 1) {
        // In single-select mode, just submit to the selected model
        const selectedModel = effectiveModels[0];
        if (modelChats[selectedModel]) {
          // Generate a predictable ID for the expected assistant response
          const predictedAssistantId = `assistant-${Date.now()}`;

          // Pre-emptively update the messageModels with the model that will respond
          setMessageModels((prev) => ({
            ...prev,
            [predictedAssistantId]: selectedModel,
          }));

          await modelChats[selectedModel]?.append(userMessage);
        }
        return;
      }

      // Original multi-model logic for comparison
      if (selectedModels.length > 1) {
        // Submit to each selected model first
        for (const model of selectedModels) {
          if (!model) continue;
          if (modelChats[model]) {
            await modelChats[model]?.append(userMessage);
          }
        }

        // Then submit to comparison API
        await comparisonChat.append(userMessage);
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

  // Render empty container when no model is selected
  if (selectedModels.length === 0) {
    return (
      <div className="h-full flex flex-col overflow-hidden relative">
        <div className="h-full overflow-y-auto space-y-4 pb-32 w-full flex flex-col items-center">
          <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
            <div className="flex flex-col items-center justify-center mt-0">
              {/* Initial prompt suggestions removed */}
            </div>
          </div>
        </div>

        <ChatInputFooter
          selectedModel={pendingModelChange}
          input={""}
          isLoading={false}
          handleInputChange={() => {}}
          onModelSelect={handleModelSelect}
          hasReceivedResponse={displayMessages.some(
            (msg) => msg.role === "assistant"
          )}
          handleSubmit={(e) => {
            e.preventDefault();
            if (activeChat) {
              // Remove force loading animation immediate scroll code
              const loadingContainer = document.createElement("div");
              loadingContainer.className = "flex justify-center mb-4 mt-2";
              loadingContainer.id = "instant-loading";

              const loader = document.createElement("div");
              loader.className = "loader";

              // Add text element with the same style as in LoadingBubble
              const text = document.createElement("p");
              text.className = "text-foreground text-sm mt-2";
              text.textContent = "Letting the wise ones chew on this...";

              // Create a wrapper for loader and text
              const wrapper = document.createElement("div");
              wrapper.className = "flex flex-col items-center py-4";
              wrapper.appendChild(loader);
              wrapper.appendChild(text);

              loadingContainer.appendChild(wrapper);

              // Find chat container and append loading animation without scrolling
              const chatContainer = document.querySelector(
                ".h-full.overflow-y-auto"
              );
              if (chatContainer) {
                chatContainer.appendChild(loadingContainer);
                // Disabled automatic scrolling
                // chatContainer.scrollTop = chatContainer.scrollHeight;

                // Set up a mutation observer to watch for the appearance of the response bubble
                const observer = new MutationObserver((mutations) => {
                  // Look for added nodes that might be response bubbles
                  for (const mutation of mutations) {
                    if (
                      mutation.type === "childList" &&
                      mutation.addedNodes.length > 0
                    ) {
                      // Check if any of the added nodes is a response bubble (markdown-content class)
                      const addedResponseBubble = Array.from(
                        mutation.addedNodes
                      ).some((node) => {
                        if (node instanceof HTMLElement) {
                          // Check if the node itself or any of its children has the markdown-content class
                          return (
                            node.querySelector(".markdown-content") ||
                            node.classList.contains("markdown-content")
                          );
                        }
                        return false;
                      });

                      if (addedResponseBubble) {
                        // Remove the instant loading animation once a response is detected
                        const instantLoader =
                          document.getElementById("instant-loading");
                        if (instantLoader) {
                          instantLoader.remove();
                        }
                        // Disconnect the observer as we no longer need it
                        observer.disconnect();
                        break;
                      }
                    }
                  }
                });

                // Start observing the chat container for changes
                observer.observe(chatContainer, {
                  childList: true,
                  subtree: true,
                });
              }

              // Now submit the message
              handleSubmit(activeChat.input);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="h-full overflow-y-auto space-y-4 pb-32 w-full flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
          {displayMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-0">
              {/* Initial prompt suggestions removed */}
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
                <div className="flex justify-center w-full">
                  <LoadingBubble />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ChatInputFooter
        selectedModel={
          pendingModelChange ||
          (selectedModels.length > 1 ? "ComparisonGPT" : selectedModels[0])
        }
        input={activeChat?.input || ""}
        isLoading={isLoading}
        handleInputChange={activeChat?.handleInputChange || (() => {})}
        onModelSelect={handleModelSelect}
        hasReceivedResponse={displayMessages.some(
          (msg) => msg.role === "assistant"
        )}
        handleSubmit={(e) => {
          e.preventDefault();
          if (activeChat) {
            // Remove force loading animation immediate scroll code
            const loadingContainer = document.createElement("div");
            loadingContainer.className = "flex justify-center mb-4 mt-2";
            loadingContainer.id = "instant-loading";

            const loader = document.createElement("div");
            loader.className = "loader";

            // Add text element with the same style as in LoadingBubble
            const text = document.createElement("p");
            text.className = "text-foreground text-sm mt-2";
            text.textContent = "Letting the wise ones chew on this...";

            // Create a wrapper for loader and text
            const wrapper = document.createElement("div");
            wrapper.className = "flex flex-col items-center py-4";
            wrapper.appendChild(loader);
            wrapper.appendChild(text);

            loadingContainer.appendChild(wrapper);

            // Find chat container and append loading animation without scrolling
            const chatContainer = document.querySelector(
              ".h-full.overflow-y-auto"
            );
            if (chatContainer) {
              chatContainer.appendChild(loadingContainer);
              // Disabled automatic scrolling
              // chatContainer.scrollTop = chatContainer.scrollHeight;

              // Set up a mutation observer to watch for the appearance of the response bubble
              const observer = new MutationObserver((mutations) => {
                // Look for added nodes that might be response bubbles
                for (const mutation of mutations) {
                  if (
                    mutation.type === "childList" &&
                    mutation.addedNodes.length > 0
                  ) {
                    // Check if any of the added nodes is a response bubble (markdown-content class)
                    const addedResponseBubble = Array.from(
                      mutation.addedNodes
                    ).some((node) => {
                      if (node instanceof HTMLElement) {
                        // Check if the node itself or any of its children has the markdown-content class
                        return (
                          node.querySelector(".markdown-content") ||
                          node.classList.contains("markdown-content")
                        );
                      }
                      return false;
                    });

                    if (addedResponseBubble) {
                      // Remove the instant loading animation once a response is detected
                      const instantLoader =
                        document.getElementById("instant-loading");
                      if (instantLoader) {
                        instantLoader.remove();
                      }
                      // Disconnect the observer as we no longer need it
                      observer.disconnect();
                      break;
                    }
                  }
                }
              });

              // Start observing the chat container for changes
              observer.observe(chatContainer, {
                childList: true,
                subtree: true,
              });
            }

            // Now submit the message with the current or pending model
            const inputToSubmit = activeChat.input;

            // Pre-emptively update messageModels for the expected response
            const modelToUse =
              pendingModelChange ||
              (selectedModels.length > 1 ? "ComparisonGPT" : selectedModels[0]);

            if (modelToUse) {
              const predictedAssistantId = `assistant-${Date.now()}`;
              setMessageModels((prev) => ({
                ...prev,
                [predictedAssistantId]: modelToUse as ModelName,
              }));
            }

            if (inputToSubmit.trim()) {
              handleSubmit(inputToSubmit);
            }
          }
        }}
      />
    </div>
  );
};

export default MultiModelChat;
