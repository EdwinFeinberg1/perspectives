"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { Message } from "ai";
import { Send } from "lucide-react";
import Bubble from "./Bubble";
import LoadingBubble from "./LoadingBubble";
import PromptSuggestionRow from "./PromptSuggestionRow";
import { useRouter } from "next/navigation";

export type ModelType = "RabbiGPT" | "BuddhaGPT" | "PastorGPT";

const modelToApi = (model: ModelType) => {
  if (model === "RabbiGPT") return "/api/chat/judaism";
  if (model === "BuddhaGPT") return "/api/chat/buddha";
  if (model === "PastorGPT") return "/api/chat/christianity";
  return "/api/chat/judaism";
};

interface ChatbotProps {
  initialMessages?: Message[];
  initialModel?: ModelType;
}

const FullChat: React.FC<ChatbotProps> = ({
  initialMessages,
  initialModel = "RabbiGPT",
}) => {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<ModelType>(initialModel);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    id: `chat-${selectedModel.toLowerCase()}`,
    api: modelToApi(selectedModel),
  });

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      initialMessages.forEach((msg) => append(msg));
    }
  }, [initialMessages]);

  const handlePromptClick = (promptText: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg);
  };

  const handleModelSelect = (model: ModelType) => {
    setSelectedModel(model);
    setShowDropdown(false);
  };

  const handleNewChat = () => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    sessionStorage.setItem("chatModel", selectedModel);
    router.push("/chats");
  };

  return (
    <div className="flex flex-col h-full w-full flex-1 bg-[#1a1e2d] overflow-hidden font-[Inter,system-ui,sans-serif] font-medium tracking-normal relative transition-all duration-300">
      <div className="flex justify-between items-center p-0 h-[60px] bg-[#0f1117] border-b border-white/10">
        <div className="w-full max-w-[1024px] px-4 mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-[#e6c682] tracking-wider">
              Perspectives
            </span>
          </div>
          <div className="relative">
            <button
              className="py-2 px-4 bg-[#293040] text-[#e6c682] border border-[rgba(255,215,125,0.2)] rounded-md font-semibold text-sm cursor-pointer tracking-wider transition-all duration-200 shadow-sm hover:bg-[#353f54] hover:border-[rgba(255,215,125,0.5)] hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedModel}
            </button>
            {showDropdown && (
              <div className="absolute top-[110%] left-1/2 -translate-x-1/2 mt-[5px] bg-[#293040] border border-[rgba(255,215,125,0.15)] rounded-lg overflow-hidden z-10 shadow-lg animate-fadeIn min-w-[160px]">
                <button
                  className={`block w-full py-3 px-5 text-left bg-black border-none text-[#e6c682] cursor-pointer tracking-wide transition-all duration-200 relative font-medium hover:bg-[rgba(255,215,125,0.08)] ${
                    selectedModel === "RabbiGPT"
                      ? "bg-[rgba(255,215,125,0.15)] font-semibold"
                      : ""
                  }`}
                  onClick={() => handleModelSelect("RabbiGPT")}
                >
                  RabbiGPT
                </button>
                <button
                  className={`block w-full py-3 px-5 text-left bg-black border-none text-[#e6c682] cursor-pointer tracking-wide transition-all duration-200 relative font-medium hover:bg-[rgba(255,215,125,0.08)] ${
                    selectedModel === "BuddhaGPT"
                      ? "bg-[rgba(255,215,125,0.15)] font-semibold"
                      : ""
                  }`}
                  onClick={() => handleModelSelect("BuddhaGPT")}
                >
                  BuddhaGPT
                </button>
                <button
                  className={`block w-full py-3 px-5 text-left bg-black border-none text-[#e6c682] cursor-pointer tracking-wide transition-all duration-200 relative font-medium hover:bg-[rgba(255,215,125,0.08)] ${
                    selectedModel === "PastorGPT"
                      ? "bg-[rgba(255,215,125,0.15)] font-semibold"
                      : ""
                  }`}
                  onClick={() => handleModelSelect("PastorGPT")}
                >
                  PastorGPT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto py-4 pb-[100px] max-w-[768px] w-full mx-auto scroll-smooth relative ${
          messages.length === 0 ? "flex justify-center items-center" : ""
        }`}
      >
        {messages.map((message, index) => (
          <Bubble
            key={message.id || index}
            message={{
              content: message.content,
              role: message.role as "user" | "assistant",
            }}
            model={selectedModel}
          />
        ))}
        {isLoading && (
          <div className="flex justify-center my-4">
            <LoadingBubble />
          </div>
        )}
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 flex flex-col bg-[#1a1e2d] z-10 max-w-[800px] mx-auto overflow-hidden transition-all duration-300 shadow-lg border-t border-white/10 ${
          messages.length === 0
            ? "relative rounded-xl border border-[rgba(255,215,125,0.12)] shadow-xl mb-[20vh] bg-[#1f2535]"
            : ""
        }`}
      >
        <div className="py-3 px-4 bg-[#161c28] border-t border-[rgba(255,215,125,0.08)]">
          <PromptSuggestionRow
            model={selectedModel}
            onPromptClick={handlePromptClick}
          />
        </div>
        <form
          className="flex flex-nowrap p-4 w-full bg-[#1f2535] items-center border-t border-white/5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-1 bg-[#1f2535] rounded-lg shadow-md p-1.5 mx-2">
            <input
              className="flex-1 min-w-0 py-3 px-4 bg-[#293040] h-[50px] text-[#f0f0f0] border border-[rgba(255,215,125,0.15)] rounded-[10px] font-normal text-[15px] transition-all duration-300 shadow-sm focus:outline-none focus:border-[rgba(255,215,125,0.5)] focus:shadow-[0_0_0_2px_rgba(255,215,125,0.1)] placeholder:text-[#f0f0f0]/50 placeholder:font-normal"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
            />
            <button
              type="submit"
              className="ml-2 flex items-center justify-center w-[50px] h-[50px] bg-[#4e4a36] text-[#e6c682] border-none rounded-[10px] cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[#5a573e] active:translate-y-0"
            >
              <Send size={18} />
            </button>
          </div>
          <button
            type="button"
            className="ml-2 py-0 px-4 bg-[#293040] text-[#e6c682] border border-[rgba(255,215,125,0.15)] rounded-[10px] h-[50px] cursor-pointer font-medium text-sm tracking-wide transition-all duration-200 shadow-sm whitespace-nowrap min-w-[100px] hover:-translate-y-0.5 hover:shadow-md hover:bg-[#36425a] active:translate-y-0"
            onClick={handleNewChat}
          >
            New Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default FullChat;
