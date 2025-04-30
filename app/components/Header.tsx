"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, User, Settings } from "lucide-react";
import LogoImage from "../assets/Logo.png";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Gradient background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-black backdrop-blur-xl border-b border-[#e6d3a3]/30 shadow-lg"></div>

      {/* Main header content */}
      <div className="relative h-[90px] px-6 md:px-10 mx-auto max-w-7xl flex items-center justify-between">
        {/* Left section with logo */}
        <div className="flex items-center space-x-4">
          <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden">
            <Image
              src={LogoImage}
              alt="Saphira.ai Logo"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e6d3a3] via-[#f0e4c3] to-[#e6d3a3] tracking-wide">
            Saphira<span className="text-[#e6d3a3]">.ai</span>
          </span>
        </div>

        {/* Middle section - can be used for navigation */}
        <div className="hidden md:flex space-x-6">
          <Button
            variant="ghost"
            className="text-[#e6d3a3] hover:text-[#ffffff] hover:bg-black/60"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="text-[#e6d3a3] hover:text-[#ffffff] hover:bg-black/60"
          >
            Personalities
          </Button>
          <Button
            variant="ghost"
            className="text-[#e6d3a3] hover:text-[#ffffff] hover:bg-black/60"
          >
            About
          </Button>
        </div>

        {/* Right section with action buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#e6d3a3] hover:text-[#ffffff] hover:bg-black/60"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#e6d3a3] hover:text-[#ffffff] hover:bg-black/60"
          >
            <User className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="hidden md:flex border-[#e6d3a3]/70 bg-black/60 text-[#f0e4c3] hover:bg-black/80 hover:border-[#f0e4c3]"
          >
            Log In
          </Button>
          <Button className="hidden md:flex bg-[#e6d3a3] text-black hover:bg-[#f0e4c3] transition-all font-medium">
            Sign Up
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#e6d3a3] hover:text-[#ffffff] hover:bg-black/60"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
