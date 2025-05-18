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
  children = "Login",
}: LoginLinkProps) {
  return (
    <Link href="/login" passHref>
      <Button
        variant="outline"
        className={`bg-[#1c2434] text-[#e6d3a3] border border-[#e6d3a3]/50 hover:bg-[#2a3447] hover:border-[#e6d3a3]/70 transition h-12 px-6 rounded-xl shadow-md ${className}`}
      >
        {children}
      </Button>
    </Link>
  );
}
