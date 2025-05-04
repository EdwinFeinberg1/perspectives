import React from "react";
import ReactMarkdown from "react-markdown";

interface BubbleProps {
  message: {
    content: string;
    role: "user" | "assistant";
    followupSuggestions?: string[];
  };
  model: string;
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

  return (
    <div className="flex flex-col">
      <div
        className={`${
          role === "user"
            ? "bg-black/70 border-2 border-[#ddc39a]/40 text-[#ddc39a] rounded-[20px_20px_0_20px] ml-auto"
            : "bg-black/60 border-2 border-[#ddc39a]/20 text-[#ddc39a]/90 rounded-[20px_20px_20px_0]"
        } mx-2 my-3 p-5 text-[16px] shadow-lg backdrop-blur-sm max-w-[92%] text-left`}
      >
        {role === "assistant" && model && (
          <div className="flex items-center mb-4 pb-2 border-b border-[#ddc39a]/20">
            <span className="mr-2 text-xl">{BADGE[model] || "🔹"}</span>
            <span className="font-medium">{model}</span>
          </div>
        )}
        {role === "assistant" ? (
          <>
            <div className="markdown-content prose prose-invert prose-headings:text-[#ddc39a] prose-p:text-[#ddc39a]/90 prose-li:text-[#ddc39a]/90 max-w-none">
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
    </div>
  );
};

export default Bubble;
