"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrayerLinkProps {
  variant?: "default" | "ghost" | "link";
  showIcon?: boolean;
  className?: string;
}

export default function PrayerLink({ 
  variant = "default",
  showIcon = true,
  className = ""
}: PrayerLinkProps) {
  return (
    <Link href="/prayer" passHref>
      <Button
        variant={variant}
        className={`flex items-center gap-2 ${className}`}
      >
        {showIcon && <Sparkles className="h-4 w-4" />}
        <span>Prayer</span>
      </Button>
    </Link>
  );
} 