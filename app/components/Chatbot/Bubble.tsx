/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { PERSONALITIES } from "@/app/constants/personalities";
import Image from "next/image";
import QuoteCard from "./QuoteCard";

// Define the shape of the summarizeParshah result
interface SummarizeParshahResult {
  summary: string;
  source: string;
}

interface BubbleProps {
  message: {
    content: string;
    role: "user" | "assistant";
    followupSuggestions?: string[];
    // Use any for parts and toolInvocations to avoid type errors
    parts?: any[];
    toolInvocations?: any[];
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
  const { content, role, followupSuggestions, toolInvocations } = message;
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [highlightedHtml, setHighlightedHtml] = useState("");
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
      // Grab the plain text for sharing purposes
      setHighlightedText(selection.toString().trim());

      // Capture the selected HTML fragment for rich rendering
      try {
        const range = selection.getRangeAt(0);
        const clonedContents = range.cloneContents();
        const div = document.createElement("div");
        div.appendChild(clonedContents);
        setHighlightedHtml(div.innerHTML);
      } catch {
        // Fallback: store just the plain text if something goes wrong
        setHighlightedHtml(selection.toString().trim());
      }

      setShowCard(true);
    }
  };

  // Toggle highlight mode
  const toggleHighlightMode = () => {
    setIsHighlightMode(!isHighlightMode);
    if (isHighlightMode) {
      // Exit highlight mode
      setShowCard(false);
      setHighlightedHtml("");
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

  // Check if we have tool results to display
  const hasToolResults = toolInvocations?.some((ti) => ti.state === "result");

  // Extract tool result content if available
  let toolContent = "";
  if (hasToolResults && toolInvocations) {
    const summarizeResult = toolInvocations.find(
      (ti) => ti.toolName === "summarizeParshah" && ti.state === "result"
    );

    if (summarizeResult?.result) {
      const result = summarizeResult.result as SummarizeParshahResult;
      toolContent = `## This Week's Torah Portion

${result.summary}

[Read the full text on Sefaria](${result.source})`;
    }
  }

  // Content to display - use tool content if available, otherwise use message content
  const displayContent = toolContent || content;

  return (
    <div className="flex flex-col">
      <div
        className={`${
          role === "user"
            ? "bg-card border-2 border-border text-foreground rounded-[20px_20px_0_20px] ml-auto"
            : "bg-muted border-2 border-border text-foreground rounded-[20px_20px_20px_0]"
        } mx-2 my-3 p-5 text-[16px] max-w-[92%] text-left relative`}
      >
        {/* Add tools menu for assistant messages */}
        {role === "assistant" && (
          <div className="absolute top-2 right-2">
            <div className="relative">
              <button
                onClick={toggleHighlightMode}
                className={`p-1.5 rounded-full ${
                  isHighlightMode ? "bg-amber-900/50" : "bg-amber-900/10"
                } hover:bg-amber-900/30 transition-colors`}
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
              <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-md whitespace-nowrap z-10 border border-gray-600">
                {isHighlightMode
                  ? "Exit highlight mode"
                  : "Highlight text to share"}
                <div className="absolute -top-1 right-2 w-2 h-2 bg-black/90 border-t border-l border-gray-600 transform rotate-45"></div>
              </div>
            </div>
          </div>
        )}

        {role === "assistant" && model && (
          <div className="flex items-center mb-4 pb-2 border-b border-border/20">
            {personalityData?.image ? (
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-background/50 flex items-center justify-center">
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
              className={`markdown-content prose dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-a:text-primary max-w-none ${
                isHighlightMode ? "cursor-text selection:bg-primary/30" : ""
              }`}
            >
              {/* If tools are being called but no result yet */}
              {toolInvocations?.some(
                (ti) =>
                  (ti.state === "call" || ti.state === "partial-call") &&
                  !toolContent
              ) && (
                <div className="text-muted-foreground italic">
                  Gathering information about this week&apos;s Torah portion...
                </div>
              )}

              {/* Display content when available */}
              {displayContent && (
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
                        className="border-l-4 border-border/30 pl-4 italic my-4"
                        {...props}
                      />
                    ),
                    a: (props) => (
                      <a
                        className="text-primary underline hover:text-primary/80"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              )}
            </div>

            {/* Highlight instruction */}
            {isHighlightMode && (
              <div className="mt-2 text-sm text-muted-foreground flex items-center p-2 bg-muted/50 rounded-md">
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
              <div className="mt-5 pt-4 border-t border-border/20">
                <p className="text-muted-foreground text-sm mb-3">
                  Follow-up questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {followups.map((suggestion, i) => (
                    <button
                      key={`follow-up-${i}`}
                      onClick={() => onFollowupClick(suggestion)}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 hover:scale-[1.02] transition-all duration-200 border border-primary/30 shadow-sm hover:shadow-md cursor-pointer font-medium"
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
          html={highlightedHtml}
          author={model || "Perspective"}
          onClose={() => {
            setShowCard(false);
            setIsHighlightMode(false);
            setHighlightedHtml("");
          }}
        />
      )}
    </div>
  );
};

export default Bubble;
