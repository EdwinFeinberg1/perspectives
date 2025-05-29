"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PrayerLinkProps {
  variant?: "default" | "ghost" | "link";
  showIcon?: boolean;
  className?: string;
}

export default function PrayerLink({
  variant = "default",
  className = "",
}: PrayerLinkProps) {
  return (
    <Link href="/prayer" passHref>
      <Button
        variant={variant}
        className={`relative flex items-center justify-center px-4 py-2 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 text-foreground hover:bg-background/80 hover:border-border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/30 hover:scale-[1.02] hover:shadow-lg ${className}`}
      >
        <span className="text-sm font-medium">Need Prayer?</span>
      </Button>
    </Link>
  );
}
