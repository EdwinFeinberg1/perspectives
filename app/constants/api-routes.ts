import { ModelName } from "../types";

// Map of model names to their respective API endpoints
export const API_ROUTES: Record<string, string> = {
  "RabbiGPT": "/api/chat/judaism",
  "PastorGPT": "/api/chat/christianity",
  "BuddhaGPT": "/api/chat/buddha", 
  "ImamGPT": "/api/chat/islam",
  "ComparisonGPT": "/api/chat/compare",
  "default": "/api/chat/christianity",
  "empty": "/api/chat/empty"
};

/**
 * Returns the appropriate API route for a given model
 * @param model The model to get the API route for
 * @returns The API route path
 */
export const getApiRoute = (model: ModelName): string => {
  if (!model) return API_ROUTES.empty;
  return API_ROUTES[model] || API_ROUTES.default;
}; 