"use client";

import React from "react";
import { Plus, Trash } from "lucide-react";
import { useConversations } from "../context/ConversationsContext";
import { useRouter, useParams } from "next/navigation";

const Sidebar: React.FC = () => {
  const { conversations, createConversation, deleteConversation } =
    useConversations();
  const router = useRouter();
  const params = useParams();
  const activeId = (params?.conversationId as string) || "";

  const onSelect = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const onCreate = () => {
    const id = createConversation();
    router.push(`/chat/${id}`);
  };

  const onDelete = (id: string) => {
    deleteConversation(id);
    // if deleting active, navigate to another or create new
    if (id === activeId) {
      const remaining = conversations.find((c) => c.id !== id);
      if (remaining) router.push(`/chat/${remaining.id}`);
      else {
        const newId = createConversation();
        router.push(`/chat/${newId}`);
      }
    }
  };

  return (
    <aside className="w-64 bg-black/90 border-r border-[#ddc39a]/20 backdrop-blur-md flex flex-col h-screen fixed left-0 top-0 z-50 pt-24">
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-black/70 transition-colors ${
              conv.id === activeId ? "bg-black/70" : ""
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <span className="text-[#ddc39a] text-sm whitespace-normal">
              {conv.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="text-[#ddc39a]/60 hover:text-[#ddc39a] p-1 rounded-full hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onCreate}
        className="flex items-center justify-center gap-2 text-[#ddc39a] py-4 border-t border-[#ddc39a]/20 hover:bg-black/70 transition-colors text-sm"
      >
        <Plus size={18} /> New Chat
      </button>
    </aside>
  );
};

export default Sidebar;
