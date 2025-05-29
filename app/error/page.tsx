"use client";

import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleTryAgain = () => {
    window.location.reload();
  };

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
        <Card className="w-full max-w-md bg-black/80 backdrop-blur-sm border-border/50 shadow-2xl">
          <CardContent className="p-8">
            <h1 className="text-3xl font-normal text-foreground text-center mb-4">
              Something went wrong
            </h1>
            <p className="text-foreground text-center mb-6">
              An unexpected error occurred
            </p>
            <ul className="text-muted-foreground space-y-2 mb-8 list-disc list-inside">
              <li>Try refreshing the page</li>
              <li>Check your internet connection</li>
              <li>Clear your browser cache</li>
              <li>Contact support if the issue persists</li>
            </ul>
            <div className="space-y-3">
              <Button
                onClick={handleTryAgain}
                className="w-full bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 hover:border-border/70 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                Try again
              </Button>
              <Button
                onClick={handleGoHome}
                className="w-full bg-background text-foreground border border-border hover:bg-muted hover:border-border/70 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
