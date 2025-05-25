"use client";

import React, { useState, useEffect, useCallback } from "react";
import SignUpSheet from "./SignUpSheet";
import ChatsSheet from "./ChatsSheet";
import NewsSheet from "./NewsSheet";
import { useTheme, ThemePopoverContent } from "../features/theme";
import { Sparkles, RefreshCw, Menu, Filter, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PrayerLink from "./Prayer/PrayerLink";
import LoginLink from "./LoginLink";
import SignOutButton from "./SignOutButton";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
//import Link from "next/link";

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
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Prayer section state
  const [expandedSection, setExpandedSection] = useState<
    "theme" | "need-pray" | "need-prayer" | null
  >(null);

  // Tooltip state for Sparkles
  const [showSparklesTooltip, setShowSparklesTooltip] = useState(false);
  useEffect(() => {
    setShowSparklesTooltip(true);
    const timer = setTimeout(() => setShowSparklesTooltip(false), 9000);
    return () => clearTimeout(timer);
  }, []);

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
      document.documentElement.style.setProperty(
        "--theme-subheader-height",
        `${height}px`
      );
      document.body.classList.add("theme-subheader-open");
    } else {
      document.documentElement.style.setProperty(
        "--theme-subheader-height",
        "0px"
      );
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

    window.dispatchEvent(
      new CustomEvent("themeSubheaderToggled", {
        detail: { expanded: !subHeaderExpanded || expandedSection !== section },
      })
    );
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      console.log(
        "Initial auth state:",
        session?.user ? "logged in" : "logged out"
      );
    };
    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      console.log(
        "Auth state changed:",
        session?.user ? "logged in" : "logged out"
      );
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Shared button style for header actions
  const headerActionButton =
    "flex items-center gap-x-2 px-4 py-2 rounded-full border text-[#e6d3a3] bg-[#0c1320] border-[#e6d3a3]/30 hover:bg-[#1c2434] hover:border-[#e6d3a3]/60 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e6d3a3]/30";

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-2  sm:px-4 md:px-6">
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
                {/* Left: Chat bubble only */}
                <div className="flex items-center space-x-1">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <ChatsSheet />
                  </div>
                </div>

                {/* Center: Sephira wordmark */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <span className="text-2xl sm:text-3xl font-normal text-transparent bg-clip-text bg-[#d7c080] tracking-wide">
                    Sephira
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
                  {/* Sign in/out button moved into header navigation to avoid duplicate display */}
                  {user ? <SignOutButton /> : <LoginLink />}
                </div>
              </div>

              {/* Second row with Theme, News, and Prayer buttons - or search for prayer page */}
              {!isPrayerPage ? (
                <div className="col-span-12 flex justify-center items-center gap-x-3 mt-1">
                  {/* Theme button */}
                  <button
                    onClick={() => {
                      toggleSubHeader("theme");
                      setShowSparklesTooltip(false);
                    }}
                    className={`${headerActionButton} ${
                      expandedSection === "theme"
                        ? "bg-[#1c2434] border-[#e6d3a3]/60"
                        : ""
                    }`}
                    aria-expanded={expandedSection === "theme"}
                    aria-controls="theme-subheader"
                  >
                    <Sparkles size={16} />
                    <span className="font-medium text-xs">Theme</span>
                    <RefreshCw
                      size={12}
                      className="ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectNewTheme();
                      }}
                    />
                  </button>
                  {/* News button */}
                  <div>
                    <NewsSheet />
                  </div>
                  {/* Prayer button */}
                  <PrayerLink
                    variant="ghost"
                    className={`${headerActionButton} text-xs`}
                  />
                </div>
              ) : (
                <div className="col-span-12 flex flex-col gap-2">
                  {/* Mobile Search bar for prayer page */}
                  <div className="w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={prayerSearch}
                        onChange={(e) => onPrayerSearch?.(e.target.value)}
                        placeholder="Search prayers using natural language..."
                        className="w-full bg-[#0c1320] rounded-full border border-[#e6d3a3]/30 text-[#e6d3a3] px-4 py-2 focus:outline-none focus:border-[#e6d3a3]/70 focus:ring-2 focus:ring-[#e6d3a3]/20 text-sm placeholder:text-[#e6d3a3]/40 transition-all duration-200"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e6d3a3]/40 text-xs">
                        Press Enter
                      </div>
                    </div>
                  </div>
                  {/* Category filter dropdown for mobile */}
                  {selectedCategories && Object.entries(counts).length > 0 && (
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 bg-[#0c1320] border-[#e6d3a3]/20 text-[#e6d3a3]/70 hover:border-[#e6d3a3]/30 hover:bg-[#1c2434] focus:outline-none focus:ring-2 focus:ring-[#e6d3a3]/20">
                          <Filter className="w-3 h-3" />
                          <span className="text-xs">
                            Categories
                            {selectedCategories.size > 0 && (
                              <span className="ml-1 text-xs bg-[#e6d3a3]/20 text-[#e6d3a3] px-1 py-0.5 rounded-full">
                                {selectedCategories.size}
                              </span>
                            )}
                          </span>
                          <ChevronDown className="w-3 h-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px] bg-[#121927] border-[#e6d3a3]/20 text-[#e6d3a3]">
                          <DropdownMenuLabel className="text-[#e6d3a3]/90 text-xs">
                            Filter by Category
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[#e6d3a3]/20" />
                          {Object.entries(counts).map(([category, count]) => (
                            <DropdownMenuCheckboxItem
                              key={category}
                              checked={selectedCategories.has(category)}
                              onCheckedChange={() =>
                                togglePrayerCategory?.(category)
                              }
                              className="text-[#e6d3a3]/80 hover:bg-[#1c2434] hover:text-[#e6d3a3] focus:bg-[#1c2434] focus:text-[#e6d3a3] data-[state=checked]:text-[#e6d3a3]"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs capitalize">
                                  {category.replace("_", " ")}
                                </span>
                                <span className="text-xs opacity-60">
                                  ({count})
                                </span>
                              </div>
                            </DropdownMenuCheckboxItem>
                          ))}
                          {selectedCategories.size > 0 && (
                            <>
                              <DropdownMenuSeparator className="bg-[#e6d3a3]/20" />
                              <div className="px-2 py-1">
                                <button
                                  onClick={() => {
                                    // Clear all categories
                                    Object.keys(counts).forEach((category) => {
                                      if (selectedCategories.has(category)) {
                                        togglePrayerCategory?.(category);
                                      }
                                    });
                                  }}
                                  className="text-xs text-[#e6d3a3]/60 hover:text-[#e6d3a3] transition-colors"
                                >
                                  Clear all filters
                                </button>
                              </div>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop layout - only visible on md screens and up - TWO ROW LAYOUT */}
            <div className="hidden md:flex w-full flex-col h-full py-2">
              {/* First row: Logo, ChatsSheet, and Menu */}
              <div className="flex items-center justify-between pb-2 flex-1 relative">
                <div className="flex items-center space-x-4">
                  <ChatsSheet />
                </div>

                {/* Center: Sephira wordmark */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <span className="text-3xl md:text-4xl font-normal text-transparent bg-clip-text bg-[#d7c080] tracking-wide">
                    Sephira
                  </span>
                </div>

                <div className="flex items-center space-x-3">
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
                  {/* Sign in/out button moved into header navigation to avoid duplicate display */}
                  {user ? <SignOutButton /> : <LoginLink />}
                </div>
              </div>

              {/* Second row: Theme, News, and Prayer buttons OR Search for Prayer page */}
              <div className="flex items-center justify-center gap-x-3 w-full pt-2 border-t border-[#e6d3a3]/10 flex-1">
                {!isPrayerPage ? (
                  <>
                    {/* Theme button */}
                    <button
                      onClick={() => toggleSubHeader("theme")}
                      className={`${headerActionButton} ${
                        expandedSection === "theme"
                          ? "bg-[#1c2434] border-[#e6d3a3]/60"
                          : ""
                      }`}
                      aria-expanded={expandedSection === "theme"}
                      aria-controls="theme-subheader"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium text-sm">Theme</span>
                      <RefreshCw
                        size={14}
                        className="ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectNewTheme();
                        }}
                      />
                    </button>
                    {/* News button */}
                    <div>
                      <NewsSheet />
                    </div>
                    {/* Prayer button */}
                    <PrayerLink
                      variant="ghost"
                      className={`${headerActionButton} text-sm`}
                    />
                  </>
                ) : (
                  <div className="w-full">
                    <div className="relative w-full max-w-3xl mx-auto">
                      <input
                        type="text"
                        value={prayerSearch}
                        onChange={(e) => onPrayerSearch?.(e.target.value)}
                        placeholder="Search prayers using natural language (e.g. 'healing morning Jewish', 'gratitude before meals')..."
                        className="w-full bg-[#0c1320] rounded-full border border-[#e6d3a3]/30 text-[#e6d3a3] px-5 py-2.5 focus:outline-none focus:border-[#e6d3a3]/70 focus:ring-2 focus:ring-[#e6d3a3]/20 text-base placeholder:text-[#e6d3a3]/40 transition-all duration-200"
                      />
                    </div>
                    {/* Category filter dropdown for desktop */}
                    {selectedCategories &&
                      Object.entries(counts).length > 0 && (
                        <div className="flex justify-center mt-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 bg-[#0c1320] border-[#e6d3a3]/20 text-[#e6d3a3]/70 hover:border-[#e6d3a3]/30 hover:bg-[#1c2434] focus:outline-none focus:ring-2 focus:ring-[#e6d3a3]/20">
                              <Filter className="w-4 h-4" />
                              <span className="text-sm">
                                Categories
                                {selectedCategories.size > 0 && (
                                  <span className="ml-1 text-xs bg-[#e6d3a3]/20 text-[#e6d3a3] px-1.5 py-0.5 rounded-full">
                                    {selectedCategories.size}
                                  </span>
                                )}
                              </span>
                              <ChevronDown className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[220px] bg-[#121927] border-[#e6d3a3]/20 text-[#e6d3a3]">
                              <DropdownMenuLabel className="text-[#e6d3a3]/90">
                                Filter by Category
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-[#e6d3a3]/20" />
                              {Object.entries(counts).map(
                                ([category, count]) => (
                                  <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={selectedCategories.has(category)}
                                    onCheckedChange={() =>
                                      togglePrayerCategory?.(category)
                                    }
                                    className="text-[#e6d3a3]/80 hover:bg-[#1c2434] hover:text-[#e6d3a3] focus:bg-[#1c2434] focus:text-[#e6d3a3] data-[state=checked]:text-[#e6d3a3]"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-sm capitalize">
                                        {category.replace("_", " ")}
                                      </span>
                                      <span className="text-xs opacity-60">
                                        ({count})
                                      </span>
                                    </div>
                                  </DropdownMenuCheckboxItem>
                                )
                              )}
                              {selectedCategories.size > 0 && (
                                <>
                                  <DropdownMenuSeparator className="bg-[#e6d3a3]/20" />
                                  <div className="px-2 py-1.5">
                                    <button
                                      onClick={() => {
                                        // Clear all categories
                                        Object.keys(counts).forEach(
                                          (category) => {
                                            if (
                                              selectedCategories.has(category)
                                            ) {
                                              togglePrayerCategory?.(category);
                                            }
                                          }
                                        );
                                      }}
                                      className="text-xs text-[#e6d3a3]/60 hover:text-[#e6d3a3] transition-colors"
                                    >
                                      Clear all filters
                                    </button>
                                  </div>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                  </div>
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

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }
      `}</style>
    </>
  );
};

export default Header;
