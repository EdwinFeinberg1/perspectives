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
    <Link
      href="/login"
      className={`text-[#8B4513] dark:text-white hover:bg-muted text-sm ${className}`}
    >
      {children}
    </Link>
  );
}
