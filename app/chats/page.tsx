"use client";

import React, { useEffect, useState } from "react";
import { Message } from "ai";
import FullChat from "../components/Chatbot/FullChat";

export default function ChatsPage() {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("chatHistory");
    if (stored) {
      setInitialMessages(JSON.parse(stored));
    }
  }, []);

  return <FullChat initialMessages={initialMessages} />;
}
