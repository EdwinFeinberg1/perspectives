import React from "react";
import { Categories } from "@/app/constants/prayers";
import { X, Search } from "lucide-react";

interface PrayerFilterBarProps {
  selected: Set<string>;
  toggle: (cat: string) => void;
  counts: Record<string, number>;
  search: string;
  onSearch: (val: string) => void;
}

const PrayerFilterBar: React.FC<PrayerFilterBarProps> = ({
  selected,
  toggle,
  counts,
  search,
  onSearch,
}) => {
  const categories = Object.values(Categories);

  return (
    <div className="w-full bg-[#0c1320]/80 backdrop-blur-lg border-y border-[#e6d3a3]/10 py-3 px-3 sm:px-6 sticky top-[120px] z-40">
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = selected.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 border
                ${
                  isActive
                    ? "bg-[#e6d3a3]/20 border-[#e6d3a3]/40 text-[#e6d3a3]"
                    : "bg-black/40 border-transparent text-[#e6d3a3]/70 hover:bg-black/60"
                }`}
            >
              <span className="capitalize">{cat}</span>
              <span className="opacity-70">({counts[cat] || 0})</span>
              {isActive && <X size={14} className="ml-1" />}
            </button>
          );
        })}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Mini search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search prayers…"
            className="bg-black/50 text-xs sm:text-sm placeholder:text-[#e6d3a3]/50 text-[#e6d3a3] border border-[#e6d3a3]/20 rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#e6d3a3]/50 w-36 sm:w-48"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e6d3a3]/60" />
        </div>
      </div>
    </div>
  );
};

export default PrayerFilterBar;
