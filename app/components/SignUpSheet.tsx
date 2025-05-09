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
import { supabase } from "../../lib/supabase";

interface SignUpSheetProps {
  inline?: boolean;
}

const SignUpSheet: React.FC<SignUpSheetProps> = ({ inline = false }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);

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

  const toggleAccordionItem = (itemId: string) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  const AccordionItem = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openItem === id;

    return (
      <div className="border-b border-[#e6d3a3]/20">
        <button
          onClick={() => toggleAccordionItem(id)}
          className="flex justify-between items-center w-full px-4 py-3 text-left"
        >
          <span className="text-[#e6d3a3] font-medium">{title}</span>
          <svg
            className={`w-5 h-5 text-[#e6d3a3] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div
          className={`overflow-hidden transition-all ${
            isOpen ? "max-h-[1000px] py-3" : "max-h-0"
          }`}
        >
          <div className="px-4 text-gray-400 text-sm">{children}</div>
        </div>
      </div>
    );
  };

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

  const learnMoreSection = (
    <div className="mt-6 pt-4 border-t border-[#e6d3a3]/20 bg-black/50 backdrop-blur-sm rounded-md">
      <div className="border-[#e6d3a3]/20">
        <AccordionItem id="about" title="About">
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Sephira sees religions not as final answers but as{" "}
              <em>languages</em>&mdash;different ways of pointing to the same
              inexpressible truth.
            </p>

            <p>
              This app lets you hear that truth through many voices. Ask
              anything—from deep pain to divine purpose—and discover how each
              tradition reaches for the same light.
            </p>

            <p>
              It&apos;s about waking up to the possibility that something
              greater is calling&mdash;and that your question is already part of
              the answer.
            </p>
          </div>
        </AccordionItem>

        <AccordionItem id="contact" title="Contact">
          <div className="space-y-2">
            <p>
              If you, discover a bug, have a suggestion to make Saphira better,
              or feel called to lend your skills and get involved
            </p>
            <div className="mt-2">
              <span>send a note to </span>
              <span className="text-[#e6d3a3]/90">edwin@ask‑sephira.com</span>
              <span> and we will respond as soon as we can.</span>
            </div>
            <p className="mt-2">Thank you for helping this project grow.</p>
          </div>
        </AccordionItem>

        <AccordionItem id="faq" title="FAQ">
          <div className="space-y-2">
            <div>
              <p className="font-medium text-[#e6d3a3]/90">
                How reliable are the answers I get right now?
              </p>
              <p>
                While we draw from trusted sources across several traditions,
                Saphira is currently in open beta, therefore, some responses may
                be incomplete, imprecise, or miss the nuance you&apos;re looking
                for. We&apos;re actively improving accuracy every day and your
                feedback is a key part of that refinement. If you spot an error,
                feel something is missing, or simply have an idea to make
                Saphira better, please reach out at edwin@ask‑sephira.com.
              </p>
            </div>
          </div>
        </AccordionItem>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="space-y-4">
        <Sheet>
          <SheetTrigger asChild>{signUpButton}</SheetTrigger>
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
                Join our community to get updates about new features and
                releases.
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
        </Sheet>
        {learnMoreSection}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Sheet>
        <SheetTrigger asChild>{signUpButton}</SheetTrigger>
        {sheetContent}
      </Sheet>
      {learnMoreSection}
    </div>
  );
};

export default SignUpSheet;
