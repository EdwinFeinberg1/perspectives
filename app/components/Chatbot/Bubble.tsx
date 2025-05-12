import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { PERSONALITIES } from "@/app/constants/personalities";
import Image from "next/image";
import QuoteCard from "./QuoteCard";

interface BubbleProps {
  message: {
    content: string;
    role: "user" | "assistant";
    followupSuggestions?: string[];
  };
  model: string | null;
  onFollowupClick?: (question: string) => void;
  isLoading?: boolean;
}

const BADGE: Record<string, string> = {
  RabbiGPT: "✡️",
  BuddhaGPT: "☸️",
  PastorGPT: "✝️",
  ImamGPT: "☪️",
  ComparisonGPT: "🔄",
};

// Default follow-ups if none are provided
const DEFAULT_FOLLOW_UPS = [
  "Can you explain that in simpler terms?",
  "Why is that important?",
  "What are practical applications of this?",
];

const Bubble: React.FC<BubbleProps> = ({
  message,
  model,
  onFollowupClick,
  isLoading = false,
}) => {
  const { content, role, followupSuggestions } = message;
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [showCard, setShowCard] = useState(false);

  // Use default follow-ups if none provided and this is an assistant message
  const followups =
    (role === "assistant" && followupSuggestions) ||
    (role === "assistant" ? DEFAULT_FOLLOW_UPS : []);

  // Find personality data for the avatar
  const personalityData = model
    ? PERSONALITIES.find((p) => p.model === model)
    : null;

  // Handle highlight selection - triggered on mouseup
  const handleHighlightSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setHighlightedText(selection.toString().trim());
      setShowCard(true);
    }
  };

  // Toggle highlight mode
  const toggleHighlightMode = () => {
    setIsHighlightMode(!isHighlightMode);
    if (isHighlightMode) {
      // Exit highlight mode
      setShowCard(false);
    }
  };

  // Add event listener for mouseup when in highlight mode
  useEffect(() => {
    if (isHighlightMode) {
      document.addEventListener("mouseup", handleHighlightSelection);
    } else {
      document.removeEventListener("mouseup", handleHighlightSelection);
    }

    return () => {
      document.removeEventListener("mouseup", handleHighlightSelection);
    };
  }, [isHighlightMode]);

  return (
    <div className="flex flex-col">
      <div
        className={`${
          role === "user"
            ? "bg-black/70 border-2 border-[#ddc39a]/40 text-[#ddc39a] rounded-[20px_20px_0_20px] ml-auto"
            : "bg-black/60 border-2 border-[#ddc39a]/20 text-[#ddc39a]/90 rounded-[20px_20px_20px_0]"
        } mx-2 my-3 p-5 text-[16px] shadow-lg backdrop-blur-sm max-w-[92%] text-left relative`}
      >
        {/* Add tools menu for assistant messages */}
        {role === "assistant" && (
          <div className="absolute top-2 right-2">
            <div className="relative">
              <button
                onClick={toggleHighlightMode}
                className={`p-1.5 rounded-full ${
                  isHighlightMode ? "bg-[#ddc39a]/50" : "bg-[#ddc39a]/10"
                } hover:bg-[#ddc39a]/30 transition-colors`}
                aria-label="Highlight text to share"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15L4 20L9 19L19 9M15 5L19 9M15 5L17 3L21 7L19 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Always visible tooltip */}
              <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-black/90 text-[#ddc39a] text-xs rounded-md whitespace-nowrap z-10 border border-[#ddc39a]/30">
                {isHighlightMode
                  ? "Exit highlight mode"
                  : "Highlight text to share"}
                <div className="absolute -top-1 right-2 w-2 h-2 bg-black/90 border-t border-l border-[#ddc39a]/30 transform rotate-45"></div>
              </div>
            </div>
          </div>
        )}

        {role === "assistant" && model && (
          <div className="flex items-center mb-4 pb-2 border-b border-[#ddc39a]/20">
            {personalityData?.image ? (
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-black/50 flex items-center justify-center">
                <Image
                  src={personalityData.image}
                  alt={model}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            ) : (
              <span className="mr-2 text-xl">{BADGE[model] || "🔹"}</span>
            )}
            <span className="font-medium">{model}</span>
          </div>
        )}
        {role === "assistant" ? (
          <>
            <div
              className={`markdown-content prose prose-invert prose-headings:text-[#ddc39a] prose-p:text-[#ddc39a]/90 prose-li:text-[#ddc39a]/90 max-w-none ${
                isHighlightMode ? "cursor-text selection:bg-[#ddc39a]/30" : ""
              }`}
            >
              <ReactMarkdown
                components={{
                  h1: (props) => (
                    <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                  ),
                  h2: (props) => (
                    <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
                  ),
                  h3: (props) => (
                    <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
                  ),
                  p: (props) => <p className="my-3" {...props} />,
                  ul: (props) => <ul className="my-3 space-y-2" {...props} />,
                  ol: (props) => <ol className="my-3 space-y-2" {...props} />,
                  li: (props) => <li className="ml-5" {...props} />,
                  blockquote: (props) => (
                    <blockquote
                      className="border-l-4 border-[#ddc39a]/30 pl-4 italic my-4"
                      {...props}
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Highlight instruction */}
            {isHighlightMode && (
              <div className="mt-2 text-sm text-[#ddc39a]/70 flex items-center p-2 bg-[#ddc39a]/10 rounded-md">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4V4.01M12 8V20M4.93 8.93L19.07 8.93"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Select text to create a shareable quote card
              </div>
            )}

            {/* Follow-up suggestions section */}
            {onFollowupClick && !isLoading && followups.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#ddc39a]/20">
                <p className="text-[#ddc39a]/80 text-sm mb-3">
                  Follow-up questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {followups.map((suggestion, i) => (
                    <button
                      key={`follow-up-${i}`}
                      onClick={() => onFollowupClick(suggestion)}
                      className="px-3 py-1.5 rounded-full bg-[#ddc39a]/10 text-[#ddc39a] text-sm hover:bg-[#ddc39a]/20 transition-colors border border-[#ddc39a]/30"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div>{content}</div>
        )}
      </div>

      {/* Quote Card Modal */}
      {showCard && (
        <QuoteCard
          text={highlightedText}
          author={model || "Perspective"}
          onClose={() => {
            setShowCard(false);
            setIsHighlightMode(false);
          }}
        />
      )}
    </div>
  );
};

export default Bubble;
