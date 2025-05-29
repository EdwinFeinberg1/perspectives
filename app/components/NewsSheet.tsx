"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { FaithType } from "@/app/types";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  image_url?: string;
  published_at: string;
  faiths?: string;
  created_at: string;
}

const FAITH_LABELS: Record<FaithType, { label: string; color: string }> = {
  rabbi: {
    label: "Rabbi GPT",
    color:
      "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-500/20",
  },
  pastor: {
    label: "Pastor GPT",
    color:
      "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-500 border-blue-200 dark:border-blue-500/20",
  },
  buddha: {
    label: "Buddha GPT",
    color:
      "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-500 border-orange-200 dark:border-orange-500/20",
  },
  imam: {
    label: "Imam GPT",
    color:
      "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 border-green-200 dark:border-green-500/20",
  },
};

const NewsSheet = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(4);

        if (error) {
          console.error("Error fetching news:", error);
          return;
        }

        setNewsItems(data || []);
      } catch (err) {
        console.error("Error in news fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [supabase]);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Helper function to render faith badges
  const renderFaithBadges = (newsId: string) => {
    return Object.entries(FAITH_LABELS).map(([faith, { label, color }]) => (
      <Link
        key={`${newsId}-${faith}`}
        href={`/share/${newsId}/${faith}`}
        className={`px-3 py-1 rounded-full text-xs font-medium border ${color} transition-all duration-200 hover:opacity-80`}
      >
        {label}
      </Link>
    ));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-x-2 px-4 py-2 rounded-full border text-foreground bg-background border-border hover:bg-muted hover:border-foreground/60 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          <Newspaper className="h-5 w-5" />
          <span className="font-medium text-xs">News</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`bg-background ${
          isMobile
            ? "h-[80vh] border-t border-border rounded-t-[20px]"
            : "w-[400px] border-l border-border"
        }`}
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="text-foreground text-xl">News</SheetTitle>
          <SheetDescription className="text-muted-foreground text-lg">
            through the lens of religion.
          </SheetDescription>
        </SheetHeader>
        <div
          className={`mt-4 space-y-4 overflow-y-auto pr-2 ${
            isMobile ? "max-h-[calc(80vh-120px)]" : "max-h-[calc(100vh-180px)]"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-foreground"></div>
            </div>
          ) : newsItems.length > 0 ? (
            newsItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-card border border-border"
              >
                {item.image_url && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
                <h3 className="text-foreground font-medium mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground text-sm hover:underline"
                    >
                      Read more →
                    </a>
                  )}
                  <div className="flex-1" />
                  <div className="flex flex-wrap gap-2">
                    {renderFaithBadges(item.id)}
                  </div>
                </div>
                <span className="text-muted-foreground/50 text-xs mt-2 block">
                  {getRelativeTime(item.published_at)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No news items available
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NewsSheet;
