"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LandingChatbot from "../../components/LandingChatbot";
import PersonalitiesSection from "../../components/PersonalitiesSection";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { ModelName, ComparisonData } from "../../types";
import { useConversations } from "../../context/ConversationsContext";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = (params?.conversationId as string) || "";

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
  };

  const headerTitle =
    conversation.selectedModels.length === 0
      ? "Select one or more perspectives to begin"
      : conversation.selectedModels.length === 1
      ? `Ask ${conversation.selectedModels[0]} a question`
      : "Ask ComparisonGPT a question";

  return (
    <main className="w-full min-h-screen flex flex-row relative">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative ml-64">
        <Header />
        <h2 className="mt-20 text-[1.5rem] font-semibold mb-0 text-[#ddc39a] text-center">
          {headerTitle}
        </h2>

        {!conversation.hasStarted && (
          <PersonalitiesSection
            ref={personalitiesRef}
            selectedModels={conversation.selectedModels}
            setSelectedModels={setSelectedModels}
          />
        )}

        <div
          id="chatbot-section"
          ref={chatbotRef}
          className="relative z-10 bg-black/30 px-[7%]"
        >
          <div
            className={`flex-1 ${
              conversation.hasStarted ? "min-h-[600px] h-[75vh]" : "h-auto"
            }`}
          >
            <LandingChatbot
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
    </main>
  );
}
