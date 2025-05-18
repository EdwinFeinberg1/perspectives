import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { logQuestion } from "@/lib/logging";

const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION_ISLAM,
  ASTRA_DB_APPLICATION_TOKEN_ISLAM,
  ASTRADB_API_ENDPOINT_ISLAM,
  OPENAI_API_KEY,
} = process.env;

// Initialize clients
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_ISLAM!);
const db = client.db(ASTRADB_API_ENDPOINT_ISLAM!, {
  keyspace: ASTRADB_DB_KEYSPACE!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const latestMessage = messages.at(-1)?.content || "";
  // Extract IP address from request headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : "not available";

  try {
    // Try to log the question, but don't let failures stop execution
    await logQuestion(latestMessage, "ImamGPT", ipAddress);
  } catch (loggingError) {
    // Just log the error to console and continue
    console.error(
      "Failed to log question, continuing execution:",
      loggingError
    );
  }
  // Moderate the user input
  const moderationResponse = await openai.moderations.create({
    input: latestMessage,
  });

  // Check if content is flagged
  const flagged = moderationResponse.results[0]?.flagged;
  if (flagged) {
    console.warn(
      "ImamGPT: Content moderation flagged input",
      moderationResponse.results[0]
    );
    return new Response(
      JSON.stringify({
        error:
          "Your message may contain content that violates our usage policies.",
        flagged: true,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  // 1) Create an embedding for the user query
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: latestMessage,
    encoding_format: "float",
  });
  const fullVector = embeddingResponse.data[0].embedding;
  // Truncate to 1024 dimensions to match collection configuration
  const vector = fullVector.slice(0, 1024);

  // 2) Vector-search your unified collection
  let retrievedChunks: { ref: string; text: string }[] = [];
  try {
    const collection = await db.collection(ASTRADB_DB_COLLECTION_ISLAM!);

    const cursor = collection.find(/* no filter */ null, {
      sort: {
        $vector: vector,
      },
      limit: 10,
    });
    const docs = await cursor.toArray();
    retrievedChunks = docs.map((d) => ({ ref: d.ref, text: d.text }));
  } catch (err) {
    console.error("ImamGPT: Vector search failed:", err);
  }

  // 3) Build a single context block
  //    e.g. "<ref>: <text>\n\n<ref2>: <text2>"
  const docContext = retrievedChunks
    .map(({ ref, text }) => `${ref}:\n${text}`)
    .join("\n\n");

  // 4) Kick off the streaming chat with your system prompt
  const result = streamText({
    model: aiSdkOpenai("gpt-3.5-turbo"),
    system: `
  You are ImamGPT, the virtual mufti of Sunni Islamic scholarship.
  
  FORMAT YOUR RESPONSES FOR READABILITY:
  - Use ### headings for main sections or topics
  - Add blank lines between paragraphs
  - Keep paragraphs concise (3-4 lines maximum)
  - If using bullet points, add spacing between items
  - Use markdown formatting consistently
  - Use > for Quranic quotations
  
  When citing sources:
  - When you quote or paraphrase from one of the provided passages, append its reference in square brackets immediately after the quote.  
    - For Quranic verses use e.g. [Quran 2:255].  
    - For Prophetic traditions use e.g. [Sahih al-Bukhari 1:1] or [Sahih Muslim 4:123].
  - If you summarize a teaching or hadith, still mention its source in parentheses:  
    e.g. (Ibn Kathir, Tafsir al-Quran, vol. 1) or (Al-Nawawi, Riyad as-Salihin, hadith 5).
  - Use a bullet or block-quote format when presenting multiple sourced points.
  - Speak in the tone of a seasoned Sunni Imam: respectful, humble, clear, grounded in Quranic exegesis (tafsir), Prophetic tradition (hadith), and classical fiqh.

  ISLAMIC SCHOLARSHIP VOICE:
  - Root your guidance in Qur'anic exegesis (tafsir), Prophetic traditions (hadith), and established Sunni jurisprudence.
  - Be compassionate but firm when explaining obligations.
  - Clarify when there are differences of opinion, especially among the four madhāhib (legal schools), but avoid unnecessary debate.
  - Highlight spiritual wisdom and moral purpose in every answer.

  Here are the relevant excerpts you may draw upon (each preceded by its reference):
  ${docContext}
  
  Now answer the user's question, and be meticulous about citing each time you use one of the above passages.
  IMPORTANT: Always end your response with a 'Follow-up Questions' section using exactly this format:

  ## Follow-up Questions
  1. First suggested question?
  2. Second suggested question?
  3. Third suggested question?
    `,
    messages,
    maxTokens: 1024,
  });

  // Return streaming HTTP response directly
  return result.toDataStreamResponse();
}
