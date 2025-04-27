"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TheRabbi from "../assets/TheRabbi.png";
import ThePastor from "../assets/ThePastor.png";
import TheBuddha from "../assets/TheBuddha.png";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT";

interface PersonalitiesSectionProps {
  selectedModel: ModelName;
  setSelectedModel: (model: ModelName) => void;
}

const PersonalitiesSection = forwardRef<
  HTMLDivElement,
  PersonalitiesSectionProps
>(({ selectedModel, setSelectedModel }, ref) => (
  <section
    ref={ref}
    className="py-24 px-[7%] bg-gradient-to-b from-transparent to-black/30"
  >
    <h2 className="text-[2.5rem] font-semibold mb-10 text-[#ddc39a] text-center">
      Our AI Personalities
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card
        className={`h-full border-2 ${
          selectedModel === "RabbiGPT"
            ? "border-[#ddc39a]"
            : "border-[#ddc39a]/20"
        } bg-black/40 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
        onClick={() => setSelectedModel("RabbiGPT")}
      >
        <div className="h-64 relative overflow-hidden">
          <Image
            src={TheRabbi}
            alt="RabbiGPT"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
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
        onClick={() => setSelectedModel("PastorGPT")}
      >
        <div className="h-64 relative overflow-hidden">
          <Image
            src={ThePastor}
            alt="PastorGPT"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
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
        onClick={() => setSelectedModel("BuddhaGPT")}
      >
        <div className="h-64 relative overflow-hidden">
          <Image
            src={TheBuddha}
            alt="BuddhaGPT"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
        <CardHeader className="text-[#ddc39a] flex flex-row items-center gap-2">
          <span className="text-xl">☸️</span>
          <span>BuddhaGPT</span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#ddc39a]/70">
            Inspired by the Buddha&apos;s teachings, this perspective draws from
            the Dhammapada and sutras to offer mindful, reflective insight.
          </p>
        </CardContent>
      </Card>
    </div>
  </section>
));

PersonalitiesSection.displayName = "PersonalitiesSection";

export default PersonalitiesSection;
