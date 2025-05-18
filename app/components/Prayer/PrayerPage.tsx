"use client";

import React, { useMemo, useRef, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import PrayerCard from "./PrayerCard";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useRouter } from "next/navigation";
import {
  prayers as prayersData,
  Categories,
  Category,
} from "../../constants/prayers";

const DEFAULT_SELECTED: Category[] = Object.values(Categories);

const PrayerPage: React.FC = () => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const headerOffset = 170;
  const [showFavorites, setShowFavorites] = useState(true);
  const { favorites } = useFavorites();

  // Refresh the page once when component mounts to ensure favorites are loaded
  React.useEffect(() => {
    router.refresh();
  }, []); // Empty dependency array means this runs once on mount

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
  const favoritePrayers = useMemo(() => {
    return prayersData.filter((prayer) => favorites.has(prayer.id));
  }, [favorites]);

  // Filter prayers based on selected categories and search
  const filteredPrayers = useMemo(() => {
    return prayersData.filter((prayer) => {
      // Skip favorited prayers to avoid duplication
      if (favorites.has(prayer.id)) {
        return false;
      }

      // Category filter
      if (
        selectedCategories.size > 0 &&
        !selectedCategories.has(prayer.category)
      ) {
        return false;
      }

      // Search filter
      if (
        search &&
        !prayer.title.toLowerCase().includes(search.toLowerCase()) &&
        !prayer.text.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [selectedCategories, search, favorites]);

  const toggleFavoritesSection = () => {
    setShowFavorites(!showFavorites);
  };

  // Filter favorite prayers based on search and categories
  const filteredFavoritePrayers = useMemo(() => {
    if (!search && selectedCategories.size === 0) {
      return favoritePrayers;
    }

    return favoritePrayers.filter((prayer) => {
      // Category filter
      if (
        selectedCategories.size > 0 &&
        !selectedCategories.has(prayer.category)
      ) {
        return false;
      }

      // Search filter
      if (
        search &&
        !prayer.title.toLowerCase().includes(search.toLowerCase()) &&
        !prayer.text.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [favoritePrayers, selectedCategories, search]);

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
                  <div
                    className="flex items-center gap-2 mb-4 cursor-pointer"
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
