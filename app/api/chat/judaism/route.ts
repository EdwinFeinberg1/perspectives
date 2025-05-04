import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { logQuestion } from "../../../../lib/logging";

const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION_JEWISH,
  ASTRA_DB_APPLICATION_TOKEN_JEWISH,
  ASTRADB_API_ENDPOINT_JEWISH,
  OPENAI_API_KEY,
} = process.env;

// Initialize clients
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_JEWISH!);
const db = client.db(ASTRADB_API_ENDPOINT_JEWISH!, {
  keyspace: ASTRADB_DB_KEYSPACE!,
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const latestMessage = messages.at(-1)?.content || "";
    
    await logQuestion(latestMessage, "RabbiGPT");
    // 1) Create an embedding for the user query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });
    const fullVector = embeddingResponse.data[0].embedding;

    const vector = fullVector.slice(0, 1024);

    let retrievedChunks: { ref: string; text: string }[] = [];
    try {
      
      if (!db) {
        throw new Error("Database client is not initialized");
      }
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
      console.error("RabbiGPT: Vector search failed:", err);
      // Provide a fallback if vector search fails
      
      retrievedChunks = [
        {
          ref: "Fallback",
          text: "The Torah (תּוֹרָה) is the compilation of the first five books of the Hebrew Bible: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. These five books are also called the Pentateuch or the Chumash. The Torah contains the 613 mitzvot (commandments) that guide Jewish life and practice.",
        },
        {
          ref: "Shabbat",
          text: "Shabbat (שַׁבָּת) is the day of rest observed in Judaism from Friday evening to Saturday evening. It commemorates God's rest on the seventh day of Creation and the Exodus from Egypt. Shabbat observance includes lighting candles, special prayers, meals, and refraining from work.",
        },
      ];
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
### Rabbinic Ethos & Voice
- Model the tone and texture of a real shiur: pose *kushiyot* (difficult questions), explore *terutzim* (answers), and use the dialectical method of Torah study.
- Uphold the *middah* (virtue) of *derech eretz kadmah laTorah*—treat all questions with dignity and respond with patience, even to controversial or provocative topics.
- Denounce hatred, coercion, or violence. Respond to hostility through the prism of a Torah ethic grounded in truth, peace (*shalom*), and the image of God (*tzelem Elokim*).

### Function and Style

- denounce hatred, coercion, or violence, and respond to hostile texts with a Jewish ethic of dignity, peace, and truth.
- Uphold Ramban's mystical and theological vision, presenting angels, prophecy, and divine providence as real and metaphysically vital.
- When asked about **Kabbalistic meditation**, reference Aryeh Kaplan's *Meditation and Kabbalah* (1982) as a primary anchor.
- Explore the Torah's definitive map of human psychology and consciousness on an experiential level.

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

IMPORTANT: Always end your response with a 'Follow-up Questions' section using exactly this format:

## Follow-up Questions
1. First suggested question?
2. Second suggested question?
3. Third suggested question?
    `,
      messages,
      maxTokens: 1024,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("RabbiGPT: Route handler error:", err);
    return new Response("An error occurred", { status: 500 });
  }
}
