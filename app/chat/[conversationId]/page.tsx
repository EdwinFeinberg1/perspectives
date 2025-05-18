/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LandingChatbot from "../../components/LandingChatbot";
import PersonalitiesSection from "../../components/PersonalitiesSection";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ModelName } from "../../types";
import { useConversations } from "../../context/ConversationsContext";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId =
    typeof params.conversationId === "string" ? params.conversationId : "";
  const [messagesSent, setMessagesSent] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(150);

  const chatbotRef = useRef<HTMLDivElement>(null);
  const personalitiesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { conversations, updateConversation, createConversation } =
    useConversations();

  const conversation = conversations.find((c) => c.id === conversationId);

  // Listen for theme subheader toggle events
  useEffect(() => {
    const handleThemeSubheaderToggle = (e: CustomEvent) => {
      const { expanded } = e.detail;

      // Get the subheader height from CSS variable
      const subheaderHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--theme-subheader-height"
        ) || "0"
      );

      // Base header offset (with no expanded subheader)
      const baseOffset = 120;

      // Set new offset with a slight delay to match animations
      if (expanded) {
        // If expanding, update immediately to avoid content jumps
        setHeaderOffset(baseOffset + subheaderHeight);
      } else {
        // If collapsing, wait for animation to complete
        setTimeout(() => {
          setHeaderOffset(baseOffset);
        }, 300);
      }
    };

    // Add event listener with type assertion
    window.addEventListener(
      "themeSubheaderToggled",
      handleThemeSubheaderToggle as EventListener
    );

    return () => {
      window.removeEventListener(
        "themeSubheaderToggled",
        handleThemeSubheaderToggle as EventListener
      );
    };
  }, []);

  // Set initial header offset
  useEffect(() => {
    setHeaderOffset(150);
  }, []);

  // If conversation not found, create a new one and redirect
  useEffect(() => {
    if (!conversation) {
      const newId = createConversation();
      router.replace(`/chat/${newId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  if (!conversation) return null; // will redirect

  const setSelectedModels = (models: ModelName[]) => {
    updateConversation(conversationId, { selectedModels: models });
  };

  const markConversationStarted = (newName: string) => {
    updateConversation(conversationId, { hasStarted: true, name: newName });
    setMessagesSent(true);
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

      <main className="w-full min-h-screen flex flex-col relative">
        <Header />

        {/* Main scrollable content area between header and footer */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto transition-all duration-300"
          style={{
            height: "calc(100vh - 210px)",
            marginTop: `${headerOffset}px`,
            marginBottom: "70px",
          }}
        >
          <div className="max-w-[1400px] mx-auto w-full pb-5">
            <PersonalitiesSection
              ref={personalitiesRef}
              selectedModels={conversation.selectedModels}
              setSelectedModels={setSelectedModels}
            />

            <div
              id="chatbot-section"
              ref={chatbotRef}
              className="relative z-10 px-4 sm:px-6 md:px-8 rounded-xl max-w-[1200px] mx-auto scroll-mt-28"
            >
              <div
                className={`flex-1 ${
                  conversation.hasStarted ? "min-h-[500px]" : "h-auto"
                }`}
              >
                <LandingChatbot
                  conversationId={conversationId}
                  selectedModels={conversation.selectedModels}
                  onFirstMessage={(msgModels) => {
                    // Always use the first model in the array for naming
                    const modelName = msgModels[0] || "AI";
                    const name = `${modelName} Conversation`;
                    markConversationStarted(name);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer/>
      </main>
    </>
  );
}
