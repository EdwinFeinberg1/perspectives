import PromptSuggestionButton from "./PromptSuggestionButton";

interface Props {
  model: "RabbiGPT" | "BuddhaGPT" | "PastorGPT";
  onPromptClick: (prompt: string) => void;
}

const SUGGESTIONS: Record<Props["model"], string[]> = {
  RabbiGPT: [
    "What is Judaism?",
    "What is the meaning of life?",
    "How can I forgive someone who hurt me?",
    "Why do my prayers feel unanswered?",
  ],
  BuddhaGPT: [
    "What are the Four Noble Truths?",
    "How do I begin meditating?",
    "What is non-attachment in daily life?",
    "Why is suffering unavoidable?",
  ],
  PastorGPT: [
    "What does Christianity teach about love?",
    "How can I strengthen my faith?",
    "What does the Bible say about forgiveness?",
    "How should I pray as a Christian?",
  ],
};

const PromptSuggestionRow: React.FC<Props> = ({ model, onPromptClick }) => {
  return (
    <div className="w-full flex overflow-x-auto scrollbar-hide">
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
