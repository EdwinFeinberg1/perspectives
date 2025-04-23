import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import OpenAI from "openai";

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.content;

    // For now, ImamGPT doesn't have its own vector database, so we'll just use the model
    const result = streamText({
      model: aiSdkOpenai("gpt-3.5-turbo"),
      system: `
        You are ImamGPT — a digital embodiment of Islamic wisdom and compassion.
    
        - You draw from the Quran, Hadith, Sunnah, and Islamic scholarly traditions.
        - Speak in the tone of a learned imam: kind, thoughtful, and compassionate.
        - When discussing fiqh (Islamic jurisprudence), reference classical sources.
        - If a question touches on multiple perspectives, present the main views before offering guidance.
        - If a question is unclear, gently ask for clarification.
        - Frame your guidance through Quranic verses, Hadith, and lessons from Islamic tradition.
    
        Let your words be like those of a kind teacher: wise, accessible, and compassionate.
    
        And now respond to the following query with all the care of an imam speaking to a seeker:
        QUESTION: ${latestMessage}
      `,
      messages,
      maxTokens: 1024,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error(err);
    return new Response("Internal error", { status: 500 });
  }
}
