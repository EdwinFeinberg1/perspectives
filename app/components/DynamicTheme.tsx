"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ModelName } from "../types";
import {
  ALL_MODELS,
  MODEL_BADGE,
  THEME_SEEDS,
  THEME_CATEGORIES,
  formatPrompts,
} from "../features/theme/constants";
import { useTheme } from "../features/theme/ThemeContext";

interface ThemePrompt {
  model: string;
  seed: string;
  prompts: string;
}

interface DynamicThemeProps {
  selectedModels: ModelName[];
  setSelectedModels: (models: ModelName[]) => void;
}

const DynamicTheme: React.FC<DynamicThemeProps> = ({ setSelectedModels }) => {
  const { currentTheme, selectNewTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      // Always fetch prompts for every model so we can show regardless of selection
      const results = await Promise.all(
        ALL_MODELS.map(async (model) => {
          const response = await fetch("/api/chat/theme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model,
              seed: currentTheme,
              questionCount: 3,
              tone: "reflective, introspective",
            }),
          });
          return await response.json();
        })
      );

      // Organize prompts by model
      const newPrompts: Record<string, string> = {};
      results.forEach((result: ThemePrompt) => {
        if (result?.model && result?.prompts)
          newPrompts[result.model] = result.prompts;
      });

      setPrompts(newPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch prompts when theme changes or on first mount
  useEffect(() => {
    fetchPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme]);

  const handlePromptClick = (model: NonNullable<ModelName>, prompt: string) => {
    // Set the selected model to only this model
    setSelectedModels([model]);
    console.log(`Selected model from theme prompt: ${model}`);

    // Dispatch a global event so chat input can prefill. Delay slightly to
    // ensure the chat input footer has mounted if no model was previously selected.
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("prefillPrompt", { detail: { prompt, model } })
      );
    }, 150);

    // Optionally, scroll to chat section
    const chatbotSection = document.getElementById("chatbot-section");
    if (chatbotSection) {
      chatbotSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle category click
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
  };

  // Handle sub-theme click
  const handleSubThemeClick = (subTheme: string) => {
    // This no longer sets the theme directly since we're using context
    console.log(`Selected sub-theme: ${subTheme}`);
    setSelectedCategory(undefined);
    setShowPrompts(true);

    // Scroll to the newly loaded cards after a short delay
    setTimeout(() => {
      const themeSection = document.getElementById("theme-section");
      if (themeSection) {
        themeSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="mb-10 mt-4 relative px-4 sm:px-6">
      <div className="text-center mb-3">
        <motion.h3
          className="text-xl font-medium text-[#e6d3a3] mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        ></motion.h3>

        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#e6d3a3]/50 bg-black/70 backdrop-blur-sm text-[#e6d3a3] 
                      rounded-lg py-2 px-4 transition-all duration-300 
                      hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10 
                      hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-[1.02]
                      active:scale-[0.98] animate-subtle-glow"
            onClick={() => setShowPrompts(!showPrompts)}
          >
            {showPrompts ? "Hide Prompts" : "Show Prompts"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#e6d3a3]/50 bg-black/70 backdrop-blur-sm text-[#e6d3a3] 
                      rounded-lg py-2 px-4 transition-all duration-300 
                      hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10 
                      hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-[1.02]
                      active:scale-[0.98] animate-subtle-glow"
            onClick={selectNewTheme}
          >
            New Theme
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {!showPrompts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Step 1: Category selection */}
            {!selectedCategory && (
              <div className="pb-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 min-w-max sm:min-w-0">
                  {THEME_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="py-2 px-3 bg-black/70 backdrop-blur-sm border-2 border-[#e6d3a3]/40 text-[#e6d3a3] 
                                rounded-lg transition-all duration-300 whitespace-nowrap
                                hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10
                                hover:shadow-[0_0_12px_rgba(230,211,163,0.3)] hover:scale-[1.03]
                                active:scale-[0.98]"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Sub-theme selection */}
            {selectedCategory && (
              <div className="pb-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 min-w-max sm:min-w-0 mt-3">
                  {THEME_SEEDS[selectedCategory]?.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleSubThemeClick(sub)}
                      className="py-2 px-3 bg-black/70 backdrop-blur-sm border-2 border-[#e6d3a3]/40 text-[#e6d3a3] 
                                rounded-lg transition-all duration-300 whitespace-nowrap
                                hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10
                                hover:shadow-[0_0_12px_rgba(230,211,163,0.3)] hover:scale-[1.03]
                                active:scale-[0.98]"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* After a theme is selected and prompts fetched, display per-model cards */}
      {showPrompts && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {ALL_MODELS.map((model) => {
            // Ensure model is not null before using it as an index
            const safeModel = model as NonNullable<ModelName>;
            return (
              <motion.div
                key={safeModel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black/70 border-[#e6d3a3]/30 backdrop-blur-sm h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{MODEL_BADGE[safeModel]}</span>
                      <span className="text-[#f0e4c3] font-medium">
                        {safeModel}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#e6d3a3] border-r-transparent"></div>
                      </div>
                    ) : prompts[safeModel] ? (
                      <ul className="space-y-2 text-sm text-[#e6d3a3]/90">
                        {formatPrompts(prompts[safeModel]).map(
                          (prompt, idx) => (
                            <motion.li
                              key={idx}
                              className="leading-tight"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <button
                                onClick={() =>
                                  handlePromptClick(safeModel, prompt)
                                }
                                className="text-left w-full hover:underline"
                              >
                                {prompt}
                              </button>
                            </motion.li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-[#e6d3a3]/60 text-xs italic text-center">
                        No prompts available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default DynamicTheme;
