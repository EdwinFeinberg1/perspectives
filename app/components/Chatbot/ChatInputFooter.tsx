"use client";

import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT" | null;

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
  if (!selectedModel) {
    return null;
  }

  return (
    <CardFooter className="flex flex-col p-0 bg-black fixed bottom-0 left-0 right-0 z-10 border-t border-slate-800 py-6">
      <form
        onSubmit={handleSubmit}
        className="flex items-center max-w-3xl mx-auto w-full px-6 py-4 rounded-full bg-black border-2 border-slate-700 shadow-lg"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={`Ask ${selectedModel} anything`}
          className="flex-1 bg-transparent border-none text-white rounded-md text-lg mr-4"
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="rounded-full bg-amber-400/80 hover:bg-amber-400 text-black w-12 h-12 p-0 flex items-center justify-center"
          size="icon"
          disabled={isLoading}
        >
          <Send size={24} />
        </Button>
      </form>
    </CardFooter>
  );
};

export default ChatInputFooter;
