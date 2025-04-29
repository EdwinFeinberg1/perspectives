"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Conversation, ModelName } from "../types";

interface ConversationsContextValue {
  conversations: Conversation[];
  createConversation: () => string; // returns new id
  deleteConversation: (id: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
}

const ConversationsContext = createContext<ConversationsContextValue | null>(
  null
);

export const ConversationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Load from localStorage initially
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("conversations");
      if (stored) {
        try {
          setConversations(JSON.parse(stored));
        } catch (_) {}
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  const createConversation = () => {
    const id = crypto.randomUUID();
    const newConv: Conversation = {
      id,
      name: "New Conversation",
      selectedModels: [],
      hasStarted: false,
    };
    setConversations((prev) => [...prev, newConv]);
    return id;
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        createConversation,
        deleteConversation,
        updateConversation,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations must be used within provider");
  return ctx;
};
