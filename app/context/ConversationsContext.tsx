"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Conversation } from "../types";

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
        } catch (error) {
          // Silently fail on parse error
        }
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  const createConversation = useCallback(() => {
    const id = crypto.randomUUID();
    const newConv: Conversation = {
      id,
      name: "New Conversation",
      selectedModels: [],
      hasStarted: false,
      messages: [],
    };
    setConversations((prev) => [...prev, newConv]);
    return id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateConversation = useCallback(
    (id: string, updates: Partial<Conversation>) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    },
    []
  );

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
