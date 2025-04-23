"use client";

import { useRef } from "react";
import Image from "next/image";
import Logo from "./assets/Logo.png";
import LandingChatbot from "./components/LandingChatbot";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Home() {
  const chatbotRef = useRef<HTMLDivElement>(null);

  const scrollToChatbot = () => {
    chatbotRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="w-full min-h-screen flex flex-col relative">
      <header className="flex justify-between items-center px-[7%] h-[90px] w-full bg-black/70 backdrop-blur-md border-b border-[#ddc39a]/10 fixed top-0 left-0 z-50">
        <div className="h-10 flex items-center">
          <span className="text-2xl font-bold text-[#ddc39a]">
            Perspectives.ai
          </span>
        </div>

        <div className="flex items-center gap-9">
          <div className="flex gap-[18px]">
            <button
              className="w-10 h-10 rounded-full bg-[rgba(13,12,8,0.3)] border border-[#ddc39a]/15 text-[#ddc39a] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:bg-[#ddc39a]/5 hover:-translate-y-[3px] hover:border-[#ddc39a]/40 hover:shadow-lg"
              aria-label="Facebook"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="w-10 h-10 rounded-full bg-[rgba(13,12,8,0.3)] border border-[#ddc39a]/15 text-[#ddc39a] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:bg-[#ddc39a]/5 hover:-translate-y-[3px] hover:border-[#ddc39a]/40 hover:shadow-lg"
              aria-label="Twitter"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="w-10 h-10 rounded-full bg-[rgba(13,12,8,0.3)] border border-[#ddc39a]/15 text-[#ddc39a] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:bg-[#ddc39a]/5 hover:-translate-y-[3px] hover:border-[#ddc39a]/40 hover:shadow-lg"
              aria-label="LinkedIn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9H2V21H6V9Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

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

        <a
          href="#explore"
          className="text-[#ddc39a] text-lg font-medium hover:text-white transition-colors duration-300 flex items-center gap-2"
        >
          🔍 Explore Perspectives <span className="text-xl">→</span>
        </a>
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

      {/* Features Section */}
      <section className="py-24 px-[7%] bg-gradient-to-b from-transparent to-black/30">
        <h2 className="text-[2.5rem] font-semibold mb-10 text-[#ddc39a] text-center">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="h-full border-[#ddc39a]/20 bg-black/40 backdrop-blur-sm">
            <CardHeader className="text-[#ddc39a]">
              Multiple Traditions
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#ddc39a]/70">
                Access wisdom from various religious and philosophical
                traditions in one place.
              </p>
            </CardContent>
          </Card>
          <Card className="h-full border-[#ddc39a]/20 bg-black/40 backdrop-blur-sm">
            <CardHeader className="text-[#ddc39a]">
              Personal Exploration
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#ddc39a]/70">
                Ask questions that matter to you without commitment to any
                single tradition.
              </p>
            </CardContent>
          </Card>
          <Card className="h-full border-[#ddc39a]/20 bg-black/40 backdrop-blur-sm">
            <CardHeader className="text-[#ddc39a]">
              Comparative Insights
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#ddc39a]/70">
                See how different traditions approach similar questions about
                life, death, and meaning.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Chatbot Section */}
      <div
        ref={chatbotRef}
        className="py-24 px-[7%] relative z-10 bg-transparent"
      >
        <h2 className="text-[2.5rem] font-semibold mb-10 text-[#ddc39a] text-center">
          Experience Now
        </h2>
        <div className="flex-1 min-h-[500px] h-[70vh] w-full">
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
