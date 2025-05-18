"use client";

import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

export default function VerifyEmailPage() {
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
            Check Your Email
          </h1>
          <p className="text-[#e6d3a3] text-center mb-6">
            We've sent you a verification email. Please check your inbox and
            click the verification link to complete your signup.
          </p>
          <div className="text-[#e6d3a3]/80 space-y-2 mb-8">
            <p className="text-center">Once verified, you'll be able to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Save your favorite prayers</li>
              <li>Access personalized features</li>
              <li>Participate in the community</li>
            </ul>
          </div>
          <p className="text-[#e6d3a3]/60 text-sm text-center">
            Didn't receive the email? Check your spam folder or contact support.
          </p>
        </div>
      </main>
    </>
  );
}
