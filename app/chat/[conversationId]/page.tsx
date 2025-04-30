"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LandingChatbot from "../../components/LandingChatbot";
import PersonalitiesSection from "../../components/PersonalitiesSection";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { ModelName, ComparisonData } from "../../types";
import { useConversations } from "../../context/ConversationsContext";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = (params?.conversationId as string) || "";
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
      <main className="w-full min-h-screen flex flex-row relative">
        <Sidebar />

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col relative transition-all duration-300 ${
            sidebarOpen ? "md:ml-[300px]" : "md:ml-[60px]"
          }`}
        >
          <Header />

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
      </main>
    </SidebarProvider>
  );
}
