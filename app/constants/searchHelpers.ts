/*─────────────────────────  s e a r c h H e l p e r s  ─────────────────────────*/

import type { Faith, Category } from "./prayers";

/* ——— Synonyms & colloquial queries that users actually type ——— */

export const FAITH_SYNONYMS: Record<Faith, string[]> = {
  judaism: [
    "judaism",
    "jewish",
    "hebrew",
    "torah",
    "tanakh",
    "rabbinic",
    "israel",
    "shalom",
  ],
  islam: [
    "islam",
    "muslim",
    "islamic",
    "quran",
    "koran",
    "hadith",
    "sunnah",
    "allah",
  ],
  christianity: [
    "christianity",
    "christian",
    "biblical",
    "bible",
    "gospel",
    "church",
    "jesus",
    "christ",
    "new testament",
    "psalm",
  ],
  buddhism: [
    "buddhism",
    "buddhist",
    "buddha",
    "dharma",
    "sangha",
    "zen",
    "meditation",
    "sutra",
  ],
  hinduism: [
    "hinduism",
    "hindu",
    "vedic",
    "vedanta",
    "sanskrit",
    "mantra",
    "yoga",
    "dharma",
  ],
  general: [
    "general",
    "interfaith",
    "multi-faith",
    "spiritual",
    "non-religious",
    "secular",
    "universal",
  ],
};

export const CATEGORY_SYNONYMS: Record<Category, string[]> = {
  /* core */
  morning: ["morning", "dawn", "sunrise", "waking", "daybreak"],
  healing: ["healing", "refua", "cure", "recovery", "restore", "strength"],
  gratitude: ["gratitude", "thanks", "thanksgiving", "praise", "appreciation"],
  general: ["general", "everyday", "common", "all-purpose", "any"],
  /* need-based */
  wealth: ["wealth", "prosperity", "abundance", "success", "finances", "money"],
  health: ["health", "wellness", "fitness", "body", "vitality"],
  discernment: [
    "discernment",
    "guidance",
    "wisdom",
    "decision",
    "clarity",
    "direction",
  ],
  /* timing / flexibility */
  any_time: ["anytime", "any_time", "whenever", "always", "all-day"],
  /* text-oriented */
  scripture: [
    "scripture",
    "verse",
    "passage",
    "text",
    "holy text",
    "psalm",
    "bible verse",
    "quran verse",
  ],
  /* practice-oriented */
  meditation: [
    "meditation",
    "mindfulness",
    "contemplation",
    "reflection",
    "quiet",
    "calm",
  ],
  liturgical: [
    "liturgical",
    "liturgy",
    "service",
    "ritual",
    "rite",
    "mass",
    "prayerbook",
  ],
  affirmation: [
    "affirmation",
    "positive",
    "mantra",
    "self-talk",
    "statement",
    "declaration",
  ],
  chant: [
    "chant",
    "mantra",
    "recitation",
    "chanting",
    "repeat",
    "song",
    "chant prayer",
  ],
  /* additional categories */
  supplication: ["supplication", "plea", "request", "asking", "beseeching"],
  invocation: ["invocation", "calling", "summoning", "invoking", "entreaty"],
  plea: ["plea", "appeal", "petition", "imploring", "begging"],
  psalm: ["psalm", "psalter", "hymn", "song", "biblical poetry"],
  litany: ["litany", "responsive prayer", "repetitive prayer", "formal prayer"],
  mantra: ["mantra", "sacred sound", "repeated phrase", "spiritual chant"],
  dua: ["dua", "supplication", "islamic prayer", "personal prayer"],
  sutra: ["sutra", "buddhist text", "dharma teaching", "scripture"],
  positive_energy: [
    "positive energy",
    "good vibes",
    "uplifting",
    "energetic healing",
  ],
  holding_space: [
    "holding space",
    "presence",
    "support",
    "companionship",
    "being with",
  ],
};
