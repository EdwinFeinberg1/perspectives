"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LandingChatbot from "../../components/LandingChatbot";
import PersonalitiesSection from "../../components/PersonalitiesSection";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ModelName, ComparisonData } from "../../types";
import { useConversations } from "../../context/ConversationsContext";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = (params?.conversationId as string) || "";
  const [messagesSent, setMessagesSent] = useState(false);

  const chatbotRef = useRef<HTMLDivElement>(null);
  const personalitiesRef = useRef<HTMLDivElement>(null);

  const { conversations, updateConversation, createConversation } =
    useConversations();

  const conversation = conversations.find((c) => c.id === conversationId);

  const [, setComparisonData] = useState<ComparisonData>({
    uniquePoints: {
      RabbiGPT: [],
      BuddhaGPT: [],
      PastorGPT: [],
      ImamGPT: [],
    },
    similarities: [],
  });

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

      <main className="w-full min-h-screen flex flex-row relative">
        {/* Main content */}
        <div className="flex-1 flex flex-col relative">
          <Header />

          {/* Content with proper spacing for the header and footer */}
          <div className="mt-[100px] mb-[70px] max-w-[1400px] mx-auto w-full">
            {!conversation.hasStarted && (
              <PersonalitiesSection
                ref={personalitiesRef}
                selectedModels={conversation.selectedModels}
                setSelectedModels={setSelectedModels}
                messagesSent={messagesSent}
              />
            )}

            <div
              id="chatbot-section"
              ref={chatbotRef}
              className="relative z-10 px-4 sm:px-6 md:px-8 rounded-xl max-w-[1200px] mx-auto scroll-mt-28"
            >
              <div
                className={`flex-1 ${
                  conversation.hasStarted ? "min-h-[600px] h-[75vh]" : "h-auto"
                }`}
              >
                <LandingChatbot
                  conversationId={conversationId}
                  selectedModels={conversation.selectedModels}
                  setComparisonData={setComparisonData}
                  onFirstMessage={(msgModels) => {
                    const name =
                      msgModels.length === 1
                        ? `${msgModels[0]} Conversation`
                        : `Comparison: ${msgModels.join(" & ")}`;
                    markConversationStarted(name);
                  }}
                />
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
