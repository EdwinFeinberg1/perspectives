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
      className="w-full py-2 px-3 text-sm border border-[#ddc39a]/30 bg-black/60 rounded-lg text-[#ddc39a] shadow-md hover:bg-black/80 hover:border-[#ddc39a] transition-all duration-200 cursor-pointer"
      onClick={onClick}
      title={text}
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
