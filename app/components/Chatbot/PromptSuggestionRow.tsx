import PromptSuggestionButton from "./PromptSuggestionButton";

interface Props {
  model: "RabbiGPT" | "BuddhaGPT" | "PastorGPT";
  onPromptClick: (prompt: string) => void;
}

// Normalize suggestions to have consistent length across models
const SUGGESTIONS: Record<Props["model"], string[]> = {
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

const PromptSuggestionRow: React.FC<Props> = ({ model, onPromptClick }) => {
  return (
    <div className="w-full h-full flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-2">
      {SUGGESTIONS[model].map((prompt, i) => (
        <PromptSuggestionButton
          key={`suggestion-${i}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionRow;
