"use client";

import React, { useState, useEffect, useCallback } from "react";
import SignUpSheet from "./SignUpSheet";
import ChatsSheet from "./ChatsSheet";
import NewsSheet from "./NewsSheet";
import { Sparkles, Menu, Filter, ChevronDown } from "lucide-react";
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
import { ThemeToggle } from "./theme-toggle";
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
  const [subHeaderExpanded, setSubHeaderExpanded] = useState(false);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);
  const [overlayTop, setOverlayTop] = useState("0px");
  const subHeaderRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Prayer section state
  const [expandedSection, setExpandedSection] = useState<
    "need-pray" | "need-prayer" | null
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
    section: "need-pray" | "need-prayer" = "need-pray"
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
    "flex items-center gap-x-2 px-4 py-2 rounded-full border text-foreground bg-background border-border hover:bg-muted hover:border-border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/30";

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-2  sm:px-4 md:px-6">
        {/* Glassmorphism container with padding for rounded corners */}
        <div className="mx-auto max-w-[1400px] relative mt-2 flex flex-col">
          {/* Glassmorphism background with blur effect */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-lg rounded-xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.2)] after:absolute after:inset-0 after:bg-gradient-to-b after:from-muted/10 after:to-transparent after:rounded-xl"></div>

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
                  <span className="text-2xl sm:text-3xl font-normal text-foreground tracking-wide">
                    Sephira
                  </span>
                </div>

                {/* Right: Menu - 48pt hit area */}
                <div className="flex items-center">
                  <ThemeToggle />
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground hover:bg-muted w-12 h-12"
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[250px] sm:w-[300px] bg-background border-l border-border"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-foreground">
                          Menu
                        </SheetTitle>
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

              {/* Second row with News and Prayer buttons - or search for prayer page */}
              {!isPrayerPage ? (
                <div className="col-span-12 flex justify-center items-center gap-x-3 mt-1">
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
                        className="w-full bg-card rounded-full border border-border text-foreground px-4 py-2 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 text-sm placeholder:text-muted-foreground transition-all duration-200"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                        Press Enter
                      </div>
                    </div>
                  </div>
                  {/* Category filter dropdown for mobile */}
                  {selectedCategories && Object.entries(counts).length > 0 && (
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 bg-card border-border text-muted-foreground hover:border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/20">
                          <Filter className="w-3 h-3" />
                          <span className="text-xs">
                            Categories
                            {selectedCategories.size > 0 && (
                              <span className="ml-1 text-xs bg-muted text-foreground px-1 py-0.5 rounded-full">
                                {selectedCategories.size}
                              </span>
                            )}
                          </span>
                          <ChevronDown className="w-3 h-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px] bg-popover border-border text-popover-foreground">
                          <DropdownMenuLabel className="text-foreground text-xs">
                            Filter by Category
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border" />
                          {Object.entries(counts).map(([category, count]) => (
                            <DropdownMenuCheckboxItem
                              key={category}
                              checked={selectedCategories.has(category)}
                              onCheckedChange={() =>
                                togglePrayerCategory?.(category)
                              }
                              className="text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground data-[state=checked]:text-foreground"
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
                              <DropdownMenuSeparator className="bg-border" />
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
                                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                  <span className="text-3xl md:text-4xl font-normal text-foreground tracking-wide">
                    Sephira
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <ThemeToggle />
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground hover:bg-muted w-8 h-8 sm:w-10 sm:h-10"
                      >
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[250px] sm:w-[300px] bg-background/90 border-l border-border backdrop-blur-xl"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-foreground">
                          Menu
                        </SheetTitle>
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

              {/* Second row: News and Prayer buttons OR Search for Prayer page */}
              <div className="flex items-center justify-center gap-x-3 w-full pt-2 border-t border-border flex-1">
                {!isPrayerPage ? (
                  <>
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
                        className="w-full bg-card rounded-full border border-border text-foreground px-5 py-2.5 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 text-base placeholder:text-muted-foreground transition-all duration-200"
                      />
                    </div>
                    {/* Category filter dropdown for desktop */}
                    {selectedCategories &&
                      Object.entries(counts).length > 0 && (
                        <div className="flex justify-center mt-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 bg-card border-border text-muted-foreground hover:border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/20">
                              <Filter className="w-4 h-4" />
                              <span className="text-sm">
                                Categories
                                {selectedCategories.size > 0 && (
                                  <span className="ml-1 text-xs bg-muted text-foreground px-1.5 py-0.5 rounded-full">
                                    {selectedCategories.size}
                                  </span>
                                )}
                              </span>
                              <ChevronDown className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[220px] bg-popover border-border text-popover-foreground">
                              <DropdownMenuLabel className="text-foreground">
                                Filter by Category
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-border" />
                              {Object.entries(counts).map(
                                ([category, count]) => (
                                  <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={selectedCategories.has(category)}
                                    onCheckedChange={() =>
                                      togglePrayerCategory?.(category)
                                    }
                                    className="text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground data-[state=checked]:text-foreground"
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
                                  <DropdownMenuSeparator className="bg-border" />
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
                                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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

          {/* Overlay that appears when subheader is expanded */}
          <div
            className={`fixed inset-0 bg-background transition-all duration-500 z-40 ${
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
        </div>
      </header>
    </>
  );
};

export default Header;
