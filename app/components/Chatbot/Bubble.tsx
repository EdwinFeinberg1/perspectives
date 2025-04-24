interface BubbleProps {
  message: { content: string; role: "user" | "assistant" };
  model: "RabbiGPT" | "BuddhaGPT" | "PastorGPT";
}

const BADGE: Record<BubbleProps["model"], string> = {
  RabbiGPT: "✡️",
  BuddhaGPT: "☸️",
  PastorGPT: "✝️",
};

const Bubble: React.FC<BubbleProps> = ({ message, model }) => {
  const { content, role } = message;

  return (
    <div
      className={`${
        role === "user"
          ? "bg-[rgb(225,224,255)] rounded-[20px_20px_0_20px] ml-auto"
          : "bg-[#dce7ff] rounded-[20px_20px_20px_0]"
      } m-2 p-2 text-[15px] border-none text-[#383838] shadow-md w-4/5 text-left`}
    >
      {role === "assistant" && <span className="mr-1.5">{BADGE[model]}</span>}
      {content}
    </div>
  );
};

export default Bubble;
