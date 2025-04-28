"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  return (
    <header className="grid grid-cols-3 items-center px-[7%] h-[90px] w-full bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-md border-b border-[#ddc39a]/20 fixed top-0 left-0 z-50 shadow-lg">
      <div className="flex justify-start">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-5 py-2.5 bg-black border-2 border-[#ddc39a]/70 text-[#ddc39a] font-medium rounded-lg hover:bg-[#ddc39a]/10 transition-all duration-300 shadow-md">
              View Perspectives
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[400px] border-r border-[#ddc39a]/20 bg-black/90 backdrop-blur-md text-[#ddc39a]"
          >
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-[#ddc39a]">
                Perspectives
              </SheetTitle>
              <SheetDescription className="text-[#ddc39a]/80">
                Compare perspectives across different religious traditions.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-8">
              <h3 className="text-xl font-semibold border-b border-[#ddc39a]/30 pb-2 mb-4">
                Unique Points
              </h3>
              <div className="space-y-4 text-[#ddc39a]/90">
                <p>
                  Distinctive viewpoints from each perspective will appear here.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold border-b border-[#ddc39a]/30 pb-2 mb-4">
                Similarities
              </h3>
              <div className="space-y-4 text-[#ddc39a]/90">
                <p>Common ground between perspectives will appear here.</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex justify-center">
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ddc39a] via-[#e6d3a3] to-[#ddc39a] tracking-wide">
          PERSPECTIVES<span className="text-[#ddc39a]">.ai</span>
        </span>
      </div>
      <div className="flex justify-end">
        <button
          aria-label="Open menu"
          className="flex flex-col justify-center items-center p-2 space-y-1.5 rounded-full hover:bg-black/40 transition-all duration-300"
        >
          <span className="block w-7 h-0.5 bg-gradient-to-r from-[#ddc39a]/70 to-[#ddc39a] rounded-full transform origin-left transition-all"></span>
          <span className="block w-5 h-0.5 bg-gradient-to-r from-[#ddc39a]/70 to-[#ddc39a] rounded-full transition-all"></span>
          <span className="block w-7 h-0.5 bg-gradient-to-r from-[#ddc39a]/70 to-[#ddc39a] rounded-full transform origin-left transition-all"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
