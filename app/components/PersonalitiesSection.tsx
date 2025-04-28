"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TheRabbi from "../assets/TheRabbi.png";
import ThePastor from "../assets/ThePastor.png";
import TheBuddha from "../assets/TheBuddha.png";
import TheImam from "../assets/Imam.png";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT" | "ImamGPT" | null;

interface PersonalitiesSectionProps {
  selectedModel: ModelName;
  setSelectedModel: (model: ModelName) => void;
}

const PersonalitiesSection = forwardRef<
  HTMLDivElement,
  PersonalitiesSectionProps
>(({ selectedModel, setSelectedModel }, ref) => {
  // Function to toggle model selection
  const toggleModelSelection = (model: NonNullable<ModelName>) => {
    if (selectedModel === model) {
      setSelectedModel(null); // Unselect if already selected
    } else {
      setSelectedModel(model); // Select otherwise

      // Scroll to chatbot section after a short delay to allow state update
      setTimeout(() => {
        const chatbotSection = document.getElementById("chatbot-section");
        if (chatbotSection) {
          chatbotSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <section
      ref={ref}
      className="mt-10  px-[7%] bg-gradient-to-b from-transparent to-black/30 mb-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card
          className={`h-full border-2 ${
            selectedModel === "RabbiGPT"
              ? "border-[#ddc39a]"
              : "border-[#ddc39a]/20"
          } bg-black/40 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => toggleModelSelection("RabbiGPT")}
        >
          <div className="h-80 relative flex items-center justify-center overflow-hidden pt-6">
            <Image
              src={TheRabbi}
              alt="RabbiGPT"
              width={256}
              height={256}
              className="object-contain object-center"
              priority
            />
          </div>
          <CardHeader className="text-[#ddc39a] flex flex-row items-center gap-2">
            <span className="text-xl">✡️</span>
            <span>RabbiGPT</span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#ddc39a]/70">
              Rooted in Torah and Jewish thought, RabbiGPT offers thoughtful
              answers shaped by thousands of years of Jewish wisdom.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`h-full border-2 ${
            selectedModel === "PastorGPT"
              ? "border-[#ddc39a]"
              : "border-[#ddc39a]/20"
          } bg-black/40 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => toggleModelSelection("PastorGPT")}
        >
          <div className="h-80 relative flex items-center justify-center overflow-hidden pt-6">
            <Image
              src={ThePastor}
              alt="PastorGPT"
              width={256}
              height={256}
              className="object-contain object-center"
              priority
            />
          </div>
          <CardHeader className="text-[#ddc39a] flex flex-row items-center gap-2">
            <span className="text-xl">✝️</span>
            <span>PastorGPT</span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#ddc39a]/70">
              Grounded in Christian scripture and tradition, PastorGPT provides
              compassionate guidance informed by Biblical teachings and
              theological reflection.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`h-full border-2 ${
            selectedModel === "BuddhaGPT"
              ? "border-[#ddc39a]"
              : "border-[#ddc39a]/20"
          } bg-black/40 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => toggleModelSelection("BuddhaGPT")}
        >
          <div className="h-80 relative flex items-center justify-center overflow-hidden pt-6">
            <Image
              src={TheBuddha}
              alt="BuddhaGPT"
              width={256}
              height={256}
              className="object-contain object-center"
              priority
            />
          </div>
          <CardHeader className="text-[#ddc39a] flex flex-row items-center gap-2">
            <span className="text-xl">☸️</span>
            <span>BuddhaGPT</span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#ddc39a]/70">
              Inspired by the Buddha&apos;s teachings, this perspective draws
              from the Dhammapada and sutras to offer mindful, reflective
              insight.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`h-full border-2 ${
            selectedModel === "ImamGPT"
              ? "border-[#ddc39a]"
              : "border-[#ddc39a]/20"
          } bg-black/40 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => toggleModelSelection("ImamGPT")}
        >
          <div className="h-80 relative flex items-center justify-center overflow-hidden pt-6">
            <Image
              src={TheImam}
              alt="ImamGPT"
              width={256}
              height={256}
              className="object-contain object-center"
              priority
            />
          </div>
          <CardHeader className="text-[#ddc39a] flex flex-row items-center gap-2">
            <span className="text-xl">☪️</span>
            <span>ImamGPT</span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#ddc39a]/70">
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
