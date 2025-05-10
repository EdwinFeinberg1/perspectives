"use client";

import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { PERSONALITIES } from "@/app/constants/personalities";

// Allow any model name for better compatibility
type ModelType = string | null;

interface ChatInputFooterProps {
  selectedModel: ModelType;
  input: string;
  isLoading?: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onModelSelect?: (model: string) => void;
}

// Avatar button component for model selection
const AvatarButton: React.FC<{
  personality: (typeof PERSONALITIES)[number];
  isActive: boolean;
  onClick: () => void;
}> = ({ personality, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-full overflow-hidden transition-all duration-300 hover:scale-110 ${
        isActive
          ? "ring-2 ring-[#e6d3a3] drop-shadow-[0_0_5px_rgba(230,211,163,0.6)]"
          : "hover:ring-1 hover:ring-[#e6d3a3]/60"
      }`}
      title={`Switch to ${personality.title}`}
      aria-label={`Switch to ${personality.title}`}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/70 text-lg">
        {personality.image ? (
          <Image
            src={personality.image}
            alt={personality.title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{personality.emoji}</span>
        )}
      </div>
      {isActive && (
        <div className="absolute inset-0 bg-[#e6d3a3]/10 pointer-events-none"></div>
      )}
    </button>
  );
};

const ChatInputFooter: React.FC<ChatInputFooterProps> = ({
  selectedModel,
  input,
  isLoading = false,
  handleInputChange,
  handleSubmit,
  onModelSelect,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hoverModel, setHoverModel] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(selectedModel);

  // Update local state when selectedModel prop changes
  useEffect(() => {
    setActiveModel(selectedModel);
  }, [selectedModel]);

  // Listen for global prefillPrompt events (from DynamicTheme)
  useEffect(() => {
    // Define insertSuggestion inside the effect to ensure it always uses the latest handleInputChange
    const insertSuggestion = (suggestion: string) => {
      // Create a new input event with the suggestion
      const inputEvent = {
        target: { value: suggestion },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(inputEvent);
    };

    const listener = (e: Event) => {
      const custom = e as CustomEvent<{ prompt: string; model?: string }>;
      if (custom?.detail?.prompt) {
        insertSuggestion(custom.detail.prompt);

        // Always select the model if it's provided
        if (custom?.detail?.model && onModelSelect) {
          console.log(
            `ChatInputFooter: Received model selection event for ${custom.detail.model}`
          );
          // Force a slightly longer delay for React state updates to stabilize
          setTimeout(() => {
            console.log(
              `ChatInputFooter: Selecting model ${custom.detail.model}`
            );
            onModelSelect(custom.detail.model);
          }, 100);
        }
      }
    };

    window.addEventListener("prefillPrompt", listener);

    return () => window.removeEventListener("prefillPrompt", listener);
  }, [handleInputChange, onModelSelect]); // Add onModelSelect as a dependency

  // Handler for avatar click
  const handleAvatarClick = (model: string) => {
    if (onModelSelect) {
      console.log(`ChatInputFooter: Avatar clicked, switching to ${model}`);
      // Update local state immediately for visual feedback
      setActiveModel(model);
      // Notify parent component
      onModelSelect(model);
    }
  };

  return (
    <CardFooter className="flex flex-col p-0 sticky bottom-[env(safe-area-inset-bottom)] left-0 right-0 z-20 py-4 sm:py-8 sm:px-4">
      <div className="w-full max-w-3xl mx-auto px-6 sm:px-8 flex flex-col items-center">
        {/* Avatar selection row */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-4 pb-2 w-[92%] sm:w-full bg-black/30 backdrop-blur-sm rounded-full px-2 sm:px-4 py-2">
          <div className="text-[#e6d3a3]/80 text-xs mr-1 self-center hidden sm:block">
            Switch:
          </div>
          {PERSONALITIES.map((personality) => (
            <div
              key={personality.model}
              className="relative group"
              onMouseEnter={() => setHoverModel(personality.model)}
              onMouseLeave={() => setHoverModel(null)}
            >
              <AvatarButton
                personality={personality}
                isActive={activeModel === personality.model}
                onClick={() => handleAvatarClick(personality.model)}
              />
              {hoverModel === personality.model &&
                personality.model !== activeModel && (
                  <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black/90 text-[#e6d3a3] text-xs px-2 py-1 rounded whitespace-nowrap hidden sm:block">
                    Switch to {personality.title}
                  </div>
                )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className={`flex items-center w-[92%] sm:w-full px-3 sm:px-6 py-2.5 sm:py-4 rounded-2xl 
            ${isFocused ? "bg-black" : "bg-black/90"} 
            border-2 ${
              isFocused ? "border-[#e6d3a3]/80" : "border-[#e6d3a3]/50"
            } 
            shadow-[0_0_15px_rgba(230,211,163,0.2)] transition-all duration-300 backdrop-blur-sm
            hover:shadow-[0_0_18px_rgba(230,211,163,0.3)]`}
        >
          <Input
            value={input}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              activeModel
                ? `Ask ${activeModel}...`
                : "Select a perspective to begin..."
            }
            className="flex-1 bg-transparent border-none text-[#f0e4c3] rounded-md text-sm sm:text-lg mr-2 sm:mr-4 placeholder:text-[#e6d3a3]/60 focus:outline-none font-light tracking-wide min-h-[40px] py-1 sm:py-2 px-2 sm:px-8"
            disabled={isLoading || !activeModel}
          />
          <Button
            type="submit"
            className={`
              p-2 sm:p-3 min-w-[35px] min-h-[30px] flex items-center justify-center
              bg-black/50 rounded-full border border-[#e6d3a3]/30 text-[#f0e4c3]
              hover:bg-black/80 hover:border-[#e6d3a3]/60 transition-all duration-300 
              hover:shadow-[0_0_15px_rgba(230,211,163,0.3)] hover:scale-105
              ${isLoading || !activeModel ? "opacity-60" : "opacity-100"}`}
            disabled={isLoading || !activeModel}
          >
            <Send size={18} className="drop-shadow-md sm:size-20" />
          </Button>
        </form>
      </div>
    </CardFooter>
  );
};

export default ChatInputFooter;
