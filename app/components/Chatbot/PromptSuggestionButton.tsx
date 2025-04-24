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
      className="m-1 py-1.5 px-3 text-[13px] border-none bg-white rounded-[10px] text-[#383838] shadow-md cursor-pointer flex-shrink-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]"
      onClick={onClick}
      title={text}
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
