"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SafeAreaProps {
  children: React.ReactNode;
  className?: string;
}

export const SafeArea = ({ children, className }: SafeAreaProps) => {
  return (
    <div
      className={cn(
        "w-full min-h-screen",
        "pt-[env(safe-area-inset-top)]",
        "pb-[env(safe-area-inset-bottom)]",
        "pl-[env(safe-area-inset-left)]",
        "pr-[env(safe-area-inset-right)]",
        className
      )}
    >
      {children}
    </div>
  );
};
