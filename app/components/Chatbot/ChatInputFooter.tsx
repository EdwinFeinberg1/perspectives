"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT" | null;

// Prompt suggestions for each model
const SUGGESTIONS: Record<NonNullable<ModelName>, string[]> = {
  RabbiGPT: [
    "Make me a spiritual growth routine",
    "What is the meaning of life?",
    "How can I forgive someone?",
    "Why do prayers feel unanswered?",
    "How to resolve scriptural contradictions?",
    "What is God?",
  ],
  BuddhaGPT: [
    "What are the Four Noble Truths?",
    "How do I begin meditating?",
    "What is non-attachment in daily life?",
    "Why is suffering unavoidable?",
    "Explain the concept of karma",
    "What is enlightenment?",
  ],
  PastorGPT: [
    "What does Christianity teach about love?",
    "How can I strengthen my faith?",
    "What does the Bible say about forgiveness?",
    "How should I pray as a Christian?",
    "Explain the Holy Trinity",
    "What is salvation?",
  ],
};

interface ChatInputFooterProps {
  selectedModel: ModelName;
  input: string;
  isLoading?: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ChatInputFooter: React.FC<ChatInputFooterProps> = ({
  selectedModel,
  input,
  isLoading = false,
  handleInputChange,
  handleSubmit,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        sparklesRef.current &&
        !sparklesRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const insertSuggestion = (suggestion: string) => {
    // Create a new input event with the suggestion
    const inputEvent = {
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(inputEvent);
    setShowSuggestions(false);
  };

  if (!selectedModel) {
    return null;
  }

  return (
    <CardFooter className="flex flex-col p-0 bg-gradient-to-t from-black via-black/95 to-black/80 fixed bottom-0 left-0 right-0 z-10 border-t border-[#ddc39a]/20 py-8 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
      {/* Suggestion Panel Overlay */}
      {showSuggestions && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center pb-36 animate-fadeIn">
          <div
            ref={suggestionsRef}
            className="w-[95%] max-w-2xl bg-black/95 border-2 border-[#ddc39a]/60 rounded-xl shadow-[0_0_30px_rgba(221,195,154,0.3)] p-4 animate-slideUp"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#ddc39a]/20">
              <div className="text-[#ddc39a] font-medium text-lg flex items-center">
                <Sparkles size={18} className="mr-2 text-[#ddc39a]" />
                <span>Suggested prompts for {selectedModel}</span>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-[#ddc39a]/70 hover:text-[#ddc39a] p-1 rounded-full hover:bg-[#ddc39a]/10 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-2">
              {SUGGESTIONS[selectedModel].map((suggestion, i) => (
                <button
                  key={`suggestion-modal-${i}`}
                  type="button"
                  onClick={() => insertSuggestion(suggestion)}
                  className="text-left py-3 px-4 text-[#ddc39a]/90 bg-black/60 hover:bg-[#ddc39a]/20 border border-[#ddc39a]/20 hover:border-[#ddc39a]/40 rounded-lg transition-all duration-150 text-sm shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto px-4 flex flex-col items-center">
        <div className="text-xs text-[#ddc39a]/60 mb-2 tracking-wider uppercase font-medium">
          {selectedModel} is listening...
        </div>
        <form
          onSubmit={handleSubmit}
          className={`flex items-center w-full px-6 py-4 rounded-2xl 
            ${isFocused ? "bg-black/90" : "bg-black/80"} 
            border-2 ${
              isFocused ? "border-[#ddc39a]/70" : "border-[#ddc39a]/30"
            } 
            shadow-[0_0_15px_rgba(221,195,154,0.15)] transition-all duration-300 backdrop-blur-sm`}
        >
          <div
            ref={sparklesRef}
            onClick={toggleSuggestions}
            className={`cursor-pointer transform transition-all duration-300 p-2 -ml-2 rounded-full
              ${
                showSuggestions
                  ? "bg-[#ddc39a]/20 scale-110 text-[#ddc39a] rotate-12"
                  : "text-[#ddc39a]/60 hover:text-[#ddc39a] hover:bg-black/40 hover:scale-105"
              }`}
          >
            <Sparkles size={20} className="mr-3" />
          </div>

          <Input
            value={input}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={`Ask ${selectedModel} anything`}
            className="flex-1 bg-transparent border-none text-[#ddc39a] rounded-md text-lg mr-4 placeholder:text-[#ddc39a]/40 focus:outline-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className={`rounded-full 
              ${
                isLoading
                  ? "bg-[#ddc39a]/40"
                  : "bg-gradient-to-r from-[#ddc39a] to-[#e6d3a3]"
              } 
              hover:shadow-[0_0_15px_rgba(221,195,154,0.4)] text-black w-14 h-14 p-0 flex items-center justify-center
              transition-all duration-300 transform hover:scale-105 active:scale-95`}
            size="icon"
            disabled={isLoading}
          >
            <Send size={24} className="drop-shadow-md" />
          </Button>
        </form>
      </div>
    </CardFooter>
  );
};

export default ChatInputFooter;
