"use client";

import React from "react";

const Header = () => {
  return (
    <header className="grid grid-cols-3 items-center px-[7%] h-[90px] w-full bg-black/70 backdrop-blur-md border-b border-[#ddc39a]/10 fixed top-0 left-0 z-50">
      <div className="flex justify-start">
        <button className="px-4 py-2 bg-[#ddc39a] text-black font-medium rounded hover:opacity-90">
          View Perspectives
        </button>
      </div>
      <div className="flex justify-center">
        <span className="text-2xl font-bold text-[#ddc39a]">
          Perspectives.ai
        </span>
      </div>
      <div className="flex justify-end">
        <button
          aria-label="Open menu"
          className="flex flex-col justify-center items-center p-2 space-y-1"
        >
          <span className="block w-6 h-0.5 bg-[#ddc39a]"></span>
          <span className="block w-6 h-0.5 bg-[#ddc39a]"></span>
          <span className="block w-6 h-0.5 bg-[#ddc39a]"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
