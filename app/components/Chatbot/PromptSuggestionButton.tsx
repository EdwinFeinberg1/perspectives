const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button
      className="m-2 py-2 px-4 text-[15px] border-none bg-white rounded-[10px] text-[#383838] shadow-md cursor-pointer flex-shrink-0 whitespace-nowrap"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
export default PromptSuggestionButton;
