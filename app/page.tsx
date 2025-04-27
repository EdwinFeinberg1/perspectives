"use client";

import { useRef, useState } from "react";
import LandingChatbot from "./components/LandingChatbot";
import PersonalitiesSection from "./components/PersonalitiesSection";
import Header from "./components/Header";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT" | null;

export default function Home() {
  const chatbotRef = useRef<HTMLDivElement>(null);
  const personalitiesRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<ModelName>(null);

  return (
    <main className="w-full min-h-screen flex flex-col relative">
      <Header />
      <h2 className="mt-20 text-[1.5rem] font-semibold mb-0 text-[#ddc39a] text-center">
        Select a model to begin
      </h2>
      {/* Personalities Section */}
      <PersonalitiesSection
        ref={personalitiesRef}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* Chatbot Section */}
      <div
        id="chatbot-section"
        ref={chatbotRef}
        className="relative z-10 bg-black/30 px-[7%]"
      >
        <div className="flex-1 min-h-[600px] h-[75vh]">
          <LandingChatbot selectedModel={selectedModel} />
        </div>
      </div>
    </main>
  );
}
