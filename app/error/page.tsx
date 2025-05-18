"use client";

import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      {/* Stars background */}
      <StarsBackground
        starDensity={0.0002}
        allStarsTwinkle={true}
        twinkleProbability={0.8}
        className="z-0"
      />

      {/* Shooting stars */}
      <ShootingStars
        starColor="#e6d3a3"
        trailColor="#d4b978"
        minDelay={2000}
        maxDelay={6000}
        className="z-0"
      />

      <main className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#0c1320] p-8 rounded-xl border border-[#e6d3a3]/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-lg relative z-10">
          <h1 className="text-3xl font-normal text-[#d7c080] text-center mb-4">
            Oops!
          </h1>
          <p className="text-[#e6d3a3] text-center mb-6">
            Something went wrong with your request. This could be due to:
          </p>
          <ul className="text-[#e6d3a3]/80 space-y-2 mb-8 list-disc list-inside">
            <li>Invalid email or password</li>
            <li>Account not found</li>
            <li>Email not verified</li>
            <li>Server error</li>
          </ul>
          <div className="flex flex-col space-y-3">
            <Link
              href="/login"
              className="w-full bg-[#1c2434] text-[#e6d3a3] border border-[#e6d3a3]/40 hover:bg-[#2a3447] hover:border-[#e6d3a3]/70 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.2)] text-center"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full bg-[#0c1320] text-[#e6d3a3] border border-[#e6d3a3]/40 hover:bg-[#1c2434] hover:border-[#e6d3a3]/70 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,211,163,0.2)] text-center"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
