"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeContext";
import {
  ALL_MODELS,
  MODEL_BADGE,
  THEME_SEEDS,
  THEME_CATEGORIES,
  formatPrompts,
} from "./constants";
import { ModelName } from "../../types";
import { useParams } from "next/navigation";
import { useConversations } from "../../context/ConversationsContext";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

interface ThemePrompt {
  model: string;
  seed: string;
  prompts: string;
}

interface ThemePopoverContentProps {
  selectedModels?: ModelName[];
  setSelectedModels?: (models: ModelName[]) => void;
  isMobileSheet?: boolean;
  onShowPromptsChange?: (showPrompts: boolean) => void;
}

const ThemePopoverContent: React.FC<ThemePopoverContentProps> = ({
  setSelectedModels,
  isMobileSheet = false,
  onShowPromptsChange,
}) => {
  const params = useParams();
  const { updateConversation } = useConversations();
  const conversationId =
    typeof params.conversationId === "string" ? params.conversationId : "";

  // Use conversation context to set models
  const updateSelectedModels = (models: ModelName[]) => {
    if (typeof setSelectedModels === "function") {
      setSelectedModels(models);
    } else if (conversationId && updateConversation) {
      updateConversation(conversationId, { selectedModels: models });
    }
  };

  const { currentTheme, selectNewTheme, setCurrentTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  // Notify parent when showPrompts changes
  useEffect(() => {
    if (onShowPromptsChange) {
      onShowPromptsChange(showPrompts);
    }
  }, [showPrompts, onShowPromptsChange]);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      // Initialize Supabase client (browser-side)
      const supabase = createSupabaseClient();

      // Fetch all saved prompts for the current theme (seed) and default params
      const { data, error } = await supabase
        .from("theme_prompts")
        .select("model, prompts")
        .eq("seed", currentTheme)
        .eq("question_count", 3)
        .eq("tone", "reflective, introspective");

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      const newPrompts: Record<string, string> = {};
      (data ?? []).forEach((row: { model: string; prompts: string }) => {
        if (row.model && row.prompts) {
          newPrompts[row.model] = row.prompts;
        }
      });

      setPrompts(newPrompts);
    } catch (error) {
      console.error("Error fetching prompts from Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [currentTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePromptClick = (
    model: Exclude<ModelName, null>,
    prompt: string
  ) => {
    // Automatically select just this model, replacing any currently selected models
    updateSelectedModels([model]);

    // Dispatch a custom event to directly send the prompt to the model
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("sendPromptDirectly", {
          detail: {
            prompt,
            model,
          },
        })
      );
    }, 150);

    // Always close the popover/sheet regardless of mobile or desktop
    window.dispatchEvent(new CustomEvent("closeThemeSheet"));
    // Also dispatch a general close event for any popover
    window.dispatchEvent(new CustomEvent("closeThemePopover"));

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
    // Update the current theme with the selected subTheme
    setCurrentTheme(subTheme);

    setSelectedCategory(null);
    setShowPrompts(true);

    // Prompts will be fetched automatically due to the useEffect that watches currentTheme
  };

  const toggleShowPrompts = () => {
    setShowPrompts(!showPrompts);
  };

  return (
    <div
      className={`space-y-3 sm:space-y-6 ${
        isMobileSheet ? "p-0" : "p-1 sm:p-2"
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xs sm:text-sm md:text-base font-medium text-[#f0e4c3]"></h4>
        <div className="flex gap-2 sm:gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#e6d3a3]/50 bg-black/70 backdrop-blur-sm text-[#e6d3a3] 
                     rounded-lg py-1 px-2 sm:py-2 sm:px-4 transition-all duration-300 text-[10px] sm:text-xs md:text-sm
                     hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10
                     hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-[1.02]
                     active:scale-[0.98]"
            onClick={toggleShowPrompts}
          >
            {showPrompts ? "Browse Themes" : "Show Prompts"}
          </Button>

          {!isMobileSheet && (
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-[#e6d3a3]/50 bg-black/70 backdrop-blur-sm text-[#e6d3a3] 
                       rounded-lg py-1 px-2 sm:py-2 sm:px-4 transition-all duration-300 text-[10px] sm:text-xs md:text-sm
                       hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10
                       hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-[1.02]
                       active:scale-[0.98]"
              onClick={selectNewTheme}
            >
              New Theme
            </Button>
          )}
        </div>
      </div>

      {!showPrompts && (
        <div>
          <p className="text-[#e6d3a3]/80 mb-2 sm:mb-4 text-[11px] sm:text-xs md:text-sm">
            Select a category below to explore themes, or click &ldquo;Show
            Prompts&rdquo; to see what the sages are contemplating about{" "}
            <span className="italic font-medium">{currentTheme}</span>.
          </p>

          {!selectedCategory && (
            <div
              className={`grid ${
                isMobileSheet ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
              } gap-2 sm:gap-3`}
            >
              {THEME_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="py-1.5 px-2 sm:py-2 sm:px-3 bg-black/70 backdrop-blur-sm border border-[#e6d3a3]/40 text-[#e6d3a3] 
                            rounded-lg transition-all duration-300 text-[10px] sm:text-xs md:text-sm capitalize
                            hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10
                            hover:shadow-[0_0_12px_rgba(230,211,163,0.3)] hover:scale-[1.03]
                            active:scale-[0.98]"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {selectedCategory && (
            <>
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="text-[11px] sm:text-xs md:text-sm text-[#e6d3a3]/80">
                  Selected category:{" "}
                  <span className="font-medium capitalize">
                    {selectedCategory}
                  </span>
                </span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 text-[10px] sm:text-xs text-[#e6d3a3]/60 hover:text-[#e6d3a3] underline"
                >
                  Change category
                </button>
              </div>
              <div
                className={`grid ${
                  isMobileSheet ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
                } gap-2 sm:gap-3`}
              >
                {THEME_SEEDS[selectedCategory].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSubThemeClick(sub)}
                    className="py-1.5 px-2 sm:py-2 sm:px-3 bg-black/70 backdrop-blur-sm border border-[#e6d3a3]/40 text-[#e6d3a3] 
                              rounded-lg transition-all duration-300 text-[10px] sm:text-xs md:text-sm
                              hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10
                              hover:shadow-[0_0_12px_rgba(230,211,163,0.3)] hover:scale-[1.03]
                              active:scale-[0.98]"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {showPrompts && (
        <>
          <p className="text-[#e6d3a3]/80 mb-2 sm:mb-4 text-[11px] sm:text-xs md:text-sm">
            Explore how our sages approach the theme of{" "}
            <span className="italic font-medium">{currentTheme}</span>. Click
            any prompt to begin a conversation.
          </p>
          <div
            className={`grid ${
              isMobileSheet ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            } gap-3 sm:gap-5 overflow-y-auto`}
          >
            {ALL_MODELS.map((model) => (
              <Card
                key={model}
                className="bg-black/70 border-[#e6d3a3]/30 backdrop-blur-sm hover:border-[#e6d3a3]/50 transition-all duration-300"
              >
                <CardHeader className="py-2 px-3 sm:py-3 sm:px-4 border-b border-[#e6d3a3]/20">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">
                      {MODEL_BADGE[model]}
                    </span>
                    <span className="text-[#f0e4c3] font-medium text-xs sm:text-sm">
                      {model}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-3 sm:py-3 sm:px-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-3 sm:py-6 space-y-2">
                      <div className="inline-block h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-solid border-[#e6d3a3] border-r-transparent"></div>
                      <p className="text-[#e6d3a3]/60 text-[10px] sm:text-xs">
                        Loading prompts...
                      </p>
                    </div>
                  ) : prompts[model] ? (
                    <ul className="space-y-2 sm:space-y-3 text-[10px] sm:text-xs md:text-sm text-[#e6d3a3] list-none">
                      {formatPrompts(prompts[model]).map((prompt, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <button
                            onClick={() => handlePromptClick(model, prompt)}
                            className="text-left w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md hover:bg-[#e6d3a3]/10 transition-colors"
                          >
                            {prompt}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#e6d3a3]/60 text-[10px] sm:text-xs italic text-center py-3 sm:py-6">
                      No prompts available for this theme
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemePopoverContent;
