import { ModelName } from "../types";

// Models available for themes
export const ALL_MODELS: ModelName[] = [
  "RabbiGPT",
  "PastorGPT",
  "BuddhaGPT",
  "ImamGPT",
];

// Emoji badges for each model
export const MODEL_BADGE: Record<Exclude<ModelName, null>, string> = {
  RabbiGPT: "✡️",
  PastorGPT: "✝️",
  BuddhaGPT: "☸️",
  ImamGPT: "☪️",
  ComparisonGPT: "🔄",
};

// Theme categories and seeds
export type ThemeSeeds = Record<string, string[]>;

export const THEME_SEEDS: ThemeSeeds = {
  love: [
    "self-love",
    "soul mates",
    "healing heartbreak",
    "lust vs. intimacy",
    "unconditional love",
    "jealousy in relationships",
  ],
  philosophy: [
    "meaning of life",
    "free will vs. determinism",
    "mind–body problem",
    "nature of consciousness",
    "problem of evil",
    "ultimate reality",
  ],
  identity: [
    "authenticity",
    "impostor syndrome",
    "cultural roots",
    "self-worth",
    "finding my purpose",
  ],
  fear: [
    "fear of failure",
    "fear of death",
    "fear of rejection",
    "existential dread",
  ],
  justice: [
    "wealth inequality",
    "war and peace",
    "environmental stewardship",
    "forgiveness vs. vengeance",
  ],
  transcendence: [
    "mystical experiences",
    "silence of God",
    "afterlife visions",
    "mindful presence",
  ],
  change: [
    "starting a new chapter",
    "letting go",
    "resistance to change",
    "rebirth symbolism",
  ],
  community: [
    "servant leadership",
    "generosity",
    "reconciling conflict",
    "hospitality to strangers",
  ],
};

// Precompute theme categories for easy access
export const THEME_CATEGORIES = Object.keys(THEME_SEEDS);

// Helper functions
export const getRandomTheme = (): string => {
  const category =
    THEME_CATEGORIES[Math.floor(Math.random() * THEME_CATEGORIES.length)];
  const subcategories = THEME_SEEDS[category];
  return subcategories[Math.floor(Math.random() * subcategories.length)];
};

// Format prompts from API response (they come as bullet points)
export const formatPrompts = (promptText: string): string[] => {
  if (!promptText) return [];

  return promptText
    .split("\n")
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.trim().replace(/^-\s*/, ""))
    .filter(Boolean);
};
