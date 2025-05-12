// lib/tools/parshah/summarizeParshah.ts
import { tool } from "ai";
import { z } from "zod";
import OpenAI from "openai";
import { getParshaText } from "./getParshaText";
import { getTodayParsha as _getTodayParsha } from "./getCalendar";

// Use environment variable for API key
let openai: OpenAI;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not defined in environment");
  }
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("OpenAI client initialized successfully");
} catch (error) {
  console.error("Error initializing OpenAI client:", error);
  // Create a dummy client - we'll handle the error when trying to use it
  openai = new OpenAI({ apiKey: "dummy-key" });
}

async function summarizeParsha(parshaName: string, parshaRef: string) {
  try {
    console.log(`Summarizing parsha: ${parshaName} (${parshaRef})`);

    // 1) pull the full text
    const { english } = await getParshaText(parshaRef);
    console.log(`Got text, length: ${english.length} characters`);

    // 2) build a Sefaria web URL for that ref
    //    e.g. "Leviticus 21:1-24:23" → "Leviticus.21.1-24.23"
    const sefariaPath = parshaRef.replace(/ /g, ".").replace(":", ".");
    const source = `https://www.sefaria.org/${encodeURIComponent(
      sefariaPath
    )}?lang=he&lang2=en`;

    // 3) construct messages
    const messages = [
      {
        role: "system" as const,
        content: `
You are RabbiGPT, speaking in a warm, story-driven Chassidic voice.
Summarize the Torah portion ${parshaName} (${parshaRef}) in about 200 words.
Weave in one Hebrew term (with its English meaning in parentheses) and close with a brief blessing.
        `.trim(),
      },
      {
        role: "user" as const,
        content: `
--- TORAH TEXT (English) BEGIN ---
${english}
--- TORAH TEXT END ---
        `.trim(),
      },
    ];

    // 3) call the API
    console.log("Calling OpenAI for summary generation");
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 400,
      temperature: 0.7,
    });

    if (!resp.choices || resp.choices.length === 0) {
      throw new Error("OpenAI returned empty choices array");
    }

    console.log("Summary generated successfully");

    return {
      summary: resp.choices[0].message?.content?.trim() ?? "",
      source,
    };
  } catch (error) {
    console.error("Error in summarizeParsha:", error);
    // Return a fallback summary instead of failing completely
    return {
      summary: `I apologize, but I encountered an issue generating a summary for ${parshaName}. Please try again later or visit Sefaria directly to read this week's Torah portion.`,
      source: `https://www.sefaria.org/`,
    };
  }
}

// Export as a tool
export const summarizeParshah = tool({
  description: "Summarizes a Torah portion (parsha) using AI",
  parameters: z.object({
    parshaName: z
      .string()
      .optional()
      .describe("Name of the parsha (optional if using current parsha)"),
    parshaRef: z
      .string()
      .optional()
      .describe("Reference of the parsha (optional if using current parsha)"),
  }),
  async execute(params) {
    try {
      console.log(
        "summarizeParshah tool called with params:",
        JSON.stringify(params)
      );

      // If no parsha details are provided, use today's parsha
      let parshaName = params?.parshaName;
      let parshaRef = params?.parshaRef;

      if (!parshaName || !parshaRef) {
        console.log("No parsha details provided, getting today's parsha");
        const today = await _getTodayParsha();
        if (!today) {
          throw new Error("No parsha found for today");
        }
        parshaName = today.parshaName;
        parshaRef = today.parshaRef;
        console.log(`Using today's parsha: ${parshaName} (${parshaRef})`);
      }

      console.log(`Will summarize parsha: ${parshaName} (${parshaRef})`);
      const result = await summarizeParsha(parshaName, parshaRef);
      console.log(
        `Summary generated successfully, length: ${result.summary.length} characters`
      );
      return result;
    } catch (error) {
      console.error("Error in summarizeParshah tool:", error);
      // Return fallback response instead of throwing
      return {
        summary: `I apologize, but I encountered an issue generating a summary for the weekly Torah portion. Please try again later or visit Sefaria directly to read this week's parshah.`,
        source: `https://www.sefaria.org/`,
      };
    }
  },
});

// For direct execution from command line
if (require.main === module) {
  (async () => {
    try {
      const today = await _getTodayParsha();
      if (!today) {
        console.log("No parsha today");
        return;
      }
      const { parshaName, parshaRef } = today;
      const { summary, source } = await summarizeParsha(parshaName, parshaRef);
      console.log(`— ${parshaName} Nutshell (via ${source}) —\n\n${summary}`);
    } catch (e) {
      console.error("Error during summarization:", e);
    }
  })();
}
