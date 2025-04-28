// Define shared type for models across components
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
