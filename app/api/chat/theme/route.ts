// app/api/theme/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { themeSeeds } from "../../../../lib/constants";
// Flatten sub-themes from the record into a simple string[] for easier validation
const flatSeeds: string[] = Object.values(themeSeeds).flat();
const { OPENAI_API_KEY } = process.env;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const rabbiSystemPrompt = `
You are RabbiGPT — a thoughtful, compassionate digital rabbi drawing from the Torah, Talmud, Mussar, and Kabbalistic teachings.

Your task is not to answer questions, but to generate {{questionCount}} insightful **questions that a user might ask** about the theme: "{{seed}}".

Base your prompts on Jewish ethics, philosophy, or Chassidic teachings. Use {{tone}} language. Your tone should feel like a wise, warm teacher guiding someone who wants to grow spiritually or ethically.

Avoid overly complex Hebrew unless explained. Keep the prompts less than 10 words each. Present prompts as a simple list:

- ...
- ...
- ...
`;

const pastorSystemPrompt = `
You are PastorGPT — a caring and grounded Christian guide drawing from the Bible (New Testament focus), personal discipleship, and ethical teaching.

Your role is to offer **{{questionCount}} suggested user questions** around the topic: "{{seed}}".

Each should be a sincere, everyday question someone might ask their pastor when struggling with this issue — theological, practical, or emotional.

Use {{tone}} language. You are not answering the question — only helping the user ask it better. keep the prompts less than 10 words each. Format the output like this:

- ...
- ...
- ...
`;

const buddhaSystemPrompt = `
You are BuddhaGPT — a serene, reflective teacher of Dharma rooted in Buddhist texts and insight.

Your task is to provide **{{questionCount}} reflective questions** a person might ask themselves or a Buddhist teacher related to the topic: "{{seed}}".

These questions should point toward mindfulness, detachment, compassion, or insight. You do not answer — only suggest questions that lead to contemplation and practice.

Avoid jargon. Keep them {{tone}}. keep the prompts less than 10 words each. Format as a list:

- ...
- ...
- ...
`;

const imamSystemPrompt = `
You are ImamGPT — a faithful guide drawing from the Qur'an, Hadith, Islamic ethics, and the lived traditions of the ummah.

Your job is to offer **{{questionCount}} sincere questions** a person might ask an imam regarding the theme: "{{seed}}".

Include questions about spiritual meaning, moral action, or prophetic guidance. Your tone should be {{tone}} and rooted in mercy.

You do not answer these — just offer questions people might ask. keep the prompts less than 10 words each. Format:

- ...
- ...
- ...
`;

const systemPrompts = {
  RabbiGPT: rabbiSystemPrompt,
  PastorGPT: pastorSystemPrompt,
  BuddhaGPT: buddhaSystemPrompt,
  ImamGPT: imamSystemPrompt,
} as const;

function getSystemPrompt(
  model: keyof typeof systemPrompts,
  seed: string,
  questionCount: number = 2,
  tone: string = "gentle, approachable"
) {
  const template = systemPrompts[model];
  return template
    .replace("{{seed}}", seed)
    .replace("{{questionCount}}", questionCount.toString())
    .replace("{{tone}}", tone);
}

const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      model,
      seed,
      allowCustomTheme = false,
      questionCount = 3,
      tone = "hard, direct",
    } = body as {
      model: keyof typeof systemPrompts;
      seed: string;
      allowCustomTheme?: boolean;
      questionCount?: number;
      tone?: string;
    };

    if (!systemPrompts[model]) {
      return NextResponse.json(
        { error: "Invalid model name." },
        { status: 400 }
      );
    }

    // Validate theme seed, allowing custom if enabled
    if (!allowCustomTheme && !flatSeeds.includes(seed)) {
      return NextResponse.json(
        { error: "Invalid theme seed." },
        { status: 400 }
      );
    }

    // Validate question count
    if (questionCount < 1 || questionCount > 10) {
      return NextResponse.json(
        {
          error: "Question count must be between 1 and 10.",
        },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `theme:${model}:${seed}:${questionCount}:${tone}`;
    if (process.env.USE_CACHE === "true" && kv) {
      const cachedResponse = await kv.get(cacheKey);
      if (cachedResponse) {
        return NextResponse.json(cachedResponse);
      }
    }

    const systemPrompt = getSystemPrompt(model, seed, questionCount, tone);

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate suggested prompts about: ${seed}` },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const reply = chatResponse.choices[0]?.message?.content?.trim();

    const response = {
      model,
      seed,
      questionCount,
      tone,
      prompts: reply,
    };

    // Cache the response
    if (process.env.USE_CACHE === "true" && kv) {
      await kv.set(cacheKey, response, { ex: CACHE_TTL });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Theme prompt generation error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
