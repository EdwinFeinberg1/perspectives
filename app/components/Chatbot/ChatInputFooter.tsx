"use client";

import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

const ChatInputFooter: React.FC<ChatInputFooterProps> = ({
  selectedModel,
  input,
  isLoading = false,
  handleInputChange,
  handleSubmit,
  onModelSelect,
}) => {
  const [isFocused, setIsFocused] = useState(false);

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

  return (
    <CardFooter className="flex flex-col p-0 fixed bottom-[60px] left-0 right-0 z-20 py-8 py-4 sm:py-8">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className={`flex items-center w-full px-3 py-2 sm:px-6 sm:py-3 rounded-2xl 
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
              selectedModel
                ? `Ask ${selectedModel} anything`
                : "Pick a perspective or click a prompt at the top to begin..."
            }
            className="flex-1 bg-transparent border-none text-[#f0e4c3] rounded-md text-sm sm:text-lg mr-2 sm:mr-4 placeholder:text-[#e6d3a3]/60 focus:outline-none font-light tracking-wide"
            disabled={isLoading || !selectedModel}
          />
          <Button
            type="submit"
            className={`
              bg-transparent p-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center
              transition-all duration-300 transform hover:scale-110 active:scale-95
              hover:shadow-none border-none text-[#f0e4c3] ${
                isLoading || !selectedModel ? "opacity-60" : "opacity-100"
              }`}
            size="icon"
            disabled={isLoading || !selectedModel}
          >
            <Send
              size={20}
              className="sm:size-26 drop-shadow-md hover:drop-shadow-lg"
            />
          </Button>
        </form>
      </div>
    </CardFooter>
  );
};

export default ChatInputFooter;
