// Define shared type for models across components
export type FaithType = "rabbi" | "pastor" | "buddha" | "imam";

export type ModelName =
  | "RabbiGPT"
  | "BuddhaGPT"
  | "PastorGPT"
  | "ImamGPT"
  | "ComparisonGPT"
  | null;

// Comparison data structure
export interface ComparisonData {
  uniquePoints: Record<string, string[]>;
  similarities: string[];
}

// Conversation structure for sidebar management
export interface Conversation {
  id: string;
  name: string;
  selectedModels: ModelName[];
  hasStarted: boolean;
  /**
   * Full transcript for this conversation. Each message contains a role ("user" or "assistant")
   * and the raw markdown/text content returned by the model or entered by the user.
   * This will be persisted so that conversations can later be shared publicly.
   */
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
}
