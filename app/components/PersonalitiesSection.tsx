"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ModelName } from "../types";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { StaticImageData } from "next/image";
import { PERSONALITIES, Personality } from "../constants/personalities";

interface PersonalityCardProps {
  model: NonNullable<ModelName>;
  image: StaticImageData;
  emoji: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: (model: NonNullable<ModelName>) => void;
}

const PersonalityCard: React.FC<PersonalityCardProps> = ({
  model,
  image,
  emoji,
  title,
  description,
  isSelected,
  onClick,
}) => {
  const cardClassName = `border-2 transition-all duration-300 overflow-hidden cursor-pointer bg-black/60 
    ${
      isSelected
        ? "border-[#e6d3a3] shadow-[0_0_20px_rgba(230,211,163,0.5)] scale-[1.02] bg-gradient-to-b from-black/70 to-[#e6d3a3]/10 animate-subtle-pulse"
        : "border-[#e6d3a3]/40 hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-[1.02] hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/60 hover:to-black/70"
    }`;

  return (
    <Card className={cardClassName} onClick={() => onClick(model)}>
      <div className="h-[160px] relative flex items-center justify-center overflow-hidden pt-2">
        <Image
          src={image}
          alt={title}
          width={140}
          height={140}
          className="object-contain object-center w-auto h-auto max-h-[140px]"
          priority
        />
      </div>
      <CardHeader className="text-[#f0e4c3] flex flex-row items-center gap-2 pt-3 pb-1">
        <span className="text-lg">{emoji}</span>
        <span className="text-base font-medium">{title}</span>
        {isSelected && (
          <span className="ml-auto text-xs opacity-80">Selected</span>
        )}
      </CardHeader>
      <CardContent className="pt-1 pb-4">
        <p className="text-xs text-[#e6d3a3] leading-tight">{description}</p>
      </CardContent>
    </Card>
  );
};

interface PersonalitiesSectionProps {
  selectedModels: ModelName[];
  setSelectedModels: (models: ModelName[]) => void;
  messagesSent: boolean; // To track if any messages have been sent
}

const PersonalitiesSection = forwardRef<
  HTMLDivElement,
  PersonalitiesSectionProps
>(({ selectedModels, setSelectedModels }, ref) => {
  // Pure function to handle model selection
  const toggleModelSelection = (model: NonNullable<ModelName>) => {
    const newSelectedModels = selectedModels.includes(model)
      ? selectedModels.filter((m) => m !== model) // Remove if already selected
      : [...selectedModels, model]; // Add if not selected

    setSelectedModels(newSelectedModels);

    // Scroll to theme section after a short delay to allow state update
    setTimeout(() => {
      const themeSection = document.getElementById("theme-section");
      if (themeSection && newSelectedModels.length > 0) {
        themeSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section
      ref={ref}
      className="mt-5 px-4 sm:px-[5%] md:px-[7%] bg-gradient-to-b from-transparent to-black/40 mb-5 sm:mb-10 relative scroll-mt-16"
      id="personalities-section"
    >
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

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-wrap relative z-10">
          {PERSONALITIES.map((personality: Personality) => (
            <PersonalityCard
              key={personality.model}
              model={personality.model}
              image={personality.image}
              emoji={personality.emoji}
              title={personality.title}
              description={personality.description}
              isSelected={selectedModels.includes(personality.model)}
              onClick={toggleModelSelection}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

PersonalitiesSection.displayName = "PersonalitiesSection";

export default PersonalitiesSection;
