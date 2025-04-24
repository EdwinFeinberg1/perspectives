"use client";

import React, { useState } from "react";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import PromptSuggestionRow from "./Chatbot/PromptSuggestionRow";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT";

const apiRoute = (m: ModelName) =>
  m === "RabbiGPT"
    ? "/api/chat/judaism"
    : m === "BuddhaGPT"
    ? "/api/chat/buddha"
    : "/api/chat/christianity";

const LandingChatbot: React.FC = () => {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<ModelName>("RabbiGPT");

  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    id: `landing-${selectedModel.toLowerCase()}`,
    api: apiRoute(selectedModel),
  });

  const sendPrompt = (p: string) =>
    append({ id: crypto.randomUUID(), role: "user", content: p });

  const goToFullChat = () => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    sessionStorage.setItem("chatModel", selectedModel);
    router.push("/chats");
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden border-sky-700 rounded-[10px] shadow-xl border border-[rgba(64,122,214,0.15)]">
      <CardHeader className="px-4 py-3 flex flex-row justify-between items-center space-y-0 bg-slate-950">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-36 justify-between bg-slate-800">
                {selectedModel}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedModel("RabbiGPT")}>
                RabbiGPT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedModel("BuddhaGPT")}>
                BuddhaGPT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedModel("PastorGPT")}>
                PastorGPT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={goToFullChat} className="w-36 bg-slate-950">
          Full Chat
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground  bg-slate-950">
            <p>Select a model and start chatting</p>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <Bubble
                key={m.id}
                message={{
                  content: m.content,
                  role: m.role as "user" | "assistant",
                }}
                model={selectedModel}
              />
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <LoadingBubble />
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col  p-0 bg-slate-950">
        <div className="w-full p-2 ">
          <PromptSuggestionRow
            model={selectedModel}
            onPromptClick={sendPrompt}
          />
        </div>
        <form onSubmit={handleSubmit} className="flex w-full p-3  bg-slate-950">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-950 border-none text-white"
          />
          <Button type="submit" className="bg-slate-950">
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default LandingChatbot;
