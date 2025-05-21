import OpenAI from "openai";
import { FaithType } from "@/app/types";
import { supabase, Perspective } from "@/app/lib/supabase";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Verify required environment variables are set
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
  process.exit(1);
}

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// 1) Faith-specific system intros
const FAITH_SYSTEM: Record<FaithType, string> = {
  rabbi: `You are Rabbi GPT: a compassionate, erudite Jewish teacher.`,
  pastor: `You are Pastor GPT: a thoughtful Christian pastor.`,
  buddha: `You are Buddha GPT: a wise Buddhist teacher.`,
  imam: `You are Imam GPT: a learned Muslim Imam.`,
};

// 2) Shared, multi-step format instructions
const STRUCTURE = `
Follow these steps and format your response using proper Markdown:

## Summary
One crisp sentence summarizing the news.

## Texts Cited
- "You shall not murder." (Exodus 20:13)
- Include 2-3 relevant passages with citations

## What It Means
50-100 words explaining the deeper meaning for your faith community. Write this as a cohesive paragraph that offers theological insight.

## Action Steps
- Provide a concrete action a person can take today

## Prayer
A one-sentence blessing or prayer to close.
`.trim();

async function generatePerspective(
  newsId: string,
  newsTitle: string,
  newsDescription: string,
  faith: FaithType
): Promise<string> {
  // Build your full system + user prompts
  const systemPrompt = `${FAITH_SYSTEM[faith]}

${STRUCTURE}`;

  const userPrompt = `News: ${newsTitle.trim()}
Details: ${newsDescription.trim()}`;

  // Call GPT-4
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5,
    max_tokens: 500,
  });

  return (
    response.choices[0]?.message?.content?.trim() ??
    "Unable to generate a perspective at this time."
  );
}

async function storePerspective(perspective: Perspective): Promise<void> {
  const { error } = await supabase
    .from("perspectives")
    .upsert(perspective, { onConflict: "news_id,faith" });

  if (error) {
    console.error(
      `Error storing perspective for news ${perspective.news_id}, faith ${perspective.faith}:`,
      error
    );
    throw error;
  }

  console.log(
    `✅ Stored perspective for news ${perspective.news_id}, faith ${perspective.faith}`
  );
}

async function run() {
  console.log("🚀 Starting to generate perspectives");

  // Fetch all news articles
  const { data: news, error } = await supabase
    .from("news")
    .select("id, title, description, faiths");

  if (error || !news) {
    console.error("Error fetching news:", error);
    return;
  }

  console.log(`📰 Found ${news.length} news articles`);

  for (const article of news) {
    console.log(`\n📝 Processing article: ${article.title}`);

    // Process each faith for this article
    for (const faith of article.faiths as FaithType[]) {
      console.log(`  🙏 Generating ${faith} perspective...`);

      try {
        // Check if perspective already exists
        const { data } = await supabase
          .from("perspectives")
          .select("id")
          .eq("news_id", article.id)
          .eq("faith", faith)
          .single();

        if (data) {
          console.log(`  ⏩ Perspective already exists, skipping`);
          continue;
        }

        // Generate the perspective
        const perspective = await generatePerspective(
          article.id,
          article.title,
          article.description,
          faith
        );

        // Store the perspective
        await storePerspective({
          news_id: article.id,
          faith,
          perspective,
        });
      } catch (err) {
        console.error(`  ❌ Error with ${faith} perspective:`, err);
      }
    }
  }

  console.log("\n✅ All perspectives generated and stored!");
}

run()
  .catch(console.error)
  .finally(() => {
    console.log("🏁 Process complete");
    process.exit(0);
  });
