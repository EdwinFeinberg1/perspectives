import React, { useState, useCallback, useEffect } from "react";
import { Prayer } from "@/app/constants/prayers";
import {
  Volume2 as VolumeIcon,
  Star as StarIcon,
  Share2 as ShareIcon,
  Copy as CopyIcon,
  ChevronDown,
  ExternalLink as LinkIcon,
} from "lucide-react";
import { useFavorites } from "@/app/context/FavoritesContext";

interface PrayerCardProps {
  prayer: Prayer;
  isFavorited?: boolean; // Optional prop to optimize rendering
}

const faithColors: Record<string, string> = {
  judaism: "text-yellow-300",
  islam: "text-green-400",
  christianity: "text-blue-300",
  general: "text-purple-300",
};

const PrayerCard: React.FC<PrayerCardProps> = ({
  prayer,
  isFavorited: propIsFavorited,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  // Local state to prevent flickering when toggling favorites
  const [isFavorited, setIsFavorited] = useState(
    propIsFavorited ?? favorites.has(prayer.id)
  );

  // Sync with favorites context when it changes
  useEffect(() => {
    if (propIsFavorited === undefined) {
      setIsFavorited(favorites.has(prayer.id));
    }
  }, [favorites, prayer.id, propIsFavorited]);

  const toggleExpand = () => setExpanded((p) => !p);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (prayer.audioUrl) {
      const audio = new Audio(prayer.audioUrl);
      audio.play();
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prayer.text).then(() => {
      // eslint-disable-next-line no-alert
      alert("Prayer copied to clipboard");
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: prayer.title,
          text: prayer.text,
        })
        .catch(() => {});
    } else {
      handleCopy(e);
    }
  };

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      // Update local state immediately to prevent flicker
      setIsFavorited(!isFavorited);
      toggleFavorite(prayer.id);
    },
    [prayer.id, toggleFavorite, isFavorited]
  );

  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (prayer.source && prayer.source.startsWith("http")) {
      window.open(prayer.source, "_blank", "noopener,noreferrer");
    }
  };

  const hasSourceUrl = prayer.source && prayer.source.startsWith("http");
  const faithColor = faithColors[prayer.faith] || "text-[#e6d3a3]";

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchStart = () => setShowTools(true);
    const handleTouchEnd = () => {
      // Keep tools visible for a short time after touch to allow interaction
      setTimeout(() => setShowTools(false), 3000);
    };

    const element = document.getElementById(`prayer-card-${prayer.id}`);
    if (element) {
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchend", handleTouchEnd);

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [prayer.id]);

  return (
    <div
      id={`prayer-card-${prayer.id}`}
      className="break-inside-avoid rounded-2xl lg:rounded-3xl bg-[#121927]/90 backdrop-blur-sm border border-[#e6d3a3]/20 p-4 sm:p-5 transition-all duration-200 hover:shadow-[0_0_15px_rgba(230,211,163,0.1)] cursor-pointer group relative"
      onClick={toggleExpand}
      onMouseEnter={() => setShowTools(true)}
      onMouseLeave={() => setShowTools(false)}
      style={{
        boxShadow: "inset 0 0 0 1px rgba(230,211,163,0.05)",
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#e6d3a3] mb-1">
            {prayer.title}
          </h3>
          <span
            className={`uppercase text-xs font-medium tracking-wide ${faithColor}`}
          >
            {prayer.faith}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[#e6d3a3]/70 transition-transform duration-200 ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {[prayer.category, ...(prayer.tags || [])].map((tag, index) => (
          <span
            key={index === 0 ? `category-${tag}` : `tag-${tag}-${index}`}
            className="px-2 py-0.5 text-[11px] rounded-full bg-[#e6d3a3]/10 text-[#e6d3a3]/80"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 text-sm leading-relaxed text-[#e6d3a3]/90 space-y-3">
          <p>{prayer.text}</p>
          {prayer.transliteration && (
            <p className="italic">{prayer.transliteration}</p>
          )}
          {prayer.translation && <p>{prayer.translation}</p>}
        </div>
      )}

      {/* Utility tools */}
      <div
        className={`flex justify-end gap-3 mt-4 pt-3 border-t border-[#e6d3a3]/10 transition-opacity duration-200 ${
          showTools || expanded ? "opacity-100" : "opacity-0"
        }`}
      >
        {prayer.audioUrl && (
          <button
            onClick={handlePlay}
            title="Play audio"
            className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 -m-2"
          >
            <VolumeIcon size={18} />
          </button>
        )}
        <button
          onClick={handleFavorite}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          className={`hover:text-yellow-300 transition-colors p-2 -m-2 ${
            isFavorited ? "text-yellow-400" : "text-[#e6d3a3]/70"
          }`}
          type="button"
        >
          <StarIcon
            size={18}
            fill={isFavorited ? "currentColor" : "none"}
            className="pointer-events-none"
          />
        </button>
        {hasSourceUrl && (
          <button
            onClick={handleSourceClick}
            title="View source"
            className="text-[#e6d3a3]/70 hover:text-blue-400 p-2 -m-2"
          >
            <LinkIcon size={18} />
          </button>
        )}
        <button
          onClick={handleShare}
          title="Share"
          className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 -m-2"
        >
          <ShareIcon size={18} />
        </button>
        <button
          onClick={handleCopy}
          title="Copy"
          className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 -m-2"
        >
          <CopyIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrayerCard);
