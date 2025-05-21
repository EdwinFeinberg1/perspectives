"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConversations } from "../context/ConversationsContext";

export default function ChatIndexPage() {
  const router = useRouter();
  const { conversations, createConversation } = useConversations();

  useEffect(() => {
    // If we have existing conversations, route to the first one
    if (conversations.length > 0) {
      router.replace(`/chat/${conversations[0].id}`);
    } else {
      // Create a new conversation and route to it
      const newId = createConversation();
      router.replace(`/chat/${newId}`);
    }
  }, [conversations, createConversation, router]);

  // Loading state while redirecting
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-[#ddc39a] text-xl">Ask Sephira</div>
    </div>
  );
}
