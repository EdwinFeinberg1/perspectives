"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TheRabbi from "../assets/TheRabbi.png";
import ThePastor from "../assets/ThePastor.png";
import TheBuddha from "../assets/TheBuddha.png";
import TheImam from "../assets/Imam.png";
import { ModelName } from "../types";

interface PersonalitiesSectionProps {
  selectedModels: ModelName[];
  setSelectedModels: (models: ModelName[]) => void;
}

const PersonalitiesSection = forwardRef<
  HTMLDivElement,
  PersonalitiesSectionProps
>(({ selectedModels, setSelectedModels }, ref) => {
  // Function to toggle model selection
  const toggleModelSelection = (model: NonNullable<ModelName>) => {
    if (selectedModels.includes(model)) {
      // Remove the model if already selected
      setSelectedModels(selectedModels.filter((m) => m !== model));
    } else {
      // Add the model to selection
      setSelectedModels([...selectedModels, model]);
    }

    // Scroll to chatbot section after a short delay to allow state update
    setTimeout(() => {
      const chatbotSection = document.getElementById("chatbot-section");
      if (chatbotSection && selectedModels.length > 0) {
        chatbotSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section
      ref={ref}
      className="mt-10 px-[7%] bg-gradient-to-b from-transparent to-black/40 mb-10 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className={`h-full border-2 ${
            selectedModels.includes("RabbiGPT")
              ? "border-[#e6d3a3]"
              : "border-[#e6d3a3]/40"
          } bg-black/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => toggleModelSelection("RabbiGPT")}
        >
          <div className="h-56 relative flex items-center justify-center overflow-hidden pt-4">
            <Image
              src={TheRabbi}
              alt="RabbiGPT"
              width={200}
              height={200}
              className="object-contain object-center"
              priority
            />
          </div>
          <CardHeader className="text-[#f0e4c3] flex flex-row items-center gap-2 pt-1 pb-0">
            <span className="text-lg">✡️</span>
            <span className="text-base font-medium">RabbiGPT</span>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <p className="text-xs text-[#e6d3a3] leading-snug">
              Rooted in Torah and Jewish thought, RabbiGPT offers thoughtful
              answers shaped by thousands of years of Jewish wisdom.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`h-full border-2 ${
            selectedModels.includes("PastorGPT")
              ? "border-[#e6d3a3]"
              : "border-[#e6d3a3]/40"
          } bg-black/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => toggleModelSelection("PastorGPT")}
        >
          <div className="h-56 relative flex items-center justify-center overflow-hidden pt-4">
            <Image
              src={ThePastor}
              alt="PastorGPT"
              width={200}
              height={200}
              className="object-contain object-center"
              priority
            />
          </div>
          <CardHeader className="text-[#f0e4c3] flex flex-row items-center gap-2 pt-1 pb-0">
            <span className="text-lg">✝️</span>
            <span className="text-base font-medium">PastorGPT</span>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <p className="text-xs text-[#e6d3a3] leading-snug">
              Grounded in Christian scripture and tradition, PastorGPT provides
              compassionate guidance informed by Biblical teachings and
              theological reflection.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`h-full border-2 ${
            selectedModels.includes("BuddhaGPT")
              ? "border-[#e6d3a3]"
              : "border-[#e6d3a3]/40"
          } bg-black/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => toggleModelSelection("BuddhaGPT")}
        >
          <div className="h-56 relative flex items-center justify-center overflow-hidden pt-4">
            <Image
              src={TheBuddha}
              alt="BuddhaGPT"
              width={200}
              height={200}
              className="object-contain object-center"
              priority
            />
          </div>
          <CardHeader className="text-[#f0e4c3] flex flex-row items-center gap-2 pt-1 pb-0">
            <span className="text-lg">☸️</span>
            <span className="text-base font-medium">BuddhaGPT</span>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <p className="text-xs text-[#e6d3a3] leading-snug">
              Inspired by the Buddha's teachings, this perspective draws from
              the Dhammapada and sutras to offer mindful, reflective insight.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`h-full border-2 ${
            selectedModels.includes("ImamGPT")
              ? "border-[#e6d3a3]"
              : "border-[#e6d3a3]/40"
          } bg-black/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => toggleModelSelection("ImamGPT")}
        >
          <div className="h-56 relative flex items-center justify-center overflow-hidden pt-4">
            <Image
              src={TheImam}
              alt="ImamGPT"
              width={200}
              height={200}
              className="object-contain object-center"
              priority
            />
          </div>
          <CardHeader className="text-[#f0e4c3] flex flex-row items-center gap-2 pt-1 pb-0">
            <span className="text-lg">☪️</span>
            <span className="text-base font-medium">ImamGPT</span>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <p className="text-xs text-[#e6d3a3] leading-snug">
              Grounded in Islamic tradition and the teachings of the Quran,
              ImamGPT provides thoughtful guidance from the perspective of
              Islamic wisdom.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

PersonalitiesSection.displayName = "PersonalitiesSection";

export default PersonalitiesSection;
