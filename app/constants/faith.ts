import { FaithType } from "../types";

export const FAITH_LABELS: Record<FaithType, { label: string; color: string }> =
  {
    rabbi: {
      label: "Rabbi GPT",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    pastor: {
      label: "Pastor GPT",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    buddha: {
      label: "Buddha GPT",
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
    imam: {
      label: "Imam GPT",
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
  };
