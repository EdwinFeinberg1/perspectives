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
  condensed: boolean;
}

const PersonalityCard: React.FC<PersonalityCardProps> = ({
  model,
  image,
  emoji,
  title,
  description,
  isSelected,
  onClick,
  condensed,
}) => {
  const cardClassName = `border-2 transition-all duration-300 overflow-hidden cursor-pointer bg-black/60 
    ${
      isSelected
        ? "border-[#e6d3a3] shadow-[0_0_20px_rgba(230,211,163,0.5)] scale-[1.02] bg-gradient-to-b from-black/70 to-[#e6d3a3]/10 animate-subtle-pulse"
        : "border-[#e6d3a3]/40 hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-[1.02] hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/60 hover:to-black/70"
    }`;

  if (condensed) {
    return (
      <Card
        className={`${cardClassName} flex flex-row items-center ${
          isSelected
            ? "ring-2 ring-[#e6d3a3]"
            : "hover:ring-1 hover:ring-[#e6d3a3]/60"
        }`}
        onClick={() => onClick(model)}
      >
        <div className="flex-shrink-0 w-[60px] h-[60px] relative flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            width={50}
            height={50}
            className="object-contain object-center w-auto h-auto max-h-[50px]"
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <CardHeader className="text-[#f0e4c3] flex flex-row items-center gap-1 py-2 px-2 text-left">
            <span className="text-base">{emoji}</span>
            <span className="text-sm font-medium truncate">{title}</span>
            {isSelected && (
              <span className="ml-auto text-xs opacity-80 bg-[#e6d3a3]/20 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </CardHeader>
        </div>
      </Card>
    );
  }

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
      <CardHeader className="text-[#f0e4c3] flex flex-row items-center gap-2 pt-3 pb-1 text-left">
        <span className="text-lg">{emoji}</span>
        <span className="text-base font-medium">{title}</span>
        {isSelected && (
          <span className="ml-auto text-xs opacity-80">Selected</span>
        )}
      </CardHeader>
      <CardContent className="pt-1 pb-4 text-left">
        <p className="text-sm text-[#e6d3a3] leading-tight">{description}</p>
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
>(({ selectedModels, setSelectedModels, messagesSent }, ref) => {
  // Function to handle model selection
  const toggleModelSelection = (model: NonNullable<ModelName>) => {
    // If a conversation has started, just switch to the selected model
    if (messagesSent) {
      setSelectedModels([model]); // Set only this model
    } else {
      // Pre-conversation behavior: toggle the model selection
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
    }
  };

  // Apply different styling based on whether messages have been sent
  const sectionClassName = messagesSent
    ? "px-4 sm:px-[5%] md:px-[7%] mb-2 sm:mb-4 relative transition-all duration-300"
    : "px-4 sm:px-[5%] md:px-[7%] mb-5 sm:mb-10 relative transition-all duration-300";

  const gridClassName = messagesSent
    ? "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-wrap relative z-10 py-6 sm:py-8"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-wrap relative z-10 py-20";

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
        {messagesSent && (
          <div className="text-center text-[#e6d3a3]/70 text-sm mb-2">
            Click a perspective to switch the active model
          </div>
        )}
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
              condensed={messagesSent}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

PersonalitiesSection.displayName = "PersonalitiesSection";

export default PersonalitiesSection;
