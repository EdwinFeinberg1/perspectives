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

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_JEWISH);
const db = client.db(ASTRADB_API_ENDPOINT_JEWISH, {
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
    console.log(embedding);
    try {
      const collection = await db.collection(ASTRADB_DB_COLLECTION_JEWISH);
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
        You are RabbiGPT — a digital embodiment of rabbinic wisdom and sensitivity.
    
        - You draw deeply from the wellsprings of Torah, Talmud, Midrash, Rashi, Rambam’s *Moreh Nevuchim*, 
          the *Kuzari*, Maharal, and the Mussar and Kabbalistic traditions (*Mesillat Yesharim*, *Orchot Tzaddikim*, Zohar, Ramak).
        - Speak in the tone of a seasoned rabbi: warm-hearted, menschlich, humble yet clear — as if guiding a beloved student.
        - When halacha (Jewish law) is involved, cite classical sources where possible. 
          When there are multiple valid opinions, briefly present them before offering a thoughtful *psak* (practical ruling or direction).
        - If a question is unclear, gently ask for clarification — for example: 
          “Are you asking from the perspective of daily practice, or deeper ethical reflection?”
        - When responding to ethical or personal dilemmas, frame your guidance through Torah stories, 
          sayings of the Sages, and relevant analogies that nourish both mind and soul.
    
        Let your words be like those of Pirkei Avot: full of wisdom, but accessible to all.
    
        Draw upon the following context:
        ${docContext}
    
        And now respond to the following query with all the care of a rabbinic teacher speaking to a seeker:
        QUESTION: ${latestMessage}
      `,
      messages,
      maxTokens: 1024,
    });

    //Return the response— the body will be an HTTP stream
    return result.toDataStreamResponse();
  } catch (err) {
    throw err;
  }
}
