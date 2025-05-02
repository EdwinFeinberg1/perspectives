"use client";

import React from "react";
import Image from "next/image";
import LogoImage from "../assets/Logo.png";
import SignUpSheet from "./SignUpSheet";
import ChatsSheet from "./ChatsSheet";
import { useTheme } from "./ThemeContext";
import { Sparkles, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ThemePopoverContent from "./ThemePopoverContent";

const Header: React.FC = () => {
  const { currentTheme, selectNewTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6">
      {/* Glassmorphism container with padding for rounded corners */}
      <div className="mx-auto max-w-[1400px] relative mt-2">
        {/* Glassmorphism background with blur effect */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-lg rounded-xl border border-[#e6d3a3]/15 shadow-[0_8px_32px_rgba(0,0,0,0.2)] after:absolute after:inset-0 after:bg-gradient-to-b after:from-[#e6d3a3]/5 after:to-transparent after:rounded-xl"></div>

        {/* Main header content */}
        <div className="relative h-[80px] px-6 md:px-8 flex items-center justify-between">
          {/* Left section with logo, name and chats sheet */}
          <div className="flex items-center space-x-4">
            <ChatsSheet />
            <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden">
              <Image
                src={LogoImage}
                alt="Sephira.ai Logo"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg md:text-2xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e6d3a3] via-[#f0e4c3] to-[#e6d3a3] tracking-wide">
              Sephira
            </span>
          </div>

          {/* Center section with theme */}
          <div className="hidden md:flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center bg-black/30 px-4 py-2 rounded-full border border-[#e6d3a3]/20 text-[#e6d3a3] hover:bg-black/40 hover:border-[#e6d3a3]/30 transition-all duration-300 animate-breathing animate-aura">
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
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[800px] max-w-[90vw] bg-black/90 backdrop-blur-lg border border-[#e6d3a3]/30 text-[#e6d3a3] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <ThemePopoverContent />
              </PopoverContent>
            </Popover>
          </div>

          {/* Right section with sign-up sheet trigger */}
          <SignUpSheet />
        </div>
      </div>
    </header>
  );
};

export default Header;
