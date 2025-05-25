"use client";

import React, { useMemo, useRef, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import PrayerCard from "./PrayerCard";
import { ChevronDown, ChevronUp, Star, Settings } from "lucide-react";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useRouter } from "next/navigation";
import {
  prayers as prayersData,
  Category,
  Prayer,
  Faiths,
} from "../../constants/prayers";

import Fuse from "fuse.js";

const FAITH_SYNONYMS: Record<string, string[]> = {
  [Faiths.Judaism]: ["jewish", "judaism", "jew", "hebrew", "israelite"],
  [Faiths.Islam]: ["islamic", "islam", "muslim", "quran", "muhammad"],
  [Faiths.Christianity]: [
    "christian",
    "christianity",
    "christ",
    "jesus",
    "gospel",
  ],
  [Faiths.General]: ["universal", "general", "secular", "any", "all"],
};

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  morning: ["morning", "dawn", "sunrise", "wake", "awakening", "early"],
  healing: ["healing", "health", "cure", "recovery", "wellness"],
  gratitude: ["gratitude", "thankful", "appreciation", "thanks", "blessing"],
  general: ["general", "universal", "common", "basic"],
  wealth: ["wealth", "prosperity", "abundance", "success"],
  health: ["health", "wellness", "wellbeing", "strength"],
  discernment: ["discernment", "wisdom", "guidance", "direction"],
  any_time: ["anytime", "always", "whenever", "daily"],
  scripture: ["scripture", "bible", "torah", "quran", "holy text"],
  meditation: ["meditation", "mindfulness", "contemplation", "reflection"],
  liturgical: ["liturgical", "service", "worship", "ritual"],
  affirmation: ["affirmation", "positive", "declaration", "statement"],
  chant: ["chant", "mantra", "repetition", "singing"],
};

interface ExtendedPrayer extends Prayer {
  tags?: string[];
  __searchBlob?: string;
}

// Prepare search blobs
(prayersData as unknown as ExtendedPrayer[]).forEach((p) => {
  const faithWords = FAITH_SYNONYMS[p.faith].join(" ");
  const catWords = CATEGORY_SYNONYMS[p.category].join(" ");
  const tagWords = (p.tags ?? []).join(" ");
  p.__searchBlob = [p.title, p.text, faithWords, catWords, tagWords]
    .join(" ")
    .toLowerCase();
});

// No default categories selected to show all prayers initially
const DEFAULT_SELECTED: Category[] = [];

// Helper to parse a raw user query into faith / category filters and remaining free text
const parseSearchQuery = (raw: string) => {
  const words = raw.toLowerCase().trim().split(/\s+/);

  let detectedFaith: string | null = null;
  const detectedCategories = new Set<string>();
  const freeWords: string[] = [];

  words.forEach((w) => {
    // Faith check first (unique)
    if (!detectedFaith) {
      for (const [faithKey, syns] of Object.entries(FAITH_SYNONYMS)) {
        if (syns.includes(w)) {
          detectedFaith = faithKey;
          return; // continue next word
        }
      }
    }

    // Category check (can match multiple)
    let matchedCategory = false;
    for (const [catKey, syns] of Object.entries(CATEGORY_SYNONYMS)) {
      if (syns.includes(w)) {
        detectedCategories.add(catKey);
        matchedCategory = true;
        break;
      }
    }

    if (!matchedCategory) {
      freeWords.push(w);
    }
  });

  return {
    faith: detectedFaith,
    categories: detectedCategories,
    freeText: freeWords.join(" ").trim(),
  } as const;
};

const PrayerPage: React.FC = () => {
  const fuseInstance = useMemo(
    () =>
      new Fuse(prayersData, {
        keys: ["__searchBlob"],
        threshold: 0.35, // allow mild typos
        includeScore: true,
      }),
    []
  );

  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const headerOffset = 170;
  const [showFavorites, setShowFavorites] = useState(true);
  const { favorites } = useFavorites();

  // Coerce favorites to a generic Set<unknown> for local type convenience
  const favoritesSet: Set<unknown> = favorites as unknown as Set<unknown>;

  // Refresh the page once when component mounts to ensure favorites are loaded
  React.useEffect(() => {
    router.refresh();
  }, [router]); // Empty dependency array means this runs once on mount

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(DEFAULT_SELECTED)
  );
  const [search, setSearch] = useState("");

  // Toggle category selection
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // All counts by category (static)
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    prayersData.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, []);

  // Get favorite prayers
  const favoritePrayers = useMemo<Prayer[]>(() => {
    return prayersData.filter((prayer: Prayer) => favoritesSet.has(prayer.id));
  }, [favoritesSet]);

  // Filter favorite prayers based on search and categories
  const filteredFavoritePrayers = useMemo<Prayer[]>(() => {
    // 1. Category gating
    const { faith, categories, freeText } = parseSearchQuery(search);

    // Combine user-selected categories with those inferred from query
    const categoryFilterSet = new Set<string>([
      ...selectedCategories,
      ...Array.from(categories),
    ]);

    const base = favoritePrayers.filter((p) => {
      const catOk = categoryFilterSet.size
        ? categoryFilterSet.has(p.category)
        : true;
      const faithOk = faith ? p.faith === faith : true;
      return catOk && faithOk;
    });

    // If there is no remaining free text, we are done
    if (!freeText) return base;

    const resultIds = new Set(
      fuseInstance.search(freeText).map((r) => r.item.id)
    );

    return base.filter((p) => resultIds.has(p.id as any));
  }, [favoritePrayers, selectedCategories, search, fuseInstance]);

  const toggleFavoritesSection = () => {
    setShowFavorites(!showFavorites);
  };

  // Filter prayers based on selected categories and search
  const filteredPrayers = useMemo<Prayer[]>(() => {
    // 1. Category gating
    const { faith, categories, freeText } = parseSearchQuery(search);

    // Combine chip-selected categories with categories inferred from query
    const categoryFilterSet = new Set<string>([
      ...selectedCategories,
      ...Array.from(categories),
    ]);

    // 1. Fast structural filters (category & faith)
    const base = prayersData.filter((p) => {
      // Respect favorites toggle (exclude already-favorited)
      if (favoritesSet.has(p.id)) return false;

      const catOk = categoryFilterSet.size
        ? categoryFilterSet.has(p.category)
        : true;
      const faithOk = faith ? p.faith === faith : true;
      return catOk && faithOk;
    });

    // 2. Fuzzy search on remaining free text (if any)
    if (!freeText) return base;

    const resultIds = new Set(
      fuseInstance.search(freeText).map((r) => r.item.id) // sorted by Fuse score already
    );

    return base.filter((p) => resultIds.has(p.id as any));
  }, [search, selectedCategories, favoritesSet, fuseInstance]);

  return (
    <main className="w-full min-h-screen flex flex-col relative">
      <Header
        isPrayerPage={true}
        prayerSearch={search}
        onPrayerSearch={setSearch}
        selectedCategories={selectedCategories}
        togglePrayerCategory={toggleCategory}
        counts={counts}
      />
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{
          height: "calc(100vh - 210px)",
          marginTop: `${headerOffset}px`,
          marginBottom: "70px",
        }}
      >
        <div className="max-w-[1400px] mx-auto w-full pb-5">
          <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-md">
            <div className="px-4 py-2">
              {/* Favorites Section */}
              {filteredFavoritePrayers.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={toggleFavoritesSection}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <h2 className="text-xl font-semibold text-[#e6d3a3]">
                        Favorites
                      </h2>
                      {showFavorites ? (
                        <ChevronUp className="w-5 h-5 text-[#e6d3a3]/70" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#e6d3a3]/70" />
                      )}
                      <span className="text-sm text-[#e6d3a3]/70 ml-2">
                        ({filteredFavoritePrayers.length})
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/prayer/settings");
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#e6d3a3]/70 hover:text-[#e6d3a3] border border-[#e6d3a3]/20 hover:border-[#e6d3a3]/40 rounded-full transition-all duration-200"
                      title="Email notification settings"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Email Notifications</span>
                    </button>
                  </div>

                  {showFavorites && (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                      {filteredFavoritePrayers.map((prayer) => (
                        <div
                          key={`fav-${prayer.id}`}
                          className="break-inside-avoid mb-4"
                        >
                          <PrayerCard prayer={prayer} isFavorited={true} />
                        </div>
                      ))}
                    </div>
                  )}

                  {showFavorites &&
                    filteredFavoritePrayers.length > 0 &&
                    filteredPrayers.length > 0 && (
                      <div className="h-px bg-gradient-to-r from-transparent via-[#e6d3a3]/20 to-transparent my-8" />
                    )}
                </div>
              )}

              {/* All Prayers Section */}
              {filteredPrayers.length > 0 && (
                <div className="mb-4">
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                    {filteredPrayers.map((prayer) => (
                      <div key={prayer.id} className="break-inside-avoid mb-4">
                        <PrayerCard prayer={prayer} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredPrayers.length === 0 &&
                filteredFavoritePrayers.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-[#e6d3a3]/70 text-lg">
                      No prayers found matching your criteria
                    </p>
                  </div>
                )}
            </div>
          </ScrollArea>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PrayerPage;
