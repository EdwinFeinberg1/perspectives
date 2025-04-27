"use client";

import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PromptSuggestionRow from "./PromptSuggestionRow";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT";

interface ChatInputFooterProps {
  selectedModel: ModelName;
  input: string;
  isLoading?: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  sendPrompt: (prompt: string) => void;
}

const ChatInputFooter: React.FC<ChatInputFooterProps> = ({
  selectedModel,
  input,
  isLoading = false,
  handleInputChange,
  handleSubmit,
  sendPrompt,
}) => {
  return (
    <CardFooter className="flex flex-col p-0 bg-black fixed bottom-0 left-0 right-0 z-10 border-t border-slate-800">
      <div className="w-full p-2 overflow-hidden">
        <PromptSuggestionRow model={selectedModel} onPromptClick={sendPrompt} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex max-w-3xl mx-auto w-full px-4 py-3 mb-2 rounded-full bg-black border border-slate-700 shadow-lg"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={`Ask ${selectedModel} anything`}
          className="flex-1 bg-transparent border-none text-white rounded-md"
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="rounded-full bg-amber-400/80 hover:bg-amber-400 text-black w-10 h-10 p-0 flex items-center justify-center"
          size="icon"
          disabled={isLoading}
        >
          <Send size={18} />
        </Button>
      </form>
    </CardFooter>
  );
};

export default ChatInputFooter;
