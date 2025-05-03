"use client";

import React, { useState } from "react";
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

interface ThemePrompt {
  model: string;
  seed: string;
  prompts: string;
}

interface ThemePopoverContentProps {
  selectedModels?: ModelName[];
  setSelectedModels?: (models: ModelName[]) => void;
  isMobileSheet?: boolean;
}

const ThemePopoverContent: React.FC<ThemePopoverContentProps> = ({
  setSelectedModels,
  isMobileSheet = false,
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

  const { currentTheme, selectNewTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  React.useEffect(() => {
    fetchPrompts();
  }, [currentTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePromptClick = (
    model: Exclude<ModelName, null>,
    prompt: string
  ) => {
    // Automatically select just this model, replacing any currently selected models
    updateSelectedModels([model]);
    console.log(`Selected model from theme prompt: ${model}`);

    // Dispatch a global event so chat input can prefill
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("prefillPrompt", {
          detail: {
            prompt,
            model,
          },
        })
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
  const handleSubThemeClick = () => {
    setSelectedCategory(null);
    setShowPrompts(true);
  };

  return (
    <div className={`space-y-6 ${isMobileSheet ? "p-0" : "p-2"}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-base font-medium text-[#f0e4c3]">
          Explore Themes for Meaningful Conversations
        </h4>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#e6d3a3]/50 bg-black/70 backdrop-blur-sm text-[#e6d3a3] 
                     rounded-lg py-2 px-4 transition-all duration-300 text-sm
                     hover:border-[#e6d3a3] hover:bg-gradient-to-b hover:from-black/80 hover:to-[#e6d3a3]/10
                     hover:shadow-[0_0_15px_rgba(230,211,163,0.4)] hover:scale-[1.02]
                     active:scale-[0.98]"
            onClick={() => setShowPrompts(!showPrompts)}
          >
            {showPrompts ? "Browse Themes" : "Show Prompts"}
          </Button>

          {!isMobileSheet && (
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-[#e6d3a3]/50 bg-black/70 backdrop-blur-sm text-[#e6d3a3] 
                       rounded-lg py-2 px-4 transition-all duration-300 text-sm
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
          <p className="text-[#e6d3a3]/80 mb-4 text-sm">
            Select a category below to explore themes, or click &ldquo;Show
            Prompts&rdquo; to see what the sages are contemplating about{" "}
            <span className="italic font-medium">{currentTheme}</span>.
          </p>

          {!selectedCategory && (
            <div
              className={`grid ${
                isMobileSheet ? "grid-cols-2" : "grid-cols-4"
              } gap-3`}
            >
              {THEME_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="py-2 px-3 bg-black/70 backdrop-blur-sm border-2 border-[#e6d3a3]/40 text-[#e6d3a3] 
                            rounded-lg transition-all duration-300 text-sm capitalize
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
              <div className="flex items-center mb-3">
                <span className="text-sm text-[#e6d3a3]/80">
                  Selected category:{" "}
                  <span className="font-medium capitalize">
                    {selectedCategory}
                  </span>
                </span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 text-xs text-[#e6d3a3]/60 hover:text-[#e6d3a3] underline"
                >
                  Change category
                </button>
              </div>
              <div
                className={`grid ${
                  isMobileSheet ? "grid-cols-2" : "grid-cols-4"
                } gap-3`}
              >
                {THEME_SEEDS[selectedCategory].map((sub) => (
                  <button
                    key={sub}
                    onClick={handleSubThemeClick}
                    className="py-2 px-3 bg-black/70 backdrop-blur-sm border-2 border-[#e6d3a3]/40 text-[#e6d3a3] 
                              rounded-lg transition-all duration-300 text-sm
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
          <p className="text-[#e6d3a3]/80 mb-4 text-sm">
            Explore how our sages approach the theme of{" "}
            <span className="italic font-medium">{currentTheme}</span>. Click
            any prompt to begin a conversation.
          </p>
          <div
            className={`grid ${
              isMobileSheet ? "grid-cols-1" : "grid-cols-2"
            } gap-5 max-h-[400px] overflow-y-auto pr-2 pb-2`}
          >
            {ALL_MODELS.map((model) => (
              <Card
                key={model}
                className="bg-black/70 border-[#e6d3a3]/30 backdrop-blur-sm hover:border-[#e6d3a3]/50 transition-all duration-300"
              >
                <CardHeader className="py-3 px-4 border-b border-[#e6d3a3]/20">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{MODEL_BADGE[model]}</span>
                    <span className="text-[#f0e4c3] font-medium">{model}</span>
                  </div>
                </CardHeader>
                <CardContent className="py-3 px-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-2">
                      <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-[#e6d3a3] border-r-transparent"></div>
                      <p className="text-[#e6d3a3]/60 text-sm">
                        Loading prompts...
                      </p>
                    </div>
                  ) : prompts[model] ? (
                    <ul className="space-y-3 text-sm text-[#e6d3a3] list-none">
                      {formatPrompts(prompts[model]).map((prompt, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <button
                            onClick={() => handlePromptClick(model, prompt)}
                            className="text-left w-full px-3 py-2 rounded-md hover:bg-[#e6d3a3]/10 transition-colors"
                          >
                            {prompt}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#e6d3a3]/60 text-sm italic text-center py-6">
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
