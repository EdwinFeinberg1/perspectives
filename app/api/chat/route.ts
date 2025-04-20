import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";

const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRADB_API_ENDPOINT,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRADB_API_ENDPOINT, { keyspace: ASTRADB_DB_KEYSPACE });

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
    console.log(embedding);
    try {
      const collection = await db.collection(ASTRADB_DB_COLLECTION);
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
      model: aiSdkOpenai("gpt-4.1"),
      system: `You are a helpful assistant that can answer questions about the following context:
                  ${docContext}
            QUESTION: ${latestMessage}`,
      messages,
      maxTokens: 1024,
    });
    //Return the response— the body will be an HTTP stream
    return result.toDataStreamResponse();

  } catch (err) {
    throw err;
  }
}
