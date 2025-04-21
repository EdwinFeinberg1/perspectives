const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button
      className="prompt-suggestion-button"
      onClick={onClick}
      style={{
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </button>
  );
};
export default PromptSuggestionButton;
