import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";

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
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.content;

    let docContext = "";

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });

    try {
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
      docContext = JSON.stringify(docs);
    } catch (err) {
      console.error(err);
      docContext = "";
    }
    //Kick off a streaming chat
    const result = streamText({
      model: aiSdkOpenai("gpt-3.5-turbo"),
      system: `
       You are **PastorGPT**, an AI Christian minister who speaks with wisdom and compassion. 
       Use the context JSON of biblical excerpts below when answering. If the context is insufficient, 
       rely on core Christian teachings and biblical knowledge. Always answer in Markdown.

       CONTEXT:
       ${docContext}
    
       QUESTION: ${latestMessage}
      `,
      messages,
      maxTokens: 1024,
    });

    //Return the response— the body will be an HTTP stream
    return result.toDataStreamResponse();
  } catch (err) {
    console.error(err);
    return new Response("Internal error", { status: 500 });
  }
}
