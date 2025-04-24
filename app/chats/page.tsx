"use client";

import React, { useEffect, useState } from "react";
import { Message } from "ai";
import FullChat, { ModelType } from "../components/Chatbot/FullChat";

export default function ChatsPage() {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [initialModel, setInitialModel] = useState<ModelType>("RabbiGPT");

  useEffect(() => {
    const stored = sessionStorage.getItem("chatHistory");
    if (stored) setInitialMessages(JSON.parse(stored));
    const storedModel = sessionStorage.getItem("chatModel");
    if (
      storedModel === "RabbiGPT" ||
      storedModel === "BuddhaGPT" ||
      storedModel === "PastorGPT"
    ) {
      setInitialModel(storedModel as ModelType);
    }
  }, []);

  return (
    <FullChat initialMessages={initialMessages} initialModel={initialModel} />
  );
}
