"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { FaithType } from "@/app/types";
import { FAITH_LABELS } from "@/app/constants/faith";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Link from "next/link";
import { Home, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function SharedPerspectivePage({
  params,
}: {
  params: Promise<{ newsId: string; faith: FaithType }>;
}) {
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perspective, setPerspective] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState<string>("");
  const [newsDescription, setNewsDescription] = useState<string>("");
  const [showShareToast, setShowShareToast] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch perspective from Supabase
        const { data, error } = await supabase
          .from("perspectives")
          .select("perspective")
          .eq("news_id", resolvedParams.newsId)
          .eq("faith", resolvedParams.faith)
          .single();

        if (error || !data) {
          throw new Error("Perspective not found");
        }

        setPerspective(data.perspective);

        // Fetch the news title and description
        const newsResponse = await fetch(`/api/news/${resolvedParams.newsId}`);
        if (!newsResponse.ok) {
          throw new Error("News article not found");
        }
        const newsData = await newsResponse.json();
        setNewsTitle(newsData.title);
        setNewsDescription(newsData.description);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.newsId, resolvedParams.faith, supabase]);

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
      {/* Enhanced background with more stars and faster shooting stars */}
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

      {/* Scrollable content with enhanced animations */}
      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#e6d3a3]/20 scrollbar-track-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-4 sm:px-6 lg:px-8 py-6"
        >
          <header className="mb-8">
            {/* First row with faith badge and title */}
            <div className="flex items-center justify-start gap-4 mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex px-6 py-2.5 rounded-full ${
                  FAITH_LABELS[resolvedParams.faith]?.color
                } text-lg font-medium shadow-lg shadow-[#e6d3a3]/10`}
              >
                {FAITH_LABELS[resolvedParams.faith]?.label}
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl font-playfair tracking-tight"
              >
                Faith Perspective
              </motion.h1>
            </div>

            {/* Second row with news content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 space-y-4 bg-[#1c2434] p-6 rounded-lg border border-[#e6d3a3]/20"
            >
              {newsTitle && (
                <h2 className="text-[#e6d3a3] text-2xl sm:text-3xl font-medium">
                  {newsTitle}
                </h2>
              )}
              {newsDescription && (
                <p className="text-[#e6d3a3]/80 text-lg sm:text-xl leading-relaxed">
                  {newsDescription}
                </p>
              )}
            </motion.div>
          </header>

          <main className="w-full pb-10">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-20"
              >
                <Loader2 className="h-10 w-10 animate-spin mr-4 text-[#e6d3a3]" />
                <span className="text-[#e6d3a3]/90 text-xl font-medium">
                  Loading perspective...
                </span>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 py-20 text-xl"
              >
                {error}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="prose prose-xl w-full text-[#e6d3a3] prose-headings:text-left prose-p:text-left prose-ul:text-left"
              >
                <ReactMarkdown
                  components={{
                    h1: ({ ...props }) => (
                      <h1
                        className="text-3xl font-playfair text-[#e6d3a3] mt-16 mb-8 font-bold tracking-tight text-left"
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="text-2xl font-playfair text-[#e6d3a3] mt-12 mb-6 font-semibold tracking-tight text-left"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        className="text-xl font-playfair text-[#e6d3a3] mt-10 mb-4 font-medium tracking-tight text-left"
                        {...props}
                      />
                    ),
                    strong: ({ ...props }) => (
                      <strong className="text-[#e6d3a3] font-bold" {...props} />
                    ),
                    em: ({ ...props }) => (
                      <em className="text-[#e6d3a3]/90 italic" {...props} />
                    ),
                    ul: ({ ...props }) => (
                      <ul
                        className="list-disc space-y-3 my-8 pl-6 text-left"
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => (
                      <li
                        className="text-lg leading-relaxed text-left"
                        {...props}
                      />
                    ),
                    p: ({ ...props }) => (
                      <p
                        className="mb-8 text-lg leading-relaxed tracking-wide text-left"
                        {...props}
                      />
                    ),
                    blockquote: ({ ...props }) => (
                      <blockquote
                        className="border-l-4 border-[#e6d3a3]/30 pl-4 my-6 italic text-[#e6d3a3]/90 text-left"
                        {...props}
                      />
                    ),
                  }}
                >
                  {perspective || ""}
                </ReactMarkdown>
              </motion.div>
            )}
          </main>
        </motion.div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative z-20 w-full bg-black/50 backdrop-blur-md border-t border-[#e6d3a3]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
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
                <span className="font-medium">Share Perspective</span>
              </button>
            </div>
            <p className="text-[#e6d3a3]/70 text-sm font-medium">
              © {new Date().getFullYear()} Faith Perspectives • All rights
              reserved
            </p>
          </div>
        </div>
      </footer>

      {/* Share Toast Notification */}
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
