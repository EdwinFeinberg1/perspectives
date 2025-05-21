"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Home, Share2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
}

export default function SharedConversationPage() {
  const supabase = createClient();
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationName, setConversationName] = useState<string>("");
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchConversation = async () => {
      const { data, error } = await supabase
        .from("shared_conversations")
        .select("conversation")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Conversation not found");
        setLoading(false);
        return;
      }

      const conv = data.conversation as { name?: string; messages?: Message[] };
      setConversationName(conv.name || "Shared Conversation");
      setMessages(conv.messages || []);
      setLoading(false);
    };

    fetchConversation();
  }, [id, supabase]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="absolute inset-0 bg-black text-[#e6d3a3] flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <StarsBackground
          starDensity={0.0004}
          allStarsTwinkle={true}
          twinkleProbability={0.9}
          className="z-0"
        />
        <ShootingStars
          starColor="#e6d3a3"
          trailColor="#d4b978"
          minDelay={1500}
          maxDelay={4000}
          className="z-0"
        />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#e6d3a3]/20 scrollbar-track-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-2 sm:px-3 lg:px-4 py-3 max-w-2xl mx-auto"
        >
          <header className="mb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-playfair tracking-tight">
              {conversationName}
            </h1>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin mr-4 text-[#e6d3a3]" />
              <span className="text-xl">Loading conversation...</span>
            </div>
          ) : error ? (
            <p className="text-red-400 text-center text-xl py-16">{error}</p>
          ) : (
            <div className="space-y-4 mb-8">
              {messages.map((m, idx) => {
                let content = m.content;
                // Remove any follow-up questions section (## or ###, any whitespace)
                content = content
                  .replace(/##+\s*Follow[- ]?up Questions[\s\S]*$/i, "")
                  .trim();
                const isUser = m.role === "user";
                // Use model name if available, otherwise show nothing
                const modelName = m.model;
                return (
                  <div
                    key={idx}
                    className={`$${
                      isUser
                        ? "bg-black/70 border-2 border-[#ddc39a]/40 text-[#ddc39a] rounded-[20px_20px_0_20px] ml-auto"
                        : "bg-black/60 border-2 border-[#ddc39a]/20 text-[#ddc39a]/90 rounded-[20px_20px_20px_0]"
                    } mx-2 my-3 p-5 text-[16px] shadow-lg backdrop-blur-sm max-w-[92%] text-left relative`}
                  >
                    {!isUser && modelName && (
                      <div className="font-medium mb-3 text-[#ddc39a] flex items-center gap-2">
                        <span>{modelName}</span>
                      </div>
                    )}
                    {isUser ? (
                      <div className="whitespace-pre-line">{content}</div>
                    ) : (
                      <div className="markdown-content prose prose-invert prose-headings:text-[#ddc39a] prose-p:text-[#ddc39a]/90 prose-li:text-[#ddc39a]/90 max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: (props) => (
                              <h1
                                className="text-2xl font-bold mt-6 mb-4"
                                {...props}
                              />
                            ),
                            h2: (props) => (
                              <h2
                                className="text-xl font-bold mt-5 mb-3"
                                {...props}
                              />
                            ),
                            h3: (props) => (
                              <h3
                                className="text-lg font-bold mt-4 mb-2"
                                {...props}
                              />
                            ),
                            p: (props) => <p className="my-3" {...props} />,
                            ul: (props) => (
                              <ul className="my-3 space-y-2" {...props} />
                            ),
                            ol: (props) => (
                              <ol className="my-3 space-y-2" {...props} />
                            ),
                            li: (props) => <li className="ml-5" {...props} />,
                            blockquote: (props) => (
                              <blockquote
                                className="border-l-4 border-[#ddc39a]/30 pl-4 italic my-4"
                                {...props}
                              />
                            ),
                            a: (props) => (
                              <a
                                className="text-[#ddc39a] underline hover:text-[#ddc39a]/80"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <footer className="relative z-20 w-full bg-black/50 backdrop-blur-md border-t border-[#e6d3a3]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-[#e6d3a3]/80 hover:text-[#e6d3a3] transition-colors duration-300 hover:scale-105 transform"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Return Home</span>
              </Link>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-[#e6d3a3]/80 hover:text-[#e6d3a3] transition-colors duration-300 hover:scale-105 transform"
              >
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Share Conversation</span>
              </button>
            </div>
            <p className="text-[#e6d3a3]/70 text-sm font-medium">
              © {new Date().getFullYear()} Sephira • All rights reserved
            </p>
          </div>
        </div>
      </footer>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showShareToast ? 1 : 0,
          y: showShareToast ? 0 : 20,
        }}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#e6d3a3] text-black px-6 py-3 rounded-full shadow-lg z-50"
      >
        <p className="font-medium">Link copied to clipboard!</p>
      </motion.div>
    </div>
  );
}
