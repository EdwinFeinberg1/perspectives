"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { ModelName } from "@/app/types";

interface OnboardingFlowProps {
  onComplete: (intent: UserIntent) => void;
  onSkip: () => void;
}

export interface UserIntent {
  primaryIntent: "learning" | "comfort" | "guidance" | "exploration";
  spiritualTradition?:
    | "judaism"
    | "christianity"
    | "buddhism"
    | "islam"
    | "none";
  specificNeed?: string;
  tags: string[];
  suggestedModel: ModelName;
  initialPrompt: string;
}

const INTENTS = [
  {
    id: "learning",
    label: "I want to learn about spirituality",
    icon: "📚",
    description: "Explore religious teachings and wisdom",
  },
  {
    id: "comfort",
    label: "I'm seeking comfort or support",
    icon: "🤗",
    description: "Find solace in spiritual guidance",
  },
  {
    id: "guidance",
    label: "I need help with a decision",
    icon: "🤔",
    description: "Get perspectives on moral or life choices",
  },
  {
    id: "exploration",
    label: "I'm just curious",
    icon: "✨",
    description: "Open to discovering what resonates",
  },
];

const TRADITIONS = [
  {
    id: "judaism",
    label: "Judaism",
    icon: "✡️",
    model: "RabbiGPT" as ModelName,
  },
  {
    id: "christianity",
    label: "Christianity",
    icon: "✝️",
    model: "PastorGPT" as ModelName,
  },
  {
    id: "buddhism",
    label: "Buddhism",
    icon: "☸️",
    model: "BuddhaGPT" as ModelName,
  },
  {
    id: "islam",
    label: "Islam",
    icon: "☪️",
    model: "ImamGPT" as ModelName,
  },
  {
    id: "none",
    label: "No preference",
    icon: "🌟",
    model: null,
  },
];

const SPIRITUAL_TOPICS = {
  judaism: [
    {
      name: "Shabbat",
      description:
        "The weekly day of rest and spiritual renewal that begins Friday at sunset and ends Saturday night.",
    },
    {
      name: "Teshuvah",
      description:
        "The practice of repentance and return to one's higher self and to God, especially emphasized during the High Holy Days.",
    },
    {
      name: "Kabbalah",
      description:
        "Jewish mystical tradition exploring the nature of God, creation, and the soul through symbols like the Sefirot.",
    },
    {
      name: "Mussar",
      description:
        "A discipline of ethical self-improvement and character refinement rooted in classical Jewish texts.",
    },
  ],
  buddhism: [
    {
      name: "Four Noble Truths",
      description:
        "Core teaching that diagnoses suffering (dukkha) and prescribes a path to its cessation.",
    },
    {
      name: "Noble Eightfold Path",
      description:
        "Eight practical guidelines—ethical, mental, and wisdom training—leading to liberation.",
    },
    {
      name: "Mindfulness (Sati)",
      description:
        "Present-moment, non-judgmental awareness cultivated through meditation and daily life.",
    },
    {
      name: "Karma",
      description:
        "The law of intentional action and its consequences shaping present and future experiences.",
    },
    {
      name: "Rebirth",
      description:
        "The continuing cycle of birth, death, and renewal conditioned by karma until enlightenment is achieved.",
    },
    {
      name: "Loving-Kindness (Metta)",
      description:
        "Meditative practice of generating boundless friendliness toward oneself and all beings.",
    },
    {
      name: "Compassion (Karuna)",
      description:
        "The heartfelt wish to relieve the suffering of others, a cornerstone of Mahayana practice.",
    },
    {
      name: "Emptiness (Śūnyatā)",
      description:
        "Insight into the interdependent, non-self nature of all phenomena, dissolving attachment.",
    },
  ],
  islam: [
    {
      name: "Tawḥīd",
      description:
        "The absolute oneness and uniqueness of God, the foundation of Islamic belief.",
    },
    {
      name: "Five Pillars",
      description:
        "Core acts of worship: testimony of faith, prayer, almsgiving, fasting in Ramadan, and pilgrimage to Mecca.",
    },
    {
      name: "Ṣūfism (Taṣawwuf)",
      description:
        "Islamic mysticism focused on inner purification and direct experiential knowledge of God.",
    },
    {
      name: "Iḥsān",
      description:
        "Excellence in faith—worshiping God as though one sees Him, embodying virtue in every act.",
    },
  ],
  christianity: [
    {
      name: "Trinity",
      description:
        "Belief in one God experienced as Father, Son, and Holy Spirit—three persons, one essence.",
    },
    {
      name: "Grace",
      description:
        "Unmerited divine favor that heals human brokenness and empowers spiritual growth.",
    },
    {
      name: "Salvation",
      description:
        "Deliverance from sin and its consequences through the life, death, and resurrection of Jesus Christ.",
    },
    {
      name: "Beatitudes",
      description:
        "Teachings of Jesus in the Sermon on the Mount outlining the attitudes of kingdom living.",
    },
  ],
};

const SPECIFIC_NEEDS = {
  learning: [
    "What is the meaning of life?",
    "How do different religions view the afterlife?",
    "What are the core teachings?",
    "How can I start a spiritual practice?",
  ],
  comfort: [
    "I'm feeling lost and alone",
    "I'm grieving a loss",
    "I'm struggling with anxiety",
    "I need hope and encouragement",
  ],
  guidance: [
    "I'm facing a moral dilemma",
    "I need to make a big life decision",
    "I'm struggling with forgiveness",
    "I want to be a better person",
  ],
  exploration: [
    "Show me something inspiring",
    "What wisdom can you share?",
    "Help me find my path",
    "Surprise me with insight",
  ],
};

const COMFORT_STORIES = {
  judaism: [
    {
      title: "Rabbi Akiva Laughs at the Temple Ruins",
      description:
        "After seeing foxes roam the desolate Holy of Holies, three sages weep but Rabbi Akiva laughs—and then explains how the prophecy of future restoration turns devastation into hope.",
    },
    {
      title: '"Comfort, Comfort My People" (Isaiah 40)',
      description:
        "Midrash on Isaiah's call 'Nachamu Ami' shows God urging double consolation after national tragedy, teaching that words and deeds of care can rekindle collective spirit.",
    },
    {
      title: "Psalm 23 — The Lord Is My Shepherd",
      description:
        "King David's beloved psalm paints God as a shepherd who guides through 'the valley of the shadow of death,' offering enduring reassurance in times of fear.",
    },
  ],
  buddhism: [
    {
      title: "Kisa Gotami and the Mustard Seed",
      description:
        "A grieving mother learns from the Buddha that no household is untouched by death, transforming personal loss into universal compassion.",
    },
    {
      title: "The Second Arrow",
      description:
        "The Buddha compares unavoidable pain with the optional suffering we create by mentally striking ourselves with a 'second arrow,' pointing to mindful acceptance as relief.",
    },
    {
      title: "The Parable of the Raft",
      description:
        "The Buddha likens the Dharma to a raft: essential for crossing turbulent waters but meant to be laid aside once safe on the farther shore.",
    },
  ],
  islam: [
    {
      title: "Surah Yusuf — A Chapter of Consolation",
      description:
        "Joseph's saga of betrayal, patience, and reunion reassures believers that divine wisdom unfolds through hardship.",
    },
    {
      title: "Prophet Ayyub (Job) and Beautiful Patience",
      description:
        "Stripped of health and wealth, Ayyub remains grateful; his eventual healing embodies ṣabr (patience) and Allah's promise that endurance is met with relief.",
    },
    {
      title: 'Surah Ad-Duḥa — "Your Lord Has Not Forsaken You"',
      description:
        "Revealed after a pause in revelation, this short surah lifts the Prophet's spirits and offers timeless comfort to anyone who feels abandoned or anxious.",
    },
  ],
  christianity: [
    {
      title: "Parable of the Lost Sheep",
      description:
        "Jesus depicts a shepherd leaving ninety-nine sheep to rescue one stray, illustrating God's relentless care for every person who feels lost.",
    },
    {
      title: "Parable of the Prodigal Son",
      description:
        "A wayward son returns home expecting rejection but meets a father's embrace, showing unconditional forgiveness and restoration after failure.",
    },
    {
      title: "Jesus Calms the Storm",
      description:
        "Amid a violent squall on the Sea of Galilee, Jesus speaks 'Peace, be still,' turning panic into awe and modeling trust when life's waves threaten.",
    },
  ],
};

export default function OnboardingFlow({
  onComplete,
  onSkip,
}: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<string>("");
  const [selectedTradition, setSelectedTradition] = useState<string>("");
  const [selectedNeed, setSelectedNeed] = useState<string>("");

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getRandomTopicFromEachTradition = () => {
    const traditions = [
      "judaism",
      "buddhism",
      "islam",
      "christianity",
    ] as const;
    return traditions.map((tradition) => {
      let topics;
      if (selectedIntent === "learning") {
        topics = SPIRITUAL_TOPICS[tradition];
      } else if (selectedIntent === "comfort") {
        topics = COMFORT_STORIES[tradition];
      } else {
        topics = SPIRITUAL_TOPICS[tradition]; // fallback
      }
      const randomIndex = Math.floor(Math.random() * topics.length);
      return {
        ...topics[randomIndex],
        tradition: tradition.charAt(0).toUpperCase() + tradition.slice(1),
      };
    });
  };

  const getTopicsToShow = () => {
    if (selectedIntent === "learning") {
      if (selectedTradition === "none") {
        return getRandomTopicFromEachTradition();
      } else if (
        selectedTradition &&
        SPIRITUAL_TOPICS[selectedTradition as keyof typeof SPIRITUAL_TOPICS]
      ) {
        return SPIRITUAL_TOPICS[
          selectedTradition as keyof typeof SPIRITUAL_TOPICS
        ];
      }
    } else if (selectedIntent === "comfort") {
      if (selectedTradition === "none") {
        return getRandomTopicFromEachTradition();
      } else if (
        selectedTradition &&
        COMFORT_STORIES[selectedTradition as keyof typeof COMFORT_STORIES]
      ) {
        return COMFORT_STORIES[
          selectedTradition as keyof typeof COMFORT_STORIES
        ];
      }
    }
    return SPECIFIC_NEEDS[selectedIntent as keyof typeof SPECIFIC_NEEDS] || [];
  };

  const completeOnboarding = () => {
    const tags: string[] = [];
    let suggestedModel: ModelName = "PastorGPT"; // Default
    let initialPrompt = "";

    // Add intent tags
    if (selectedIntent === "comfort") tags.push("#sad", "#comfort");
    if (selectedIntent === "learning") tags.push("#learning", "#curious");
    if (selectedIntent === "guidance")
      tags.push("#moral-conflict", "#guidance");
    if (selectedIntent === "exploration") tags.push("#exploring", "#open");

    // Determine model based on tradition
    const tradition = TRADITIONS.find((t) => t.id === selectedTradition);
    if (tradition && tradition.model) {
      suggestedModel = tradition.model;
      tags.push(`#${selectedTradition}`);
    } else if (selectedIntent === "comfort") {
      // Default to PastorGPT for comfort if no tradition selected
      suggestedModel = "PastorGPT";
    }

    // Create initial prompt
    if (selectedNeed) {
      if (
        (selectedIntent === "learning" || selectedIntent === "comfort") &&
        (selectedNeed.includes("tradition:") ||
          selectedNeed.includes("name:") ||
          selectedNeed.includes("title:"))
      ) {
        // Handle spiritual topic or comfort story selection
        const topicName =
          selectedNeed.split("name:")[1]?.split(",")[0]?.trim() ||
          selectedNeed.split("title:")[1]?.split(",")[0]?.trim();
        if (topicName) {
          if (selectedIntent === "learning") {
            initialPrompt = `I'd like to learn about ${topicName}. Can you explain this concept and its significance?`;
          } else if (selectedIntent === "comfort") {
            initialPrompt = `I'm going through a difficult time and would find comfort in hearing about ${topicName}. Can you share this story and its meaning?`;
          }
        } else {
          initialPrompt = selectedNeed;
        }
      } else {
        initialPrompt = selectedNeed;
      }
    } else {
      // Generate a default prompt based on intent
      const intentMap = {
        learning:
          "I'm interested in learning about spiritual wisdom. Where should I start?",
        comfort:
          "I'm going through a difficult time and could use some spiritual comfort.",
        guidance:
          "I'm facing a decision and would appreciate some spiritual guidance.",
        exploration:
          "I'm curious about spirituality. What wisdom can you share with me?",
      };
      initialPrompt =
        intentMap[selectedIntent as keyof typeof intentMap] ||
        "Hello, I'd like to explore spirituality.";
    }

    const userIntent: UserIntent = {
      primaryIntent: selectedIntent as UserIntent["primaryIntent"],
      spiritualTradition: selectedTradition as UserIntent["spiritualTradition"],
      specificNeed: selectedNeed,
      tags,
      suggestedModel,
      initialPrompt,
    };

    onComplete(userIntent);
  };

  const canProceed = () => {
    if (step === 1) return selectedIntent;
    if (step === 2) return selectedTradition;
    if (step === 3) return selectedNeed;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6">
      <Card className="w-full max-w-2xl bg-background/90 border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-foreground mr-2" />
              <h2 className="text-xl sm:text-2xl font-light text-foreground">
                Welcome to Sephira
              </h2>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Let&apos;s help you find the right spiritual guidance
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 sm:h-2 w-12 sm:w-16 rounded-full transition-colors ${
                    i <= step ? "bg-foreground" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[250px] sm:min-h-[300px]"
            >
              {/* Step 1: Intent */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                    What brings you here today?
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {INTENTS.map((intent) => (
                      <button
                        key={intent.id}
                        onClick={() => setSelectedIntent(intent.id)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                          selectedIntent === intent.id
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/20 active:border-foreground/30"
                        }`}
                      >
                        <div className="flex items-start">
                          <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">
                            {intent.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-foreground font-medium text-sm sm:text-base">
                              {intent.label}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm mt-1">
                              {intent.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Tradition */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                    Are you drawn to any particular spiritual tradition?
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {TRADITIONS.map((tradition) => (
                      <button
                        key={tradition.id}
                        onClick={() => setSelectedTradition(tradition.id)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                          selectedTradition === tradition.id
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/20 active:border-foreground/30"
                        }`}
                      >
                        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                          {tradition.icon}
                        </div>
                        <div className="text-foreground text-xs sm:text-sm">
                          {tradition.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Learning Topics or Specific needs */}
              {step === 3 && (
                <div>
                  {selectedIntent === "learning" ? (
                    <div>
                      <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                        {selectedTradition === "none"
                          ? "Here are some fascinating topics from different traditions:"
                          : "Which topic would you like to explore?"}
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {getTopicsToShow().map((topic, index) => (
                          <button
                            key={`${topic.name}-${index}`}
                            onClick={() =>
                              setSelectedNeed(
                                `tradition:${selectedTradition}, name:${topic.name}, description:${topic.description}`
                              )
                            }
                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                              selectedNeed.includes(topic.name)
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/20 active:border-foreground/30"
                            }`}
                          >
                            <div className="text-foreground font-medium text-sm sm:text-base mb-1">
                              {topic.name}
                              {"tradition" in topic && (
                                <span className="text-muted-foreground text-xs ml-2">
                                  ({topic.tradition})
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm">
                              {topic.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : selectedIntent === "comfort" ? (
                    <div>
                      <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                        {selectedTradition === "none"
                          ? "Here are some comforting stories from different traditions:"
                          : "Which story speaks to your heart?"}
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {getTopicsToShow().map((story, index) => (
                          <button
                            key={`${story.title || story.name}-${index}`}
                            onClick={() =>
                              setSelectedNeed(
                                `tradition:${selectedTradition}, title:${story.title || story.name}, description:${story.description}`
                              )
                            }
                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                              selectedNeed.includes(story.title || story.name)
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/20 active:border-foreground/30"
                            }`}
                          >
                            <div className="text-foreground font-medium text-sm sm:text-base mb-1">
                              {story.title || story.name}
                              {"tradition" in story && (
                                <span className="text-muted-foreground text-xs ml-2">
                                  ({story.tradition})
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm">
                              {story.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                        Which of these resonates with you most?
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {SPECIFIC_NEEDS[
                          selectedIntent as keyof typeof SPECIFIC_NEEDS
                        ]?.map((need) => (
                          <button
                            key={need}
                            onClick={() => setSelectedNeed(need)}
                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                              selectedNeed === need
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/20 active:border-foreground/30"
                            }`}
                          >
                            <div className="text-foreground text-sm sm:text-base">
                              {need}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-6 sm:mt-8">
            <div>
              {step > 1 ? (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-foreground hover:text-foreground/80 text-sm sm:text-base px-3 sm:px-4"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Back
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="text-muted-foreground hover:text-foreground text-sm sm:text-base px-3 sm:px-4"
                >
                  Skip and Explore
                </Button>
              )}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-foreground text-background hover:bg-foreground/80 disabled:opacity-50 text-sm sm:text-base px-4 sm:px-6"
            >
              {step === 3 ? "Start Journey" : "Next"}
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
