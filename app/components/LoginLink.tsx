"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LoginLinkProps {
  variant?: "default" | "ghost" | "link" | "outline";
  className?: string;
  children?: React.ReactNode;
}

export default function LoginLink({
  className = "",
  children = "Sign In",
}: LoginLinkProps) {
  return (
    <Link href="/login" passHref>
      <Button
        variant="ghost"
        className={`text-[#e6d3a3] hover:bg-[#1c2434] text-sm ${className}`}
      >
        {children}
      </Button>
    </Link>
  );
}
