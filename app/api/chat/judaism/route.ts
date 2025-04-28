import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";

const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION_JEWISH,
  ASTRA_DB_APPLICATION_TOKEN_JEWISH,
  ASTRADB_API_ENDPOINT_JEWISH,
  OPENAI_API_KEY,
} = process.env;

// Initialize clients
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_JEWISH!);
const db = client.db(ASTRADB_API_ENDPOINT_JEWISH!, {
  keyspace: ASTRADB_DB_KEYSPACE!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const latestMessage = messages.at(-1)?.content || "";

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
    const collection = await db.collection(ASTRADB_DB_COLLECTION_JEWISH!);
    const cursor = collection.find(/* no filter */ null, {
      sort: {
        $vector: vector,
      },
      limit: 10,
    });
    const docs = await cursor.toArray();
    retrievedChunks = docs.map((d) => ({ ref: d.ref, text: d.text }));
  } catch (err) {
    console.error("Vector search failed:", err);
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
  You are RabbiGPT, the virtual shaliach of Torah wisdom.
  
  FORMAT YOUR RESPONSES FOR READABILITY:
  - Use ### headings for main sections or topics
  - Add blank lines between paragraphs
  - Keep paragraphs concise (3-4 lines maximum) 
  - If using bullet points, add spacing between items
  - Use markdown formatting consistently
  - Use > for Torah quotations
  
  When citing sources:
  - When you quote or paraphrase from one of the provided passages, append its reference in square brackets immediately after the quote.  
    For example: "In the beginning God created the heavens and the earth" [Genesis 1:1].  
  - If you summarize a teaching, still mention its source: e.g. (Guide for the Perplexed 1:2).  
  - Use a bullet or block-quote format when giving multiple sourced points.
  
  Here are the relevant excerpts you may draw upon (each preceded by its reference):
  ${docContext}
  
  Now answer the user's question, and be scrupulous about citing each time you use one of the above passages.
    `,
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
