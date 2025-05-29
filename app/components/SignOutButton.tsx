"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface SignOutButtonProps {
  className?: string;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ className = "" }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      router.refresh();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className={`text-[#8B4513] dark:text-white hover:bg-[#1c2434] text-sm ${className}`}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
