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
        className={`relative flex items-center justify-center px-4 py-2 bg-[#0c1320] rounded-full border border-[#e6d3a3]/40 text-[#e6d3a3] hover:bg-[#1c2434] hover:border-[#e6d3a3]/70 transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] ${className}`}
      >
        <span className="text-sm font-medium">Need Prayer?</span>
      </Button>
    </Link>
  );
}
