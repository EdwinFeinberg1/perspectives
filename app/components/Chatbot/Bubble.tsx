import React from "react";

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
    <div className="flex flex-col">
      <div
        className={`${
          role === "user"
            ? "bg-black/70 border-2 border-[#ddc39a]/40 text-[#ddc39a] rounded-[20px_20px_0_20px] ml-auto"
            : "bg-black/60 border-2 border-[#ddc39a]/20 text-[#ddc39a]/90 rounded-[20px_20px_20px_0]"
        } mx-6 my-3 p-5 text-[16px] shadow-lg backdrop-blur-sm max-w-[85%] text-left`}
      >
        {role === "assistant" && (
          <div className="flex items-center mb-2 pb-2 border-b border-[#ddc39a]/20">
            <span className="mr-2 text-xl">{BADGE[model]}</span>
            <span className="font-medium">{model}</span>
          </div>
        )}
        {content}
      </div>
    </div>
  );
};

export default Bubble;
