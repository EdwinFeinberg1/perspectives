"use client";

import React from "react";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";

interface FooterProps {
  /**
   * When provided, a "Share" button will be rendered that calls this
   * function. Intended for chat pages so conversations can be shared.
   */
  onShare?: () => void;
  shareDisabled?: boolean;
}

const Footer: React.FC<FooterProps> = ({ onShare, shareDisabled = false }) => {
  return (
    <footer className="sticky bottom-[env(safe-area-inset-bottom)] left-0 w-full z-40">
      <div className="mx-auto max-w-[1400px] relative mb-2 px-4 sm:px-6">
        {/* Main footer content with no background container */}
        <div className="relative h-[30px] px-6 md:px-8 flex items-center justify-between">
          {/* Left section with logo and name */}
          <div className="flex items-center space-x-4">
            <div className="relative h-8 w-8 md:h-10 md:w-10 overflow-hidden">
              <Image
                src="/assets/Logo.png"
                alt="Sephira.ai Logo"
                className="object-contain"
                width={40}
                height={40}
                priority
              />
            </div>
          </div>

          {/* Center credits */}
          <div className="flex items-center space-x-1">
            <span className="text-xs md:text-sm text-[#e6d3a3]/80">
              Made with
            </span>
            <Heart className="h-3 w-3 md:h-4 md:w-4 text-[#e6d3a3]/80 fill-[#e6d3a3]/50" />
            <span className="text-xs md:text-sm text-[#e6d3a3]/80">
              by spiritual seekers
            </span>
          </div>

          {/* Right section with year */}
          <div className="flex items-center gap-4">
            {onShare && (
              <button
                onClick={onShare}
                disabled={shareDisabled}
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  shareDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "text-[#e6d3a3]/80 hover:text-[#e6d3a3]"
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span className="text-xs md:text-sm">Share</span>
              </button>
            )}
            <span className="text-xs md:text-sm text-[#e6d3a3]/80">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
