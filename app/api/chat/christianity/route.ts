import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";

console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION_CHRISTIANITY,
  ASTRA_DB_APPLICATION_TOKEN_CHRISTIANITY,
  ASTRADB_API_ENDPOINT_CHRISTIANITY,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_CHRISTIANITY);
const db = client.db(ASTRADB_API_ENDPOINT_CHRISTIANITY, {
  keyspace: ASTRADB_DB_KEYSPACE,
});

export async function POST(req: Request) {
  try {
    console.log("POST request received in Christianity route");
    console.log("API Key available:", !!process.env.OPENAI_API_KEY);
    const { messages } = await req.json();
    console.log("Messages received:", messages.length);
    const latestMessage = messages[messages?.length - 1]?.content;
    console.log("Latest message:", latestMessage);

    let docContext = "";

    console.log("Generating embeddings via OpenAI");
    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: latestMessage,
        encoding_format: "float",
      });
      console.log("Embeddings generated successfully");

      try {
        console.log("Querying AstraDB for similar documents");
        const collection = await db.collection(
          ASTRADB_DB_COLLECTION_CHRISTIANITY
        );
        //find whats similar in our db to the latest message
        const cursor = collection.find(null, {
          sort: {
            $vector: embedding.data[0].embedding,
          },
          limit: 10,
        });
        const docs = (await cursor.toArray()).map((d) => d.text);
        console.log(`Retrieved ${docs.length} relevant documents from AstraDB`);
        docContext = JSON.stringify(docs);
      } catch (err) {
        console.error("AstraDB query error:", err);
        docContext = "";
      }
    } catch (embeddingErr) {
      console.error("OpenAI embedding generation error:", embeddingErr);
      return new Response("Error generating embeddings", { status: 500 });
    }

    //Kick off a streaming chat
    console.log("Starting OpenAI stream response");
    try {
      const result = streamText({
        model: aiSdkOpenai("gpt-3.5-turbo"),
        system: `
         You are **PastorGPT**, an AI Christian minister who speaks with wisdom and compassion. 
         Use the context JSON of biblical excerpts below when answering. If the context is insufficient, 
         rely on core Christian teachings and biblical knowledge. 
         
         FORMAT YOUR RESPONSES FOR READABILITY:
         - Use ### headings for main sections or topics
         - Add blank lines between paragraphs
         - Keep paragraphs concise (3-4 lines maximum)
         - If using bullet points, add spacing between items
         - Use markdown formatting consistently
         - Use > for scripture quotations
         - Format citations [like this]

         CONTEXT:
         ${docContext}
      
         QUESTION: ${latestMessage}

         ## Follow-up Questions
         1. First suggested question?
         2. Second suggested question?
         3. Third suggested question?
        `,
        messages,
        maxTokens: 1024,
      });
      console.log("Stream created successfully, returning response");

      // Return the response with explicit options to handle potential issues
      return result.toDataStreamResponse({
        // Handle usage data properly - set to false if causing issues
        sendUsage: true,
        // Provide explicit error handling
        getErrorMessage: (error) => {
          if (error instanceof Error) {
            console.error("Detailed error:", error.message, error.stack);
            return error.message;
          }
          return String(error);
        },
      });
    } catch (streamErr) {
      console.error("Error creating stream:", streamErr);
      return new Response("Error creating response stream", { status: 500 });
    }
  } catch (err) {
    console.error("General error in API route:", err);
    return new Response("Internal error", { status: 500 });
  }
}
