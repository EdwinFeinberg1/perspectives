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
  const cardClassName = `border-2 transition-all duration-300 overflow-hidden cursor-pointer bg-black/60 card
    ${
      isSelected
        ? "border-[#e6d3a3] shadow-[0_0_20px_rgba(230,211,163,0.5)] scale-[1.02] bg-gradient-to-b from-black/70 to-[#e6d3a3]/10 animate-subtle-pulse"
        : "border-[#e6d3a3]/40 hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-[1.02] hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/60 hover:to-black/70"
    }`;

  return (
    <Card className={cardClassName} onClick={() => onClick(model)}>
      <div className="h-[120px] md:h-[160px] relative flex items-center justify-center overflow-hidden pt-2">
        <Image
          src={image}
          alt={title}
          width={140}
          height={140}
          className="object-contain object-center w-auto h-auto max-h-[100px] md:max-h-[140px]"
          priority
        />
        {isSelected && (
          <div className="absolute top-2 right-2 flex items-center px-2 py-1 md:py-2 bg-[#e6d3a3]/20 rounded-full border border-[#e6d3a3]/40">
            <span className="text-[10px] md:text-xs font-medium text-[#e6d3a3]">
              Selected
            </span>
          </div>
        )}
      </div>
      <CardHeader className="text-[#f0e4c3] flex flex-row items-center gap-1 md:gap-2 pt-2 md:pt-3 pb-0 md:pb-1 text-left">
        <span className="text-base md:text-lg">{emoji}</span>
        <span className="text-sm md:text-base font-medium">{title}</span>
      </CardHeader>
      <CardContent className="pt-1 pb-3 md:pb-4 text-left">
        <p className="text-xs md:text-sm text-[#e6d3a3] leading-tight">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

interface PersonalitiesSectionProps {
  selectedModels: ModelName[];
  setSelectedModels: (models: ModelName[]) => void;
}

const PersonalitiesSection = forwardRef<
  HTMLDivElement,
  PersonalitiesSectionProps
>(({ selectedModels, setSelectedModels }, ref) => {
  // Function to handle model selection
  const toggleModelSelection = (model: NonNullable<ModelName>) => {
    // Always set just the selected model, regardless of conversation state
    // If the model is already selected and clicked again, keep it selected
    if (!selectedModels.includes(model)) {
      console.log(`Setting single model selection: ${model}`);
      setSelectedModels([model]); // Set only this model

      // Scroll to theme section after a short delay to allow state update
      setTimeout(() => {
        const themeSection = document.getElementById("theme-section");
        if (themeSection) {
          themeSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  // Apply consistent styling regardless of message state
  const sectionClassName =
    "px-2 sm:px-[5%] md:px-[7%] mb-0 sm:mb-0 relative transition-all duration-300";
  const gridClassName =
    "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 flex-wrap relative z-10 py-3";

  return (
    <section ref={ref} className={sectionClassName} id="personalities-section">
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
        <div className={gridClassName}>
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
