import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { login, signup } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styles from "./LoginPage.module.css";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      {/* 🌌 star field behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <StarsBackground
          starDensity={0.0002}
          allStarsTwinkle
          twinkleProbability={0.8}
        />
        <ShootingStars
          starColor="#e6d3a3"
          trailColor="#d4b978"
          minDelay={2000}
          maxDelay={6000}
        />
      </div>

      {/* 🎯 centre-and-fit card */}
      <form
        action={login} /* default submit → log-in */
        className={styles.card}
      >
        {/* title */}
        <h1 className="text-center text-4xl font-normal text-foreground">
          Welcome to Sephira
        </h1>

        {/* email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-base text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 bg-card/60 text-foreground border border-border
                       placeholder:text-muted-foreground
                       focus:border-ring
                       transition-all duration-300"
          />
        </div>

        {/* password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-base text-foreground">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="h-12 bg-card/60 text-foreground border border-border
                       placeholder:text-muted-foreground
                       focus:border-ring
                       transition-all duration-300"
          />
        </div>

        {/* buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            className="h-12 w-full bg-primary text-primary-foreground border border-border
                       hover:bg-primary/80 hover:border-border/70
                       transition-all duration-300
                       hover:shadow-lg"
          >
            Log in
          </Button>

          <Link href="/signup" className="block">
            <Button
              type="submit"
              variant="outline"
              className="h-12 w-full bg-transparent text-foreground border border-border
                         hover:bg-muted hover:border-border/70
                         transition-all duration-300
                         hover:shadow-lg"
            >
              Sign up
            </Button>
          </Link>
        </div>
      </form>
    </>
  );
}
