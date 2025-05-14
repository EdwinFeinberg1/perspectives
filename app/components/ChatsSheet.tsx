"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash,
  MessageSquare,
  Edit,
  Check,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useConversations } from "../context/ConversationsContext";
import { useRouter, useParams, usePathname } from "next/navigation";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const isPrayerActive = pathname === "/prayer";

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

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
    setDeletingId(null);

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

  const confirmDelete = (id: string) => {
    setDeletingId(id);
  };

  const cancelDelete = () => {
    setDeletingId(null);
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

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 bg-black/60 rounded-full border border-[#e6d3a3]/40 text-[#e6d3a3] hover:bg-black/80 hover:border-[#e6d3a3]/70 transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-105 animate-subtle-glow relative overflow-hidden group">
          <MessageSquare size={20} className="relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#e6d3a3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-black/95 border-r border-[#ddc39a]/30 backdrop-blur-xl w-[320px] pt-[calc(20px+var(--safe-area-top))] pl-[var(--safe-area-left)] p-0 shadow-[5px_0_30px_rgba(0,0,0,0.7)]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none opacity-40" />

        <SheetHeader className="px-6 pt-4 pb-6 relative z-10">
          <SheetTitle className="text-[#e6d3a3] text-xl font-light tracking-wide">
            Conversations
          </SheetTitle>
          <SheetDescription className="text-[#e6d3a3]/70 text-sm mt-1">
            View, edit, or start new conversations
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto h-full pb-24 relative z-10">
          {/* Permanent Prayer entry */}
          <div
            className={`group flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all duration-200 relative ${
              isPrayerActive
                ? "bg-[#e6d3a3]/10 border-l-2 border-[#e6d3a3]/60 pl-[22px]"
                : "hover:bg-black/80 hover:border-l-2 hover:border-[#e6d3a3]/30 hover:pl-[22px]"
            }`}
            onClick={() => {
              router.push("/prayer");
              setOpen(false);
            }}
          >
            <div className="flex items-center flex-1 overflow-hidden">
              <Sparkles
                size={16}
                className={`mr-2 flex-shrink-0 ${
                  isPrayerActive ? "text-[#e6d3a3]" : "text-[#e6d3a3]/80"
                }`}
              />
              <span
                className={`text-sm whitespace-normal truncate transition-colors ${
                  isPrayerActive
                    ? "text-[#e6d3a3]"
                    : "text-[#e6d3a3]/80 group-hover:text-[#e6d3a3]"
                }`}
              >
                Prayer
              </span>
            </div>
          </div>

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
              <MessageSquare size={24} className="text-[#e6d3a3]/40 mb-3" />
              <p className="text-[#e6d3a3]/60 text-sm">No conversations yet</p>
              <p className="text-[#e6d3a3]/40 text-xs mt-1">
                Start a new chat below
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all duration-200 relative ${
                  conv.id === activeId
                    ? "bg-[#e6d3a3]/10 border-l-2 border-[#e6d3a3]/60 pl-[22px]"
                    : "hover:bg-black/80 hover:border-l-2 hover:border-[#e6d3a3]/30 hover:pl-[22px]"
                }`}
                onClick={() => onSelect(conv.id)}
              >
                {editingId === conv.id ? (
                  <div
                    className="flex-1 flex items-center relative bg-[#e6d3a3]/5 py-1.5 px-1.5 rounded-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageSquare
                      size={16}
                      className="text-[#e6d3a3] mr-2 flex-shrink-0"
                    />
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-transparent border-b border-[#e6d3a3]/40 text-[#e6d3a3] text-sm focus:outline-none focus:border-[#e6d3a3] transition-colors py-1 px-0"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(conv.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      placeholder="Enter name..."
                    />
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit(conv.id);
                        }}
                        className="text-[#e6d3a3] p-1.5 ml-1 hover:bg-[#e6d3a3]/10 rounded-full transition-colors group/save"
                        title="Save"
                      >
                        <Check
                          size={16}
                          className="group-hover/save:scale-110 transition-transform"
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEdit();
                        }}
                        className="text-[#e6d3a3]/70 p-1.5 hover:bg-[#e6d3a3]/10 rounded-full transition-colors group/cancel"
                        title="Cancel"
                      >
                        <X
                          size={16}
                          className="group-hover/cancel:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                ) : deletingId === conv.id ? (
                  <div
                    className="flex-1 flex items-center justify-between py-1 px-2 bg-[#e6d3a3]/5 rounded-md border border-[#e6d3a3]/20 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center">
                      <AlertCircle
                        size={16}
                        className="text-[#e6d3a3]/80 mr-2 animate-pulse"
                      />
                      <span className="text-[#e6d3a3] text-sm">
                        Delete this chat?
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conv.id);
                        }}
                        className="bg-[#e6d3a3]/10 hover:bg-[#e6d3a3]/20 text-[#e6d3a3] text-xs py-1 px-2 rounded transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelDelete();
                        }}
                        className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] text-xs py-1 px-2 rounded hover:bg-[#e6d3a3]/10 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center flex-1 overflow-hidden">
                      <MessageSquare
                        size={16}
                        className={`mr-2 flex-shrink-0 ${
                          conv.id === activeId
                            ? "text-[#e6d3a3]"
                            : "text-[#e6d3a3]/80"
                        }`}
                      />
                      <span
                        className={`text-sm whitespace-normal truncate transition-colors ${
                          conv.id === activeId
                            ? "text-[#e6d3a3]"
                            : "text-[#e6d3a3]/80 group-hover:text-[#e6d3a3]"
                        }`}
                      >
                        {conv.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(conv.id, conv.name);
                        }}
                        className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-1.5 rounded-full hover:bg-[#e6d3a3]/10 transition-all opacity-0 group-hover:opacity-100 mr-1"
                        title="Rename"
                      >
                        <Edit
                          size={14}
                          className="hover:scale-110 transition-transform"
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(conv.id);
                        }}
                        className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-1.5 rounded-full hover:bg-[#e6d3a3]/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash
                          size={14}
                          className="hover:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </>
                )}
                {conv.id === activeId && !deletingId && !editingId && (
                  <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-[#e6d3a3]/0 via-[#e6d3a3]/20 to-[#e6d3a3]/0" />
                )}
              </div>
            ))
          )}
        </div>
        <button
          onClick={onCreate}
          className="flex items-center justify-center gap-2 text-[#e6d3a3] py-5 px-6 border-t border-[#e6d3a3]/20 hover:bg-[#e6d3a3]/10 transition-all text-sm w-full sticky bottom-[env(safe-area-inset-bottom)] left-0 z-10 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.5)] group"
          style={{ width: "320px" }}
        >
          <div className="relative">
            <Plus
              size={18}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-[#e6d3a3]/30 blur-md scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 opacity-0 group-hover:opacity-70" />
          </div>
          <span className="relative tracking-wide font-light group-hover:tracking-wider transition-all duration-300">
            New Chat
          </span>
        </button>
      </SheetContent>
    </Sheet>
  );
};

export default ChatsSheet;
