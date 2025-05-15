"use client";

import React, { useState, useEffect, useCallback } from "react";
import SignUpSheet from "./SignUpSheet";
import ChatsSheet from "./ChatsSheet";
import { useTheme, ThemePopoverContent } from "../features/theme";
import {
  Sparkles,
  RefreshCw,
  Menu,
  ChevronDown,
  ChevronUp,
  UserPlus,
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header: React.FC<{
  isPrayerPage?: boolean;
  prayerSearch?: string;
  onPrayerSearch?: (search: string) => void;
  selectedCategories?: Set<string>;
  togglePrayerCategory?: (cat: string) => void;
  counts?: Record<string, number>;
}> = ({
  isPrayerPage = false,
  prayerSearch = "",
  onPrayerSearch,
  selectedCategories,
  togglePrayerCategory,
  counts = {},
}) => {
  const { currentTheme, selectNewTheme } = useTheme();
  const [subHeaderExpanded, setSubHeaderExpanded] = useState(false);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);
  const [overlayTop, setOverlayTop] = useState("0px");
  const [showingPrompts, setShowingPrompts] = useState(false);
  const subHeaderRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Prayer section state
  const [expandedSection, setExpandedSection] = useState<
    "theme" | "need-pray" | "need-prayer" | null
  >(null);

  // Calculate the header offset for the overlay
  const calculateHeaderOffset = useCallback(() => {
    if (typeof window !== "undefined") {
      const baseHeight = window.innerWidth >= 640 ? 80 : 70; // sm:h-[80px] vs h-[70px]
      const margin = 2; // mt-2
      const subheaderHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--theme-subheader-height"
        ) || "0"
      );
      return `${baseHeight + margin + subheaderHeight}px`;
    }
    return "80px"; // Default fallback for SSR
  }, []);

  // Update overlay top position when subheader expands/collapses
  useEffect(() => {
    setOverlayTop(calculateHeaderOffset());
  }, [subHeaderHeight, calculateHeaderOffset]);

  // Handle showPrompts change from ThemePopoverContent
  const handleShowPromptsChange = useCallback(
    (isShowingPrompts: boolean) => {
      setShowingPrompts(isShowingPrompts);

      // Force remeasure the subheader after state update
      setTimeout(() => {
        if (subHeaderRef.current && subHeaderExpanded) {
          const height = subHeaderRef.current.scrollHeight;
          setSubHeaderHeight(height);
          document.documentElement.style.setProperty(
            "--theme-subheader-height",
            `${height}px`
          );
          setOverlayTop(calculateHeaderOffset());
        }
      }, 10);
    },
    [subHeaderExpanded, calculateHeaderOffset]
  );

  // Measure subheader height when expanded
  useEffect(() => {
    if (subHeaderExpanded && subHeaderRef.current) {
      const height = subHeaderRef.current.scrollHeight;
      setSubHeaderHeight(height);

      // Set a CSS variable for the content offset
      document.documentElement.style.setProperty(
        "--theme-subheader-height",
        `${height}px`
      );

      // Add a class to the body to control the glassy effect
      document.body.classList.add("theme-subheader-open");
    } else {
      document.documentElement.style.setProperty(
        "--theme-subheader-height",
        "0px"
      );

      // Remove the class when closed
      document.body.classList.remove("theme-subheader-open");
    }
  }, [subHeaderExpanded]);

  // Add event listener to close the subheader programmatically
  useEffect(() => {
    const handleCloseSubheader = () => {
      setSubHeaderExpanded(false);
      setExpandedSection(null);
    };

    window.addEventListener("closeThemePopover", handleCloseSubheader);
    return () => {
      window.removeEventListener("closeThemePopover", handleCloseSubheader);
      // Clean up when component unmounts
      document.body.classList.remove("theme-subheader-open");
    };
  }, []);

  const toggleSubHeader = (
    section: "theme" | "need-pray" | "need-prayer" = "theme"
  ) => {
    if (expandedSection === section) {
      setSubHeaderExpanded(false);
      setExpandedSection(null);
    } else {
      setSubHeaderExpanded(true);
      setExpandedSection(section);
    }

    // Dispatch a custom event that the page layout can listen for
    window.dispatchEvent(
      new CustomEvent("themeSubheaderToggled", {
        detail: { expanded: !subHeaderExpanded || expandedSection !== section },
      })
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-2 sm:px-4 md:px-6">
        {/* Glassmorphism container with padding for rounded corners */}
        <div className="mx-auto max-w-[1400px] relative mt-2 flex flex-col">
          {/* Glassmorphism background with blur effect */}
          <div className="absolute inset-0 bg-dark backdrop-blur-lg rounded-xl border border-[#e6d3a3]/15 shadow-[0_8px_32px_rgba(0,0,0,0.2)] after:absolute after:inset-0 after:bg-gradient-to-b after:from-[#e6d3a3]/5 after:to-transparent after:rounded-xl"></div>

          {/* Main header content */}
          <div
            ref={contentRef}
            className={`relative px-2 sm:px-6 md:px-8 flex items-center justify-between ${
              isPrayerPage
                ? "h-[130px] sm:h-[130px] md:h-[120px]"
                : "h-[100px] sm:h-[110px] md:h-[120px]"
            }`}
          >
            {/* Mobile layout (12-column grid) for iPhone 12-15 */}
            <div className="w-full grid grid-cols-12 gap-2 items-center md:hidden">
              {/* First row */}
              <div className="col-span-12 flex justify-between items-center mb-1">
                {/* Left: Chat bubble - 48pt hit area */}
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <ChatsSheet />
                  </div>
                </div>

                {/* Center: Sephira wordmark */}
                <div>
                  <span className="text-lg font-sans font-bold text-transparent bg-clip-text bg-[#d7c080] tracking-wide">
                    Ask-Sephira
                  </span>
                </div>

                {/* Right: Menu - 48pt hit area */}
                <div className="flex items-center">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#e6d3a3] hover:bg-[#1c2434] w-12 h-12"
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[250px] sm:w-[300px] bg-[#080d14] border-l border-[#e6d3a3]/30"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-[#e6d3a3]">Menu</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col space-y-4">
                        <SignUpSheet inline={true} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Second row with Theme and Prayer buttons - or search for prayer page */}
              {!isPrayerPage ? (
                <div className="col-span-12 flex justify-center items-center space-x-2 mt-1">
                  {/* Theme button */}
                  <button
                    onClick={() => toggleSubHeader("theme")}
                    className={`relative flex items-center justify-center p-1.5 bg-[#0c1320] rounded-full border border-[#e6d3a3]/40 text-[#e6d3a3] hover:bg-[#1c2434] hover:border-[#e6d3a3]/70 transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] animate-subtle-glow ${
                      expandedSection === "theme"
                        ? "shadow-[0_0_15px_rgba(230,211,163,0.4)] bg-dark"
                        : ""
                    }`}
                    aria-expanded={expandedSection === "theme"}
                    aria-controls="theme-subheader"
                  >
                    <Sparkles size={12} className="relative z-10" />
                  </button>

                  {/* Prayer button */}
                  <Link
                    href="/prayer"
                    className="relative flex items-center justify-center p-1.5 bg-[#0c1320] rounded-full border border-[#e6d3a3]/40 text-[#e6d3a3] hover:bg-[#1c2434] hover:border-[#e6d3a3]/70 transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] animate-subtle-glow"
                    aria-label="Need Prayer"
                  >
                    <Sparkles size={12} className="relative z-10" />
                  </Link>

                  {/* Sign Up button */}
                  <Link
                    href="/sign-up"
                    className="relative flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-[#e6d3a3] to-[#d4b978] rounded-full border border-[#e6d3a3]/40 text-black hover:from-[#d4b978] hover:to-[#e6d3a3] transition-all duration-300 shadow-md text-xs font-medium"
                    aria-label="Sign Up"
                  >
                    <UserPlus size={12} className="mr-1" /> Sign&nbsp;Up
                  </Link>
                </div>
              ) : (
                <div className="col-span-12 flex flex-col gap-2">
                  {/* Mobile Search bar for prayer page */}
                  <div className="w-full">
                    <input
                      type="text"
                      value={prayerSearch}
                      onChange={(e) => onPrayerSearch?.(e.target.value)}
                      placeholder="Search prayers..."
                      className="w-full bg-[#0c1320] rounded-full border border-[#e6d3a3]/30 text-sm text-[#e6d3a3] px-3 py-1.5 focus:outline-none focus:border-[#e6d3a3]/70 focus:ring-1 focus:ring-[#e6d3a3]/30"
                    />
                  </div>

                  {/* Mobile category filters below search bar */}
                  <div className="w-full flex items-center space-x-1.5 overflow-x-auto scrollbar-hide pb-1">
                    {selectedCategories &&
                      togglePrayerCategory &&
                      Object.entries(counts).map(([category, count]) => (
                        <button
                          key={category}
                          onClick={() => togglePrayerCategory(category)}
                          className={`shrink-0 whitespace-nowrap text-xs px-2 py-1 rounded-full border transition-all ${
                            selectedCategories.has(category)
                              ? "bg-[#e6d3a3]/20 border-[#e6d3a3]/50 text-[#e6d3a3]"
                              : "bg-[#0c1320] border-[#e6d3a3]/20 text-[#e6d3a3]/70 hover:border-[#e6d3a3]/30"
                          }`}
                        >
                          {category} ({count})
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop layout - only visible on md screens and up - TWO ROW LAYOUT */}
            <div className="hidden md:flex w-full flex-col h-full py-2">
              {/* First row: Logo, ChatsSheet, and Menu */}
              <div className="flex items-center justify-between pb-2 flex-1">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <ChatsSheet />
                  <span className="text-base sm:text-lg md:text-2xl font-sans font-bold text-transparent bg-clip-text bg-[#d7c080] tracking-wide">
                    Sephira
                  </span>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#e6d3a3] hover:bg-black/30 w-8 h-8 sm:w-10 sm:h-10"
                      >
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[250px] sm:w-[300px] bg-black/90 border-l border-[#e6d3a3]/30 backdrop-blur-xl"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-[#e6d3a3]">Menu</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col space-y-4">
                        <SignUpSheet inline={true} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Second row: Theme and Prayer buttons OR Search and Categories for Prayer page */}
              <div className="flex items-center justify-between pt-2 border-t border-[#e6d3a3]/10 flex-1">
                {!isPrayerPage ? (
                  <div className="flex items-center space-x-3">
                    {/* Theme button */}
                    <button
                      onClick={() => toggleSubHeader("theme")}
                      className={`inline-flex items-center bg-[#0c1320] px-4 py-2 rounded-full border border-[#e6d3a3]/20 text-[#e6d3a3] hover:bg-[#1c2434] hover:border-[#e6d3a3]/30 transition-all duration-300 animate-breathing animate-aura relative ${
                        expandedSection === "theme"
                          ? "bg-[#1c2434] border-[#e6d3a3]/30"
                          : ""
                      }`}
                      aria-expanded={expandedSection === "theme"}
                      aria-controls="theme-subheader"
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-[#e6d3a3]" />
                      <span className="text-sm font-medium">
                        Contemplating{" "}
                        <span className="italic">{currentTheme}</span>
                      </span>
                      <RefreshCw
                        size={14}
                        className="ml-2 animate-subtle-glow"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectNewTheme();
                        }}
                      />
                      {expandedSection === "theme" ? (
                        <ChevronUp
                          size={16}
                          className="ml-2 text-[#e6d3a3]/70"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="ml-2 text-[#e6d3a3]/70"
                        />
                      )}
                    </button>

                    {/* Prayer button */}
                    <Link
                      href="/prayer"
                      className="inline-flex items-center bg-[#0c1320] px-4 py-2 rounded-full border border-[#e6d3a3]/20 text-[#e6d3a3] hover:bg-[#1c2434] hover:border-[#e6d3a3]/30 transition-all duration-300 animate-breathing animate-aura"
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-[#e6d3a3]" />
                      <span className="text-sm font-medium">Need Prayer</span>
                    </Link>

                    
                  </div>
                ) : (
                  <>
                    {/* Search bar - now on the left */}
                    <div className="w-[200px] lg:w-[240px]">
                      <input
                        type="text"
                        value={prayerSearch}
                        onChange={(e) => onPrayerSearch?.(e.target.value)}
                        placeholder="Search prayers..."
                        className="w-full bg-[#0c1320] rounded-full border border-[#e6d3a3]/30 text-sm text-[#e6d3a3] px-3 py-1.5 focus:outline-none focus:border-[#e6d3a3]/70 focus:ring-1 focus:ring-[#e6d3a3]/30"
                      />
                    </div>

                    {/* Prayer categories filter - now on the right */}
                    <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide ml-4">
                      {selectedCategories &&
                        togglePrayerCategory &&
                        Object.entries(counts).map(([category, count]) => (
                          <button
                            key={category}
                            onClick={() => togglePrayerCategory(category)}
                            className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-all ${
                              selectedCategories.has(category)
                                ? "bg-[#e6d3a3]/20 border-[#e6d3a3]/50 text-[#e6d3a3]"
                                : "bg-[#0c1320] border-[#e6d3a3]/20 text-[#e6d3a3]/70 hover:border-[#e6d3a3]/30"
                            }`}
                          >
                            {category} ({count})
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Theme Subheader */}
          <div
            id="theme-subheader"
            ref={subHeaderRef}
            className={`relative border-t border-[#e6d3a3]/10 transition-all duration-500 ease-in-out ${
              subHeaderExpanded
                ? "opacity-100 pointer-events-auto bg-[#101827]"
                : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
            }`}
            style={{
              maxHeight: subHeaderExpanded
                ? showingPrompts
                  ? "700px" // More space when showing prompts
                  : `${subHeaderHeight}px`
                : "0px",
            }}
          >
            <div className="py-3 px-3 sm:py-4 sm:px-4 md:px-8">
              {expandedSection === "theme" && (
                <>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-xs sm:text-sm md:text-base font-medium text-[#e6d3a3]">
                      Theme Explorer
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[10px] sm:text-xs md:text-sm text-[#e6d3a3]/70">
                        Currently:{" "}
                        <span className="italic text-[#e6d3a3] text-[11px] sm:text-xs">
                          {currentTheme}
                        </span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectNewTheme();
                        }}
                        className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[#1c2434] rounded-full border border-[#e6d3a3]/30 text-[#e6d3a3] hover:bg-[#232d3f] hover:border-[#e6d3a3]/60 transition-all flex items-center gap-1"
                      >
                        <RefreshCw size={8} className="sm:hidden" />
                        <RefreshCw size={10} className="hidden sm:block" />
                        <span>New</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#e6d3a3]/60 mb-2.5 sm:mb-3">
                    Select a category to explore themes or view prompts related
                    to the current theme
                  </div>
                  <div
                    className={`${
                      showingPrompts ? "max-h-[550px]" : "max-h-[300px]"
                    } overflow-y-auto transition-all duration-300`}
                  >
                    <ThemePopoverContent
                      isMobileSheet={false}
                      onShowPromptsChange={handleShowPromptsChange}
                    />
                  </div>
                </>
              )}

              {expandedSection === "need-prayer" && (
                <div className="flex flex-col items-center justify-center h-60 px-4">
                  <div className="inline-block p-6 bg-[#121927] rounded-full mb-4 border border-[#e6d3a3]/20">
                    <Sparkles className="h-8 w-8 text-[#e6d3a3]/60" />
                  </div>
                  <p className="text-[#e6d3a3]/70 text-center max-w-md">
                    Prayer request feature coming soon. You&apos;ll be able to
                    request personalized prayers from the community.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay that appears when subheader is expanded */}
      <div
        className={`fixed inset-0 bg-[#080d14] transition-all duration-500 z-40 ${
          subHeaderExpanded
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          top: overlayTop,
        }}
        onClick={() => {
          setSubHeaderExpanded(false);
          setExpandedSection(null);
        }}
        aria-hidden="true"
      />

      {/* Add some custom animations to enhance the UI */}
      <style jsx global>{`
        .animate-subtle-glow {
          animation: subtle-glow 3s ease-in-out infinite;
        }

        .animate-breathing {
          animation: breathing 4s ease-in-out infinite;
        }

        @keyframes subtle-glow {
          0%,
          100% {
            opacity: 0.8;
            filter: brightness(1);
          }
          50% {
            opacity: 1;
            filter: brightness(1.2);
          }
        }

        @keyframes breathing {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        /* Hide scrollbar but allow scrolling */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </>
  );
};

export default Header;
