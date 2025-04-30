"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Allow any model name for better compatibility
type ModelType = string | null;

// Prompt suggestions for each model
const SUGGESTIONS: Record<string, string[]> = {
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
  ImamGPT: [
    "What are the Five Pillars of Islam?",
    "How should I pray as a Muslim?",
    "Explain the concept of Ramadan",
    "What does the Quran teach about compassion?",
    "How can I practice mindfulness in Islam?",
    "What is the Islamic view on faith and good deeds?",
  ],
  ComparisonGPT: [
    "What happens after death?",
    "How should we treat others?",
    "What is the purpose of prayer?",
    "How does one find meaning in suffering?",
    "What does your tradition say about forgiveness?",
    "How should we balance tradition and modernity?",
  ],
};

interface ChatInputFooterProps {
  selectedModel: ModelType;
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

  // Get suggestions for the current model
  const modelSuggestions = SUGGESTIONS[selectedModel] || [];

  return (
    <CardFooter className="flex flex-col p-0 bg-gradient-to-t from-black via-black/95 to-black/80 fixed bottom-0 left-0 right-0 z-10 border-t border-[#e6d3a3]/30 py-8 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
      {/* Suggestion Panel Overlay */}
      {showSuggestions && modelSuggestions.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center pb-36 animate-fadeIn">
          <div
            ref={suggestionsRef}
            className="w-[95%] max-w-2xl bg-black/95 border-2 border-[#e6d3a3]/70 rounded-xl shadow-[0_0_30px_rgba(230,211,163,0.3)] p-4 animate-slideUp"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e6d3a3]/30">
              <div className="text-[#f0e4c3] font-medium text-lg flex items-center">
                <Sparkles size={18} className="mr-2 text-[#f0e4c3]" />
                <span>Suggested prompts for {selectedModel}</span>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-[#e6d3a3] hover:text-[#ffffff] p-1 rounded-full hover:bg-[#e6d3a3]/20 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-2">
              {modelSuggestions.map((suggestion, i) => (
                <button
                  key={`suggestion-modal-${i}`}
                  type="button"
                  onClick={() => insertSuggestion(suggestion)}
                  className="text-left py-3 px-4 text-[#f0e4c3] bg-black/80 hover:bg-[#e6d3a3]/30 border border-[#e6d3a3]/40 hover:border-[#e6d3a3]/60 rounded-lg transition-all duration-150 text-sm shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto px-4 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className={`flex items-center w-full px-6 py-3 rounded-2xl 
            ${isFocused ? "bg-black" : "bg-black/90"} 
            border-2 ${
              isFocused ? "border-[#e6d3a3]/80" : "border-[#e6d3a3]/50"
            } 
            shadow-[0_0_15px_rgba(230,211,163,0.2)] transition-all duration-300 backdrop-blur-sm
            hover:shadow-[0_0_18px_rgba(230,211,163,0.3)]`}
        >
          <div
            ref={sparklesRef}
            onClick={toggleSuggestions}
            className={`cursor-pointer transform transition-all duration-300 p-2 -ml-2 rounded-full
              ${
                showSuggestions
                  ? "bg-[#e6d3a3]/30 scale-110 text-[#f0e4c3] rotate-12"
                  : "text-[#e6d3a3] hover:text-[#ffffff] hover:bg-black/60 hover:scale-105"
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
            className="flex-1 bg-transparent border-none text-[#f0e4c3] rounded-md text-lg mr-4 placeholder:text-[#e6d3a3]/60 focus:outline-none font-light tracking-wide"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className={`
              bg-transparent p-0 h-12 w-12 flex items-center justify-center
              transition-all duration-300 transform hover:scale-110 active:scale-95
              hover:shadow-none border-none text-[#f0e4c3] ${
                isLoading ? "opacity-60" : "opacity-100"
              }`}
            size="icon"
            disabled={isLoading}
          >
            <Send size={26} className="drop-shadow-md hover:drop-shadow-lg" />
          </Button>
        </form>
      </div>
    </CardFooter>
  );
};

export default ChatInputFooter;
