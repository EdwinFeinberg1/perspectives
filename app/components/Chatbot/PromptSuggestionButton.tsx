interface PromptSuggestionButtonProps {
  text: string;
  onClick: () => void;
}

const PromptSuggestionButton: React.FC<PromptSuggestionButtonProps> = ({
  text,
  onClick,
}) => {
  return (
    <button
      className="w-full py-2 px-3 text-sm border border-[#e6d3a3]/50 bg-black/80 rounded-lg text-[#f0e4c3] shadow-md hover:bg-black/90 hover:border-[#f0e4c3] transition-all duration-200 cursor-pointer"
      onClick={onClick}
      title={text}
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
