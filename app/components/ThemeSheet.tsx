"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "../features/theme";
import { ThemePopoverContent } from "../features/theme";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";

const ThemeSheet: React.FC = () => {
  const { currentTheme, selectNewTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 bg-black/50 rounded-full border border-[#e6d3a3]/30 text-[#e6d3a3] hover:bg-black/80 hover:border-[#e6d3a3]/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.3)] hover:scale-105 animate-subtle-glow animate-breathing animate-aura">
          <Sparkles size={20} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="bg-black/90 border-t border-[#ddc39a]/20 backdrop-blur-md p-0 h-[80vh] rounded-t-2xl"
      >
        <SheetHeader className="px-4 pt-8 pb-4">
          <SheetTitle className="text-[#e6d3a3] text-lg">
            Dynamic Theme
          </SheetTitle>
          <SheetDescription className="text-[#e6d3a3]/70 text-sm flex items-center justify-between">
            <span>
              Currently contemplating:{" "}
              <span className="italic">{currentTheme}</span>
            </span>
            <button
              onClick={selectNewTheme}
              className="ml-2 px-3 py-1 bg-black/70 rounded-full border border-[#e6d3a3]/30 text-[#e6d3a3] text-xs hover:bg-black/80 hover:border-[#e6d3a3]/60 transition-all"
            >
              New Theme
            </button>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto h-full px-4 pb-8 pt-2">
          <ThemePopoverContent isMobileSheet={true} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ThemeSheet;
