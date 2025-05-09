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
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { currentTheme, selectNewTheme } = useTheme();
  const [subHeaderExpanded, setSubHeaderExpanded] = useState(false);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);
  const [overlayTop, setOverlayTop] = useState("0px");
  const subHeaderRef = React.useRef<HTMLDivElement>(null);

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
    };

    window.addEventListener("closeThemePopover", handleCloseSubheader);
    return () => {
      window.removeEventListener("closeThemePopover", handleCloseSubheader);
      // Clean up when component unmounts
      document.body.classList.remove("theme-subheader-open");
    };
  }, []);

  const toggleSubHeader = () => {
    setSubHeaderExpanded(!subHeaderExpanded);

    // Dispatch a custom event that the page layout can listen for
    window.dispatchEvent(
      new CustomEvent("themeSubheaderToggled", {
        detail: { expanded: !subHeaderExpanded },
      })
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-2 sm:px-4 md:px-6">
        {/* Glassmorphism container with padding for rounded corners */}
        <div className="mx-auto max-w-[1400px] relative mt-2 flex flex-col">
          {/* Glassmorphism background with blur effect */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-lg rounded-xl border border-[#e6d3a3]/15 shadow-[0_8px_32px_rgba(0,0,0,0.2)] after:absolute after:inset-0 after:bg-gradient-to-b after:from-[#e6d3a3]/5 after:to-transparent after:rounded-xl"></div>

          {/* Main header content */}
          <div className="relative h-[70px] sm:h-[80px] px-2 sm:px-6 md:px-8 flex items-center justify-between">
            {/* Mobile layout (12-column grid) for iPhone 12-15 */}
            <div className="w-full grid grid-cols-12 gap-2 items-center md:hidden">
              {/* Chat bubble (col 1) - 48pt hit area */}
              <div className="col-span-1 flex justify-center">
                <div className="ml-8 w-12 h-12 flex items-center justify-center">
                  <ChatsSheet />
                </div>
              </div>

              {/* Sephira wordmark (col 2-8) */}
              <div className="col-span-7 pl-1">
                <span className="text-lg font-sans font-bold text-transparent bg-clip-text bg-[#d7c080] tracking-wide">
                  Ask-Sephira
                </span>
              </div>

              {/* Theme toggle button */}
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={toggleSubHeader}
                  className="relative w-12 h-12 flex items-center justify-center p-2 bg-black/60 rounded-full border border-[#e6d3a3]/40 text-[#e6d3a3] hover:bg-black/80 hover:border-[#e6d3a3]/70 transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] animate-subtle-glow"
                  aria-expanded={subHeaderExpanded}
                  aria-controls="theme-subheader"
                >
                  <Sparkles size={18} className="relative z-10" />
                  {subHeaderExpanded ? (
                    <ChevronUp
                      size={14}
                      className="absolute bottom-1 right-1 text-[#e6d3a3]/70"
                    />
                  ) : (
                    <ChevronDown
                      size={14}
                      className="absolute bottom-1 right-1 text-[#e6d3a3]/70"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#e6d3a3]/5 to-transparent opacity-70 rounded-full" />
                </button>
              </div>

              {/* Menu (col 10-12) - 48pt hit area */}
              <div className="col-span-3 flex justify-end ">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#e6d3a3] hover:bg-black/30 w-12 h-12"
                    >
                      <Menu className="h-6 w-6" />
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

            {/* Desktop layout - only visible on md screens and up */}
            <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
              <ChatsSheet />
              <span className="text-base sm:text-lg md:text-2xl font-sans font-bold text-transparent bg-clip-text bg-[#d7c080] tracking-wide">
                Sephira
              </span>
            </div>

            {/* Center section with theme - only visible on md screens and up */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={toggleSubHeader}
                className="inline-flex items-center bg-black/30 px-4 py-2 rounded-full border border-[#e6d3a3]/20 text-[#e6d3a3] hover:bg-black/40 hover:border-[#e6d3a3]/30 transition-all duration-300 animate-breathing animate-aura"
                aria-expanded={subHeaderExpanded}
                aria-controls="theme-subheader"
              >
                <Sparkles className="h-4 w-4 mr-2 text-[#e6d3a3]" />
                <span className="text-sm font-medium">
                  Contemplating <span className="italic">{currentTheme}</span>
                </span>
                <RefreshCw
                  size={14}
                  className="ml-2 animate-subtle-glow"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectNewTheme();
                  }}
                />
                {subHeaderExpanded ? (
                  <ChevronUp size={16} className="ml-2 text-[#e6d3a3]/70" />
                ) : (
                  <ChevronDown size={16} className="ml-2 text-[#e6d3a3]/70" />
                )}
              </button>
            </div>

            {/* Right section - only visible on md screens and up */}
            <div className="hidden md:flex items-center space-x-1 sm:space-x-3">
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

          {/* Theme Subheader */}
          <div
            id="theme-subheader"
            ref={subHeaderRef}
            className={`relative border-t border-[#e6d3a3]/10 transition-all duration-500 ease-in-out ${
              subHeaderExpanded
                ? "max-h-[400px] opacity-100 pointer-events-auto"
                : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
            }`}
            style={{
              maxHeight: subHeaderExpanded ? `${subHeaderHeight}px` : "0px",
            }}
          >
            <div className="py-3 px-3 sm:py-4 sm:px-4 md:px-8">
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
                    className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black/70 rounded-full border border-[#e6d3a3]/30 text-[#e6d3a3] hover:bg-black/80 hover:border-[#e6d3a3]/60 transition-all flex items-center gap-1"
                  >
                    <RefreshCw size={8} className="sm:hidden" />
                    <RefreshCw size={10} className="hidden sm:block" />
                    <span>New</span>
                  </button>
                </div>
              </div>
              <div className="text-[11px] sm:text-xs text-[#e6d3a3]/60 mb-2.5 sm:mb-3">
                Select a category to explore themes or view prompts related to
                the current theme
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <ThemePopoverContent isMobileSheet={false} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Glassy overlay that appears when subheader is expanded */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-md transition-all duration-500 z-40 ${
          subHeaderExpanded
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          top: overlayTop,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)",
        }}
        onClick={() => setSubHeaderExpanded(false)}
        aria-hidden="true"
      />
    </>
  );
};

export default Header;
