"use client";

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="grid grid-cols-3 items-center px-[7%] h-[90px] w-full bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-md border-b border-[#ddc39a]/20 fixed top-0 left-0 z-50 shadow-lg">
      <div className="flex justify-start">
        {/* PerspectivesSheet removed */}
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
