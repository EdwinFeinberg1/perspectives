// lib/tools/parshah/getTodayParsha.ts
import { tool } from "ai";
import { getTodayParsha as _getTodayParsha } from "./getCalendar";
import { z } from "zod";

export const getTodayParsha = tool({
  description:
    "Returns today's parsha name & Sefaria ref (Diaspora calendar, America/Los_Angeles).",
  parameters: z.object({}),
  async execute() {
    try {
      console.log("getTodayParsha tool called");
      const result = await _getTodayParsha();
      if (!result) {
        console.error("getTodayParsha: No parsha found for today");
        throw new Error("No parsha found for today");
      }
      console.log(
        `getTodayParsha: Found parsha ${result.parshaName} (${result.parshaRef})`
      );
      return result; // { parshaName: string, parshaRef: string }
    } catch (error) {
      console.error("Error in getTodayParsha tool:", error);
      throw error; // Rethrow to let AI-SDK handle the error
    }
  },
});
