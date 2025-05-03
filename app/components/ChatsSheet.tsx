"use client";

import React, { useState } from "react";
import { Plus, Trash, MessageSquare, Edit, Check } from "lucide-react";
import { useConversations } from "../context/ConversationsContext";
import { useRouter, useParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";

const ChatsSheet: React.FC = () => {
  const {
    conversations,
    createConversation,
    deleteConversation,
    updateConversation,
  } = useConversations();
  const router = useRouter();
  const params = useParams();
  const activeId =
    typeof params.conversationId === "string" ? params.conversationId : "";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [open, setOpen] = useState(false);

  const onSelect = (id: string) => {
    router.push(`/chat/${id}`);
    setOpen(false); // Close sheet after selection
  };

  const onCreate = () => {
    const id = createConversation();
    router.push(`/chat/${id}`);
    setOpen(false); // Close sheet after creation
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

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      updateConversation(id, { name: editName.trim() });
    }
    setEditingId(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 bg-black/50 rounded-full border border-[#e6d3a3]/30 text-[#e6d3a3] hover:bg-black/80 hover:border-[#e6d3a3]/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.3)] hover:scale-105 animate-subtle-glow">
          <MessageSquare size={20} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-black/90 border-r border-[#ddc39a]/20 backdrop-blur-md w-[300px] pt-24 p-0"
      >
        <SheetHeader className="px-4 pt-2 pb-4">
          <SheetTitle className="text-[#e6d3a3] text-lg">
            Conversations
          </SheetTitle>
          <SheetDescription className="text-[#e6d3a3]/70 text-sm">
            View, edit, or start new conversations
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto h-full">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-black/80 transition-colors ${
                conv.id === activeId ? "bg-black/80" : ""
              }`}
              onClick={() => onSelect(conv.id)}
            >
              {editingId === conv.id ? (
                <div
                  className="flex-1 flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageSquare
                    size={16}
                    className="text-[#e6d3a3] mr-2 flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-transparent border-b border-[#e6d3a3] text-[#e6d3a3] text-sm focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(conv.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveEdit(conv.id);
                    }}
                    className="text-[#e6d3a3] p-1 ml-1"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center flex-1 overflow-hidden">
                    <MessageSquare
                      size={16}
                      className="text-[#e6d3a3] mr-2 flex-shrink-0"
                    />
                    <span className="text-[#e6d3a3] text-sm whitespace-normal truncate">
                      {conv.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(conv.id, conv.name);
                      }}
                      className="text-[#e6d3a3] hover:text-[#ffffff] p-1 rounded-full hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100 mr-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id);
                      }}
                      className="text-[#e6d3a3] hover:text-[#ffffff] p-1 rounded-full hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onCreate}
          className="flex items-center justify-center gap-2 text-[#e6d3a3] py-10 my-4 border-t border-[#e6d3a3]/30 hover:bg-black/80 transition-colors text-sm w-full fixed bottom-0 left-0 z-10 bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.4)]"
          style={{ width: "300px" }}
        >
          <Plus size={18} /> New Chat
        </button>
      </SheetContent>
    </Sheet>
  );
};

export default ChatsSheet;
