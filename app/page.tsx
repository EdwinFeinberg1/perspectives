"use client";

import { useRef, useState } from "react";
import LandingChatbot from "./components/LandingChatbot";
import PersonalitiesSection from "./components/PersonalitiesSection";
import Header from "./components/Header";
import { ModelName, ComparisonData } from "./types";

export default function Home() {
  const chatbotRef = useRef<HTMLDivElement>(null);
  const personalitiesRef = useRef<HTMLDivElement>(null);
  const [selectedModels, setSelectedModels] = useState<ModelName[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    uniquePoints: {
      RabbiGPT: [],
      BuddhaGPT: [],
      PastorGPT: [],
      ImamGPT: [],
    },
    similarities: [],
  });

  return (
    <main className="w-full min-h-screen flex flex-col relative">
      <Header />
      <h2 className="mt-20 text-[1.5rem] font-semibold mb-0 text-[#ddc39a] text-center">
        {selectedModels.length === 0
          ? "Select one or more perspectives to begin"
          : selectedModels.length === 1
          ? `Ask ${selectedModels[0]} a question`
          : "Compare multiple perspectives"}
      </h2>
      {/* Personalities Section */}
      <PersonalitiesSection
        ref={personalitiesRef}
        selectedModels={selectedModels}
        setSelectedModels={setSelectedModels}
      />

      {/* Chatbot Section */}
      <div
        id="chatbot-section"
        ref={chatbotRef}
        className="relative z-10 bg-black/30 px-[7%]"
      >
        <div className="flex-1 min-h-[600px] h-[75vh]">
          <LandingChatbot
            selectedModels={selectedModels}
            setComparisonData={setComparisonData}
          />
        </div>
      </div>
    </main>
  );
}
