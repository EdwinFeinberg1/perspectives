"use client";

import React from "react";




const Header= () => {
  return (
    <header className="flex justify-between items-center px-[7%] h-[90px] w-full bg-black/70 backdrop-blur-md border-b border-[#ddc39a]/10 fixed top-0 left-0 z-50">
      <div className="h-10 flex items-center">
        <span className="text-2xl font-bold text-[#ddc39a]">
          Perspectives.ai
        </span>
      </div>
    </header>
  );
};

export default Header;
