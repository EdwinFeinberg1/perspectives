"use client";

import { useRef, useState } from "react";
import LandingChatbot from "./components/LandingChatbot";
import PersonalitiesSection from "./components/PersonalitiesSection";
import Header from "./components/Header";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT";

export default function Home() {
  const chatbotRef = useRef<HTMLDivElement>(null);
  const personalitiesRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<ModelName>("RabbiGPT");

  return (
    <main className="w-full min-h-screen flex flex-col relative">
      <Header />

      {/* Personalities Section */}
      <PersonalitiesSection
        ref={personalitiesRef}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* Chatbot Section */}
      <div ref={chatbotRef} className="py-12 px-[7%] relative z-10 bg-black/30">
        <div className="flex-1 min-h-[600px] h-[75vh] w-full">
          <LandingChatbot selectedModel={selectedModel} />
        </div>
      </div>
    </main>
  );
}
