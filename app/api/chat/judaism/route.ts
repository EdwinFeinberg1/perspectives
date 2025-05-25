// judaism/route.ts
import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { logQuestion } from "@/lib/logging";

import { getTodayParsha } from "@/lib/tools/parshah/getTodayParsha";
import { summarizeParshah } from "@/lib/tools/parshah/summarizeParshah";

const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION_JEWISH,
  ASTRA_DB_APPLICATION_TOKEN_JEWISH,
  ASTRADB_API_ENDPOINT_JEWISH,
  OPENAI_API_KEY,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_JEWISH!);
const db = client.db(ASTRADB_API_ENDPOINT_JEWISH!, {
  keyspace: ASTRADB_DB_KEYSPACE!,
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function detectSentiment(
  text: string
): Promise<"positive" | "negative" | "neutral"> {
  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      temperature: 0,
      max_tokens: 1,
      messages: [
        {
          role: "system",
          content:
            "Classify sentiment: positive, negative, or neutral. Respond only with the single lowercase word.",
        },
        { role: "user", content: text },
      ],
    });
    return (
      (resp.choices[0]?.message?.content?.trim().toLowerCase() as
        | "positive"
        | "negative"
        | "neutral") || "neutral"
    );
  } catch {
    return "neutral";
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages.at(-1)?.content || "";
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

    await logQuestion(latestMessage, "RabbiGPT", ipAddress);

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
    });

    const vector = embeddingResponse.data[0].embedding.slice(0, 1024);

    let retrievedChunks;
    try {
      const collection = db.collection(ASTRADB_DB_COLLECTION_JEWISH!);
      const docs = await collection
        .find(null, { sort: { $vector: vector }, limit: 5 })
        .toArray();
      retrievedChunks = docs.map((d) => ({ ref: d.ref, text: d.text }));
    } catch {
      retrievedChunks = [
        {
          ref: "Pirkei Avot 1:14",
          text: "If I am not for myself, who will be for me?...",
        },
        {
          ref: "Berakhot 5a",
          text: "If suffering befalls a person, let him examine his deeds...",
        },
      ];
    }

    const docContext = retrievedChunks
      .map(({ ref, text }) => `${ref}:\n${text}`)
      .join("\n\n");
    const sentiment = await detectSentiment(latestMessage);

    const BASE_SYSTEM_PROMPT = `
You are RabbiGPT – a knowledgeable and authoritative Jewish scholar. You are a Rabbi and a Chassidic Rebbe.

Guidelines:
- Be authoritative, precise, and deeply rooted in Torah, Talmud, and classical Jewish texts.
- Explicitly quote and reference texts.
- Clarify unclear user queries immediately.
- Provide practical advice clearly.

Relevant context:\n${docContext}

End with follow-up questions:\n## Follow-up Questions\n1. Question one?\n2. Question two?\n3. Question three?`;

    const guidanceMap = {
      positive: "Offer concise encouragement and clarity.",
      neutral: "Clarify user's intent before providing depth.",
      negative:
        "Start with empathy, clarify concern, then give clear teachings.",
    };

    const systemPromptFinal = `${BASE_SYSTEM_PROMPT}\nSentiment detected: ${sentiment}. ${guidanceMap[sentiment]}`;

    const isParshaQuery = /parsh(a|ah)|torah portion|this week/i.test(
      latestMessage
    );

    const result = streamText({
      model: aiSdkOpenai("gpt-4o-mini"),
      tools: { getTodayParsha, summarizeParshah },
      system: isParshaQuery
        ? "Handle parsha query by calling tools sequentially."
        : systemPromptFinal,
      messages,
      temperature: 0.7,
      maxTokens: 700,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Error processing request",
        details: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
