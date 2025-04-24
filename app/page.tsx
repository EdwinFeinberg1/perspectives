"use client";

import { useRef } from "react";
import Image from "next/image";
import Logo from "./assets/Logo.png";
import LandingChatbot from "./components/LandingChatbot";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TheRabbi from "./assets/TheRabbi.png";
import ThePastor from "./assets/ThePastor.png";
import TheBuddha from "./assets/TheBuddha.png";
import InfiniteMovingCardsDemo from "@/components/infinite-moving-cards-demo";

export default function Home() {
  const chatbotRef = useRef<HTMLDivElement>(null);
  const personalitiesRef = useRef<HTMLDivElement>(null);

  const scrollToChatbot = () => {
    chatbotRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPersonalities = () => {
    personalitiesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="w-full min-h-screen flex flex-col relative">
      <header className="flex justify-between items-center px-[7%] h-[90px] w-full bg-black/70 backdrop-blur-md border-b border-[#ddc39a]/10 fixed top-0 left-0 z-50">
        <div className="h-10 flex items-center">
          <span className="text-2xl font-bold text-[#ddc39a]">
            Perspectives.ai
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="py-3 px-7 bg-[#ddc39a]/90 text-black border-none rounded-[30px] font-medium text-base cursor-pointer transition-all duration-300 tracking-wider flex items-center gap-2.5 shadow-lg hover:-translate-y-[3px] hover:shadow-xl hover:bg-[#ddc39a]"
            onClick={scrollToChatbot}
          >
            <span>🗣️ Start Asking</span>
          </button>
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <section className="pt-[160px] px-[7%] pb-[80px] text-center w-full flex flex-col items-center justify-center min-h-[70vh] z-10 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm">
        <h1 className="text-[3.5rem] md:text-[4.5rem]  mb-12 text-[#ddc39a] leading-tight shadow-md max-w-[900px]">
          Ask the big questions.{" "}
        </h1>

        <button
          onClick={scrollToPersonalities}
          className="text-[#ddc39a] text-lg font-medium hover:text-white transition-colors duration-300 flex items-center gap-2 bg-transparent border-none cursor-pointer"
        >
          🔍 Explore Perspectives <span className="text-xl">→</span>
        </button>
      </section>

      {/* Moving Cards Section */}
      <section className="py-20 px-[7%] bg-black/30 backdrop-blur-sm border-y border-[#ddc39a]/10">
        <div className="max-w-7xl mx-auto">
          <InfiniteMovingCardsDemo />
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="explore"
        className="py-24 px-[7%] bg-black/30 backdrop-blur-sm border-y border-[#ddc39a]/10"
      >
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-[2.5rem] font-semibold mb-10 text-[#ddc39a] text-center">
            Our Mission
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#ddc39a]/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-[#ddc39a]">
                Safe Exploration
              </h3>
              <p className="text-[#ddc39a]/90 leading-relaxed">
                Your space to explore spiritual questions—without pressure,
                dogma, or judgment.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#ddc39a]/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🗣️</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-[#ddc39a]">
                Multiple Perspectives
              </h3>
              <p className="text-[#ddc39a]/90 leading-relaxed">
                Talk with RabbiGPT, BuddhaGPT, ImamGPT, and more to get varied
                insights.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#ddc39a]/20 flex items-center justify-center mb-6">
                <span className="text-3xl">💫</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-[#ddc39a]">
                Shared Wisdom
              </h3>
              <p className="text-[#ddc39a]/90 leading-relaxed">
                Discover how different paths wrestle with the same human
                longing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personalities Section */}
      <section
        ref={personalitiesRef}
        className="py-24 px-[7%] bg-gradient-to-b from-transparent to-black/30"
      >
        <h2 className="text-[2.5rem] font-semibold mb-10 text-[#ddc39a] text-center">
          Our AI Personalities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="h-full border-[#ddc39a]/20 bg-black/40 backdrop-blur-sm overflow-hidden">
            <div className="h-64 relative overflow-hidden">
              <Image
                src={TheRabbi}
                alt="RabbiGPT"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <CardHeader className="text-[#ddc39a] flex flex-row items-center gap-2">
              <span className="text-xl">✡️</span>
              <span>RabbiGPT</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#ddc39a]/70">
                Rooted in Torah and Jewish thought, RabbiGPT offers thoughtful
                answers shaped by thousands of years of Jewish wisdom.
              </p>
            </CardContent>
          </Card>

          <Card className="h-full border-[#ddc39a]/20 bg-black/40 backdrop-blur-sm overflow-hidden">
            <div className="h-64 relative overflow-hidden">
              <Image
                src={ThePastor}
                alt="PastorGPT"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <CardHeader className="text-[#ddc39a] flex flex-row items-center gap-2">
              <span className="text-xl">✝️</span>
              <span>PastorGPT</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#ddc39a]/70">
                Grounded in Christian scripture and tradition, PastorGPT
                provides compassionate guidance informed by Biblical teachings
                and theological reflection.
              </p>
            </CardContent>
          </Card>

          <Card className="h-full border-[#ddc39a]/20 bg-black/40 backdrop-blur-sm overflow-hidden">
            <div className="h-64 relative overflow-hidden">
              <Image
                src={TheBuddha}
                alt="BuddhaGPT"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <CardHeader className="text-[#ddc39a] flex flex-row items-center gap-2">
              <span className="text-xl">☸️</span>
              <span>BuddhaGPT</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#ddc39a]/70">
                Inspired by the Buddha&apos;s teachings, this perspective draws
                from the Dhammapada and sutras to offer mindful, reflective
                insight.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Chatbot Section */}
      <div
        ref={chatbotRef}
        className="py-24 px-[5%] relative z-10 bg-transparent"
      >
        <h2 className="text-[2.5rem] font-semibold mb-6 text-[#ddc39a] text-center">
        Explore different religious perspectives side by side.
        </h2>
        <p className="text-center text-[#ddc39a]/80 mb-8 max-w-[800px] mx-auto">
          Ask a question
          and see how different traditions respond.
        </p>
        <div className="flex-1 min-h-[600px] h-[75vh] w-full max-w-[1400px] mx-auto">
          <LandingChatbot />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-[7%] py-8 bg-black/70 backdrop-blur-md border-t border-[#ddc39a]/10 text-[#ddc39a]/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Image
              src={Logo}
              alt="Perspectives.ai Logo"
              height={40}
              className="h-auto w-auto max-h-10 object-contain mb-4"
            />
            <p className="text-sm">Exploring spiritual wisdom through AI.</p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-medium mb-4">Explore</h3>
            <a
              href="#"
              className="text-sm mb-2 hover:text-[#ddc39a] transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm mb-2 hover:text-[#ddc39a] transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm mb-2 hover:text-[#ddc39a] transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm hover:text-[#ddc39a] transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="flex flex-col">
            <h3 className="font-medium mb-4">Legal</h3>
            <a
              href="#"
              className="text-sm mb-2 hover:text-[#ddc39a] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm mb-2 hover:text-[#ddc39a] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm hover:text-[#ddc39a] transition-colors"
            >
              Cookie Policy
            </a>
          </div>

          <div className="flex flex-col">
            <h3 className="font-medium mb-4">Connect</h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:edwinfeinberg@gmail.com"
                className="text-sm hover:text-[#ddc39a] transition-colors"
              >
                edwinfeinberg@gmail.com
              </a>
              <a
                href="mailto:shepherdvitelaalyssa@gmail.com"
                className="text-sm hover:text-[#ddc39a] transition-colors"
              >
                shepherdvitelaalyssa@gmail.com
              </a>
              <a
                href="mailto:bellawynne8@gmail.com"
                className="text-sm hover:text-[#ddc39a] transition-colors"
              >
                bellawynne8@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#ddc39a]/10 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Perspectives.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
