import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { logQuestion } from "../../../../lib/logging";

// Define document structure
interface BuddhaDocument {
  text: string;
  [key: string]: unknown; // For any other properties
}

// -----------------------------------------------------------------------------
// Env vars (make sure ASTRADB_DB_COLLECTION points to your Db_buddist collection)
// -----------------------------------------------------------------------------
const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION_BUDDHA, // e.g. "Db_buddist"
  ASTRA_DB_APPLICATION_TOKEN_BUDDHA,
  ASTRA_DB_API_ENDPOINT_BUDDHA,
  OPENAI_API_KEY,
} = process.env as Record<string, string>;

// -----------------------------------------------------------------------------
// Clients
// -----------------------------------------------------------------------------
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_BUDDHA);
const db = client.db(ASTRA_DB_API_ENDPOINT_BUDDHA, {
  keyspace: ASTRADB_DB_KEYSPACE,
});

export async function POST(req: Request) {
  try {
    // 1) latest user message
    const { messages } = await req.json();
    const latestMessage: string =
      messages?.[messages.length - 1]?.content ?? "";

    await logQuestion(latestMessage, "BuddhaGPT");
    // 2) Create embedding for similarity search
    const embedResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });
    const queryVector = embedResp.data[0].embedding;
   

    // 3) Retrieve top‑k relevant chunks from AstraDB
    let docContext = "";
    try {
      const collection = await db.collection(ASTRADB_DB_COLLECTION_BUDDHA);
   
      const cursor = collection.find(null, {
        sort: { $vector: queryVector },
        limit: 10,
      });
      const docs = (await cursor.toArray()).map(
        (d) => (d as unknown as BuddhaDocument).text
      );
      docContext = JSON.stringify(docs);
    } catch (err) {
      console.error("Vector search failed", err);
    }

    // 4) Stream response from GPT‑4 / GPT‑3.5 with Buddhist persona
    const result = streamText({
      model: aiSdkOpenai("gpt-3.5-turbo"), // Using cheaper model
      system: `You are **BuddhaGPT**, an AI Buddhist monk. Answer with warmth, clarity, and citations when possible. Use the context JSON of canonical excerpts below. If the context is insufficient, rely on established Buddhist teachings (e.g., Four Noble Truths, Eightfold Path).

FORMAT YOUR RESPONSES FOR READABILITY:
- Use clear section headings with ### for main topics
- Add blank lines between paragraphs
- Keep paragraphs concise (3-4 lines maximum)
- Use bullet points with spacing for lists
- Use markdown formatting consistently
- If citing text, use > for blockquotes
- Format citations [like this]
QUESTION: ${latestMessage}
CONTEXT:
${docContext}

IMPORTANT: Always end your response with a 'Follow-up Questions' section using exactly this format:

## Follow-up Questions
1. First suggested question?
2. Second suggested question?
3. Third suggested question?
`,
      messages,
      maxTokens: 1024,
    });

    // 5) Return streaming HTTP response
    return result.toDataStreamResponse();
  } catch (err) {
    console.error(err);
    return new Response("Internal error", { status: 500 });
  }
}
