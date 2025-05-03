import React from "react";
import ReactMarkdown from "react-markdown";
import { ModelName } from "../types";

interface BubbleProps {
  message: {
    content: string;
    role: "user" | "assistant";
    followupSuggestions?: string[];
  };
  model: ModelName;
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

  // Use default follow-ups if none provided and this is an assistant message
  const followups =
    (role === "assistant" && followupSuggestions) ||
    (role === "assistant" ? DEFAULT_FOLLOW_UPS : []);

  // Share functionality
  const handleShare = async () => {
    if (role === "assistant" && content && model) {
      // Create shareable text
      const shareText = `${model}'s perspective:\n\n${content}`;

      // Check if Web Share API is available
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${model}'s Perspective`,
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
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <div
        className={`${
          role === "user"
            ? " border-[#e6d3a3]/60 text-[#f0e4c3] rounded-[20px_20px_0_20px] ml-auto"
            : "border-2 border-[#e6d3a3]/40 text-[#f0e4c3] rounded-[20px_20px_20px_0]"
        } mx-2 sm:mx-4 my-2 sm:my-3 p-3 sm:p-5 text-[14px] sm:text-[16px] shadow-lg backdrop-blur-sm max-w-[95%] text-left`}
      >
        {role === "assistant" && model && (
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e6d3a3]/30">
            <div className="flex items-center">
              <span className="mr-2 text-xl">{BADGE[model] || "🔹"}</span>
              <span className="font-medium text-sm sm:text-base">{model}</span>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="text-[#e6d3a3] hover:text-[#ffffff] transition-colors"
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
        )}
        {role === "assistant" ? (
          <>
            <div className="markdown-content prose prose-invert prose-headings:text-[#f0e4c3] prose-p:text-[#f0e4c3] prose-li:text-[#f0e4c3] max-w-none">
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
                      className="border-l-4 border-[#e6d3a3]/50 pl-4 italic my-4"
                      {...props}
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Follow-up suggestions section */}
            {onFollowupClick && !isLoading && followups.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#e6d3a3]/30">
                <p className="text-[#e6d3a3] text-sm mb-3">
                  Follow-up questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {followups.map((suggestion, i) => (
                    <button
                      key={`follow-up-${i}`}
                      onClick={() => onFollowupClick(suggestion)}
                      className="px-3 py-1.5 rounded-full bg-[#e6d3a3]/20 text-[#f0e4c3] text-sm hover:bg-[#e6d3a3]/30 transition-colors border border-[#e6d3a3]/50"
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
    </div>
  );
};

export default Bubble;
