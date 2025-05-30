/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import LandingChatbot from "../../components/LandingChatbot";
import PersonalitiesSection from "../../components/PersonalitiesSection";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import OnboardingFlow, { UserIntent } from "../../components/OnboardingFlow";
import { ModelName } from "../../types";
import { useConversations } from "../../context/ConversationsContext";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId =
    typeof params.conversationId === "string" ? params.conversationId : "";
  const [messagesSent, setMessagesSent] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(150);
  const [chatLoading, setChatLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Check if we should skip onboarding (e.g., when creating new chat from sheet)
  const shouldSkipOnboarding = searchParams.get("skipOnboarding") === "true";
  const [showOnboarding, setShowOnboarding] = useState(!shouldSkipOnboarding);
  const [userIntent, setUserIntent] = useState<UserIntent | null>(null);

  const chatbotRef = useRef<HTMLDivElement>(null);
  const personalitiesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { conversations, updateConversation, createConversation } =
    useConversations();

  const conversation = conversations.find((c) => c.id === conversationId);

  // Clear the query parameter after checking it
  useEffect(() => {
    if (shouldSkipOnboarding) {
      // Remove the query parameter from the URL without triggering a navigation
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [shouldSkipOnboarding]);

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

      // Base header offset depends on screen size
      const isMobile = window.innerWidth < 640;
      const baseOffset = isMobile ? 80 : 120;

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
    // Use smaller offset on mobile
    const isMobile = window.innerWidth < 640; // sm breakpoint
    setHeaderOffset(isMobile ? 110 : 150);

    // Update on window resize
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      setHeaderOffset(isMobile ? 110 : 150);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle input focus/blur events to adjust layout
  useEffect(() => {
    const handleInputFocus = () => setIsInputFocused(true);
    const handleInputBlur = () => setIsInputFocused(false);

    window.addEventListener("inputFocus", handleInputFocus);
    window.addEventListener("inputBlur", handleInputBlur);

    return () => {
      window.removeEventListener("inputFocus", handleInputFocus);
      window.removeEventListener("inputBlur", handleInputBlur);
    };
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

  const handleOnboardingComplete = (intent: UserIntent) => {
    setUserIntent(intent);
    setShowOnboarding(false);

    // Update conversation with selected model from onboarding
    if (intent.suggestedModel) {
      setSelectedModels([intent.suggestedModel]);
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  // If onboarding is active, show it and nothing else
  if (showOnboarding) {
    return (
      <>
        <StarsBackground
          starDensity={0.0002}
          allStarsTwinkle={true}
          twinkleProbability={0.8}
          className="z-0"
        />
        <ShootingStars
          starColor="#e6d3a3"
          trailColor="#d4b978"
          minDelay={2000}
          maxDelay={6000}
          className="z-0"
        />
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </>
    );
  }

  // ----- Sharing logic -----
  const handleShareConversation = async () => {
    if (chatLoading) {
      // show toast informing to wait
      if (typeof window !== "undefined") {
        const event = new CustomEvent("showToast", {
          detail: {
            message: "Please wait for the response to finish before sharing",
            type: "info",
          },
        });
        window.dispatchEvent(event);
      }
      return;
    }
    if (!conversation) return;

    try {
      const res = await fetch("/api/share-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to share conversation");
      }

      const shareUrl = `${window.location.origin}/conversation-share/${data.id}`;

      // Copy the URL to clipboard for user convenience.
      await navigator.clipboard.writeText(shareUrl);

      // Show a toast so the user knows it worked.
      if (typeof window !== "undefined") {
        const event = new CustomEvent("showToast", {
          detail: {
            message: "Share link copied to clipboard!",
            type: "success",
          },
        });
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.error(err);

      if (typeof window !== "undefined") {
        const event = new CustomEvent("showToast", {
          detail: { message: "Failed to share conversation", type: "error" },
        });
        window.dispatchEvent(event);
      }
    }
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
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isInputFocused ? "mobile-keyboard-active" : ""
          }`}
          style={{
            height: isInputFocused ? "calc(100dvh - 210px)" : "calc(100vh - 210px)",
            marginTop: `${headerOffset}px`,
            marginBottom: "70px",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          }}
        >
          <div className="max-w-[1400px] mx-auto w-full pb-4">
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
                  setSelectedModels={setSelectedModels}
                  onFirstMessage={(msgModels) => {
                    // Always use the first model in the array for naming
                    const modelName = msgModels[0] || "AI";
                    const name = `${modelName} Conversation`;
                    markConversationStarted(name);
                  }}
                  onLoadingChange={setChatLoading}
                  userIntent={userIntent}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer onShare={handleShareConversation} shareDisabled={chatLoading} />
      </main>
    </>
  );
}
