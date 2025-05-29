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
    router.push(`/chat/${id}?skipOnboarding=true`);
    setOpen(false); // Close sheet after selection
  };

  const onCreate = () => {
    const id = createConversation();
    router.push(`/chat/${id}?skipOnboarding=true`);
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
        <button className="p-2 bg-background/60 rounded-full border border-border text-foreground hover:bg-background/80 hover:border-foreground/70 transition-all duration-300 hover:scale-105 relative overflow-hidden group">
          <MessageSquare size={20} className="relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-background/95 border-r border-border backdrop-blur-xl w-[320px] pt-[calc(20px+var(--safe-area-top))] pl-[var(--safe-area-left)] p-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80 pointer-events-none opacity-40" />

        <SheetHeader className="px-6 pt-4 pb-6 relative z-10">
          <SheetTitle className="text-foreground text-xl font-light tracking-wide">
            Conversations
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm mt-1">
            View, edit, or start new conversations
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto h-full pb-24 relative z-10">
          {/* Permanent Prayer entry */}
          <div
            className={`group flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all duration-200 relative ${
              isPrayerActive
                ? "bg-foreground/10 border-l-2 border-foreground/60 pl-[22px]"
                : "hover:bg-muted hover:border-l-2 hover:border-foreground/30 hover:pl-[22px]"
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
                  isPrayerActive ? "text-foreground" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm whitespace-normal truncate transition-colors ${
                  isPrayerActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                Prayer
              </span>
            </div>
          </div>

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
              <MessageSquare
                size={24}
                className="text-muted-foreground/40 mb-3"
              />
              <p className="text-muted-foreground text-sm">
                No conversations yet
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Start a new chat below
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all duration-200 relative ${
                  conv.id === activeId
                    ? "bg-foreground/10 border-l-2 border-foreground/60 pl-[22px]"
                    : "hover:bg-muted hover:border-l-2 hover:border-foreground/30 hover:pl-[22px]"
                }`}
                onClick={() => onSelect(conv.id)}
              >
                {editingId === conv.id ? (
                  <div
                    className="flex-1 flex items-center relative bg-muted py-1.5 px-1.5 rounded-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageSquare
                      size={16}
                      className="text-foreground mr-2 flex-shrink-0"
                    />
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-transparent border-b border-border text-foreground text-sm focus:outline-none focus:border-foreground transition-colors py-1 px-0"
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
                        className="text-foreground p-1.5 ml-1 hover:bg-muted rounded-full transition-colors group/save"
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
                        className="text-muted-foreground p-1.5 hover:bg-muted rounded-full transition-colors group/cancel"
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
                    className="flex-1 flex items-center justify-between py-1 px-2 bg-muted rounded-md border border-border animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center">
                      <AlertCircle
                        size={16}
                        className="text-muted-foreground mr-2 animate-pulse"
                      />
                      <span className="text-foreground text-sm">
                        Delete this chat?
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conv.id);
                        }}
                        className="bg-muted hover:bg-muted/80 text-foreground text-xs py-1 px-2 rounded transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelDelete();
                        }}
                        className="text-muted-foreground hover:text-foreground text-xs py-1 px-2 rounded transition-colors"
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
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-sm whitespace-normal truncate transition-colors ${
                          conv.id === activeId
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {conv.name}
                      </span>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(conv.id, conv.name);
                        }}
                        className="text-muted-foreground p-1.5 hover:bg-muted rounded-full transition-colors group/edit"
                        title="Edit name"
                      >
                        <Edit
                          size={14}
                          className="group-hover/edit:scale-110 transition-transform"
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(conv.id);
                        }}
                        className="text-muted-foreground p-1.5 hover:bg-muted rounded-full transition-colors group/delete"
                        title="Delete chat"
                      >
                        <Trash
                          size={14}
                          className="group-hover/delete:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* New Chat Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
          <button
            onClick={onCreate}
            className="w-full flex items-center justify-center gap-2 bg-foreground/10 hover:bg-foreground/20 text-foreground py-2 px-4 rounded-full transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatsSheet;
