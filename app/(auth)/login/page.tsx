import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { login, signup } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styles from "./LoginPage.module.css";


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
        <h1 className="text-center text-4xl font-normal text-[#d7c080]">
          Welcome to Sephira
        </h1>

        {/* email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-base text-[#e6d3a3]">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 bg-[#1c2434]/60 text-[#e6d3a3] border border-[#e6d3a3]/40
                       placeholder:text-[#e6d3a3]/50
                       focus:border-[#e6d3a3]/70 focus:ring-[#e6d3a3]/40"
          />
        </div>

        {/* password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-base text-[#e6d3a3]">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="h-12 bg-[#1c2434]/60 text-[#e6d3a3] border border-[#e6d3a3]/40
                       placeholder:text-[#e6d3a3]/50
                       focus:border-[#e6d3a3]/70 focus:ring-[#e6d3a3]/40"
          />
        </div>

        {/* buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            className="h-12 w-full bg-[#1c2434] text-[#e6d3a3] border border-[#e6d3a3]/50
                       hover:bg-[#2a3447] hover:border-[#e6d3a3]/70"
          >
            Log in
          </Button>

          <Button
            type="submit"
            formAction={signup}
            variant="outline"
            className="h-12 w-full bg-transparent text-[#e6d3a3] border border-[#e6d3a3]/50
                       hover:bg-[#1c2434] hover:border-[#e6d3a3]/70"
          >
            Sign up
          </Button>
        </div>
      </form>
    </>
  );
}