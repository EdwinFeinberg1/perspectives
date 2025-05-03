"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface SignUpSheetProps {
  inline?: boolean;
}

const SignUpSheet: React.FC<SignUpSheetProps> = ({ inline = false }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simple email regex validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("signups")
        .insert({ email });

      if (insertError) {
        // Unique violation or any other DB error
        if (insertError.code === "23505") {
          setError("This email has already been signed up");
        } else {
          setError(
            insertError.message || "Something went wrong. Please try again."
          );
        }
      } else {
        setSuccess(true);
        setEmail("");
      }
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setEmail("");
    setError("");
    setSuccess(false);
  };

  const signUpButton = (
    <Button className="bg-gradient-to-r from-[#e6d3a3] to-[#d4b978] text-black hover:from-[#d4b978] hover:to-[#e6d3a3] font-medium py-2 px-4 w-full">
      Sign Up
    </Button>
  );

  const sheetContent = (
    <SheetContent
      side="right"
      className="sm:max-w-md w-full flex flex-col bg-black border-l border-[#e6d3a3]/30 backdrop-blur-xl"
      onOpenAutoFocus={resetState}
    >
      <SheetHeader className="mt-5 border-[#e6d3a3]/20">
        <SheetTitle className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#e6d3a3] via-[#f0e4c3] to-[#e6d3a3]">
          Sign Up for Sephira
        </SheetTitle>
        <SheetDescription className="text-center text-[#e6d3a3]/70">
          Join our community to get updates about new features and releases.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-grow py-2 flex flex-col">
        {success ? (
          <div className="flex flex-col items-center justify-center flex-grow space-y-4">
            <div className="text-center space-y-1">
              <p className="text-lg font-medium text-[#e6d3a3]">
                Thanks for signing up!
              </p>
              <p className="text-sm text-gray-400">
                We&apos;ll be in touch soon.
              </p>
            </div>
            <SheetClose asChild>
              <Button className="bg-gradient-to-r from-[#e6d3a3] to-[#d4b978] text-black hover:from-[#d4b978] hover:to-[#e6d3a3] py-2 px-4 mt-4">
                Close
              </Button>
            </SheetClose>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 flex-grow"
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[#e6d3a3]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-black/70 border-[#e6d3a3]/30 focus:border-[#e6d3a3] focus:ring-[#e6d3a3]/50 text-gray-200 placeholder:text-gray-500"
              />
            </div>

            {error && (
              <div className="p-2 bg-red-950/60 border border-red-800/50 rounded-md">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-auto bg-gradient-to-r from-[#e6d3a3] to-[#d4b978] text-black hover:from-[#d4b978] hover:to-[#e6d3a3] py-2"
            >
              {isSubmitting ? "Submitting..." : "Subscribe for Updates"}
            </Button>

            <p className="text-xs text-center text-gray-500">
              We&apos;ll never share your email with anyone else.
            </p>
          </form>
        )}
      </div>
    </SheetContent>
  );

  if (inline) {
    return (
      <Sheet>
        <SheetTrigger asChild>{signUpButton}</SheetTrigger>
        {sheetContent}
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{signUpButton}</SheetTrigger>
      {sheetContent}
    </Sheet>
  );
};

export default SignUpSheet;
