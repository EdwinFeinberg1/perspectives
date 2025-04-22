import PromptSuggestionButton from "./PromptSuggestionButton";

interface Props {
  onPromptClick: (prompt: string) => void;
}

const PromptSuggestionRow: React.FC<Props> = ({ onPromptClick }) => {
  const prompts = [
    "What is Judaism?",
    "Why do my prayers sometimes feel unanswered?",
    "Is free will real if an all-knowing deity already knows my choices?",
    "How can I forgive someone who has deeply hurt me?",
    "How should I balance worldly success with spiritual growth?",
    "What is the meaning of life?",
    "What is the purpose of suffering?",
  ];

  return (
    <div className="prompt-suggestion-row">
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton
          key={`suggestion-${index}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};
export default PromptSuggestionRow;
