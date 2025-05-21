// Load env vars from .env.local (if present) and .env
import path from "path";
import dotenv from "dotenv";

// First, try to load .env.local sitting in project root
//dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
// Then load .env so it can fill anything else
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// scripts/seed-theme-prompts.ts
// Usage: npx ts-node scripts/seed-theme-prompts.ts
// Requires the following env vars (e.g., in .env.local):
//   OPENAI_API_KEY
//   NEXT_PUBLIC_SUPABASE_URL
//   SERVICE_ROLE_KEY (⚠️ server-role, keep private!)

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { THEME_SEEDS, ALL_MODELS } from "../app/features/theme/constants";

// ------------------------------
// Config & helpers
// ------------------------------

const {
  OPENAI_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL_ENV,
  SERVICE_ROLE_KEY: SERVICE_ROLE_KEY_ENV,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} = process.env as Record<string, string>;

const SUPABASE_URL_FINAL = SUPABASE_URL_ENV || SUPABASE_URL;
const SERVICE_ROLE_FINAL = SERVICE_ROLE_KEY_ENV || SUPABASE_SERVICE_ROLE_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

if (!SUPABASE_URL_FINAL || !SERVICE_ROLE_FINAL) {
  console.error(
    "❌ Missing env NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) or SERVICE_ROLE_KEY / SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL_FINAL, SERVICE_ROLE_FINAL);

const QUESTION_COUNT = 3;
const DEFAULT_TONE = "reflective, introspective";

// System prompt templates copied from api/chat/theme/route.ts
const systemPrompts: Record<string, string> = {
  RabbiGPT: `You are RabbiGPT — a thoughtful, compassionate digital rabbi drawing from the Torah, Talmud, Mussar, and Kabbalistic teachings.

Your task is not to answer questions, but to generate {{questionCount}} insightful **questions that a user might ask** about the theme: "{{seed}}".

Base your prompts on Jewish ethics, philosophy, or Chassidic teachings. Use {{tone}} language. Your tone should feel like a wise, warm teacher guiding someone who wants to grow spiritually or ethically.

Avoid overly complex Hebrew unless explained. Keep the prompts less than 10 words each. Present prompts as a simple list:

- ...\n- ...\n- ...`,
  PastorGPT: `You are PastorGPT — a caring and grounded Christian guide drawing from the Bible (New Testament focus), personal discipleship, and ethical teaching.

Your role is to offer **{{questionCount}} suggested user questions** around the topic: "{{seed}}".

Each should be a sincere, everyday question someone might ask their pastor when struggling with this issue — theological, practical, or emotional.

Use {{tone}} language. You are not answering the question — only helping the user ask it better. keep the prompts less than 10 words each. Format the output like this:

- ...\n- ...\n- ...`,
  BuddhaGPT: `You are BuddhaGPT — a serene, reflective teacher of Dharma rooted in Buddhist texts and insight.

Your task is to provide **{{questionCount}} reflective questions** a person might ask themselves or a Buddhist teacher related to the topic: "{{seed}}".

These questions should point toward mindfulness, detachment, compassion, or insight. You do not answer — only suggest questions that lead to contemplation and practice.

Avoid jargon. Keep them {{tone}}. keep the prompts less than 10 words each. Format as a list:

- ...\n- ...\n- ...`,
  ImamGPT: `You are ImamGPT — a faithful guide drawing from the Qur'an, Hadith, Islamic ethics, and the lived traditions of the ummah.

Your job is to offer **{{questionCount}} sincere questions** a person might ask an imam regarding the theme: "{{seed}}".

Include questions about spiritual meaning, moral action, or prophetic guidance. Your tone should be {{tone}} and rooted in mercy.

You do not answer these — just offer questions people might ask. keep the prompts less than 10 words each. Format:

- ...\n- ...\n- ...`,
};

type ValidModel = keyof typeof systemPrompts;

function compilePrompt(model: ValidModel, seed: string): string {
  return systemPrompts[model]
    .replace("{{seed}}", seed)
    .replace("{{questionCount}}", QUESTION_COUNT.toString())
    .replace("{{tone}}", DEFAULT_TONE);
}

async function generatePrompts(
  model: ValidModel,
  seed: string
): Promise<string> {
  const systemPrompt = compilePrompt(model, seed);
  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate suggested prompts about: ${seed}` },
    ],
    temperature: 0.8,
    max_tokens: 400,
  });

  return chatResponse.choices[0]?.message?.content?.trim() ?? "";
}

async function upsertPrompt(
  model: ValidModel,
  seed: string,
  prompts: string
): Promise<void> {
  const { error } = await supabase.from("theme_prompts").upsert(
    {
      model,
      seed,
      question_count: QUESTION_COUNT,
      tone: DEFAULT_TONE,
      prompts,
    },
    { onConflict: "model,seed,question_count,tone" }
  );

  if (error) throw error;
}

async function main() {
  console.log("🚀 Seeding theme_prompts table…\n");
  const seeds = Object.values(THEME_SEEDS).flat();

  for (const seed of seeds) {
    for (const model of ALL_MODELS as ValidModel[]) {
      try {
        console.log(`🛠  ${model} → "${seed}"`);
        const prompts = await generatePrompts(model, seed);
        await upsertPrompt(model, seed, prompts);
        console.log("   ✅ Saved\n");
      } catch (err) {
        console.error("   ❌ Failed:", err);
      }
      // tiny pause to avoid rate-limits
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log("🏁 Done seeding theme_prompts table.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
