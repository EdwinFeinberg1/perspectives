"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { ModelName } from "@/app/types";

interface OnboardingFlowProps {
  onComplete: (intent: UserIntent) => void;
  onSkip: () => void;
}

export interface UserIntent {
  primaryIntent: "learning" | "comfort" | "guidance" | "exploration";
  spiritualTradition?:
    | "judaism"
    | "christianity"
    | "buddhism"
    | "islam"
    | "none";
  specificNeed?: string;
  tags: string[];
  suggestedModel: ModelName;
  initialPrompt: string;
}

const INTENTS = [
  {
    id: "learning",
    label: "I want to learn about spirituality",
    icon: "📚",
    description: "Explore religious teachings and wisdom",
  },
  {
    id: "comfort",
    label: "I'm seeking comfort or support",
    icon: "🤗",
    description: "Find solace in spiritual guidance",
  },
  {
    id: "guidance",
    label: "I need help with a decision",
    icon: "🤔",
    description: "Get perspectives on moral or life choices",
  },
  {
    id: "exploration",
    label: "I'm just curious",
    icon: "✨",
    description: "Open to discovering what resonates",
  },
];

const TRADITIONS = [
  {
    id: "judaism",
    label: "Judaism",
    icon: "✡️",
    model: "RabbiGPT" as ModelName,
  },
  {
    id: "christianity",
    label: "Christianity",
    icon: "✝️",
    model: "PastorGPT" as ModelName,
  },
  {
    id: "buddhism",
    label: "Buddhism",
    icon: "☸️",
    model: "BuddhaGPT" as ModelName,
  },
  {
    id: "islam",
    label: "Islam",
    icon: "☪️",
    model: "ImamGPT" as ModelName,
  },
  {
    id: "none",
    label: "No preference",
    icon: "🌟",
    model: null,
  },
];

const SPIRITUAL_TOPICS = {
  judaism: [
    {
      name: "Shabbat",
      description:
        "The weekly day of rest and spiritual renewal that begins Friday at sunset and ends Saturday night.",
    },
    {
      name: "Teshuvah",
      description:
        "The practice of repentance and return to one's higher self and to God, especially emphasized during the High Holy Days.",
    },
    {
      name: "Kabbalah",
      description:
        "Jewish mystical tradition exploring the nature of God, creation, and the soul through symbols like the Sefirot.",
    },
    {
      name: "Mussar",
      description:
        "A discipline of ethical self-improvement and character refinement rooted in classical Jewish texts.",
    },
  ],
  buddhism: [
    {
      name: "Four Noble Truths",
      description:
        "Core teaching that diagnoses suffering (dukkha) and prescribes a path to its cessation.",
    },
    {
      name: "Noble Eightfold Path",
      description:
        "Eight practical guidelines—ethical, mental, and wisdom training—leading to liberation.",
    },
    {
      name: "Mindfulness (Sati)",
      description:
        "Present-moment, non-judgmental awareness cultivated through meditation and daily life.",
    },
    {
      name: "Karma",
      description:
        "The law of intentional action and its consequences shaping present and future experiences.",
    },
    {
      name: "Rebirth",
      description:
        "The continuing cycle of birth, death, and renewal conditioned by karma until enlightenment is achieved.",
    },
    {
      name: "Loving-Kindness (Metta)",
      description:
        "Meditative practice of generating boundless friendliness toward oneself and all beings.",
    },
    {
      name: "Compassion (Karuna)",
      description:
        "The heartfelt wish to relieve the suffering of others, a cornerstone of Mahayana practice.",
    },
    {
      name: "Emptiness (Śūnyatā)",
      description:
        "Insight into the interdependent, non-self nature of all phenomena, dissolving attachment.",
    },
  ],
  islam: [
    {
      name: "Tawḥīd",
      description:
        "The absolute oneness and uniqueness of God, the foundation of Islamic belief.",
    },
    {
      name: "Five Pillars",
      description:
        "Core acts of worship: testimony of faith, prayer, almsgiving, fasting in Ramadan, and pilgrimage to Mecca.",
    },
    {
      name: "Ṣūfism (Taṣawwuf)",
      description:
        "Islamic mysticism focused on inner purification and direct experiential knowledge of God.",
    },
    {
      name: "Iḥsān",
      description:
        "Excellence in faith—worshiping God as though one sees Him, embodying virtue in every act.",
    },
  ],
  christianity: [
    {
      name: "Trinity",
      description:
        "Belief in one God experienced as Father, Son, and Holy Spirit—three persons, one essence.",
    },
    {
      name: "Grace",
      description:
        "Unmerited divine favor that heals human brokenness and empowers spiritual growth.",
    },
    {
      name: "Salvation",
      description:
        "Deliverance from sin and its consequences through the life, death, and resurrection of Jesus Christ.",
    },
    {
      name: "Beatitudes",
      description:
        "Teachings of Jesus in the Sermon on the Mount outlining the attitudes of kingdom living.",
    },
  ],
};

const SPECIFIC_NEEDS = {
  learning: [
    "What is the meaning of life?",
    "How do different religions view the afterlife?",
    "What are the core teachings?",
    "How can I start a spiritual practice?",
  ],
  comfort: [
    "I'm feeling lost and alone",
    "I'm grieving a loss",
    "I'm struggling with anxiety",
    "I need hope and encouragement",
  ],
  guidance: [
    "I'm facing a moral dilemma",
    "I need to make a big life decision",
    "I'm struggling with forgiveness",
    "I want to be a better person",
  ],
  exploration: [
    "Show me something inspiring",
    "What wisdom can you share?",
    "Help me find my path",
    "Surprise me with insight",
  ],
};

const COMFORT_STORIES = {
  judaism: [
    {
      title: "Rabbi Akiva Laughs at the Temple Ruins",
      description:
        "After seeing foxes roam the desolate Holy of Holies, three sages weep but Rabbi Akiva laughs—and then explains how the prophecy of future restoration turns devastation into hope.",
    },
    {
      title: '"Comfort, Comfort My People" (Isaiah 40)',
      description:
        "Midrash on Isaiah's call 'Nachamu Ami' shows God urging double consolation after national tragedy, teaching that words and deeds of care can rekindle collective spirit.",
    },
    {
      title: "Psalm 23 — The Lord Is My Shepherd",
      description:
        "King David's beloved psalm paints God as a shepherd who guides through 'the valley of the shadow of death,' offering enduring reassurance in times of fear.",
    },
  ],
  buddhism: [
    {
      title: "Kisa Gotami and the Mustard Seed",
      description:
        "A grieving mother learns from the Buddha that no household is untouched by death, transforming personal loss into universal compassion.",
    },
    {
      title: "The Second Arrow",
      description:
        "The Buddha compares unavoidable pain with the optional suffering we create by mentally striking ourselves with a 'second arrow,' pointing to mindful acceptance as relief.",
    },
    {
      title: "The Parable of the Raft",
      description:
        "The Buddha likens the Dharma to a raft: essential for crossing turbulent waters but meant to be laid aside once safe on the farther shore.",
    },
  ],
  islam: [
    {
      title: "Surah Yusuf — A Chapter of Consolation",
      description:
        "Joseph's saga of betrayal, patience, and reunion reassures believers that divine wisdom unfolds through hardship.",
    },
    {
      title: "Prophet Ayyub (Job) and Beautiful Patience",
      description:
        "Stripped of health and wealth, Ayyub remains grateful; his eventual healing embodies ṣabr (patience) and Allah's promise that endurance is met with relief.",
    },
    {
      title: 'Surah Ad-Duḥa — "Your Lord Has Not Forsaken You"',
      description:
        "Revealed after a pause in revelation, this short surah lifts the Prophet's spirits and offers timeless comfort to anyone who feels abandoned or anxious.",
    },
  ],
  christianity: [
    {
      title: "Parable of the Lost Sheep",
      description:
        "Jesus depicts a shepherd leaving ninety-nine sheep to rescue one stray, illustrating God's relentless care for every person who feels lost.",
    },
    {
      title: "Parable of the Prodigal Son",
      description:
        "A wayward son returns home expecting rejection but meets a father's embrace, showing unconditional forgiveness and restoration after failure.",
    },
    {
      title: "Jesus Calms the Storm",
      description:
        "Amid a violent squall on the Sea of Galilee, Jesus speaks 'Peace, be still,' turning panic into awe and modeling trust when life's waves threaten.",
    },
  ],
};

const JOURNEY_ARCHETYPES = {
  seeker: {
    id: "seeker",
    title: "The Seeker",
    icon: "🧭",
    description: "I want to find my purpose and meaning",
    fullDescription:
      "You're drawn to the big questions of existence and yearn to discover your unique path in life.",
    wisdom: [
      {
        title: "The Parable of the Mustard Seed (Christianity)",
        description:
          "Small beginnings can lead to extraordinary growth when nurtured with faith and patience.",
      },
      {
        title: "Buddha's Four Noble Truths (Buddhism)",
        description:
          "A roadmap for understanding suffering and finding the path to liberation and peace.",
      },
      {
        title: "Abraham's Journey (Judaism/Islam)",
        description:
          "The call to leave the familiar and trust in a greater purpose, even when the destination is unknown.",
      },
    ],
  },
  contemplative: {
    id: "contemplative",
    title: "The Contemplative",
    icon: "🧘",
    description: "I'm drawn to meditation and inner peace",
    fullDescription:
      "You seek stillness, reflection, and the profound peace that comes from turning inward.",
    wisdom: [
      {
        title: "Be Still and Know (Psalm 46:10)",
        description:
          "In quietude, we discover the divine presence that transcends all earthly concerns.",
      },
      {
        title: "Vipassana Meditation (Buddhism)",
        description:
          "Clear seeing that reveals the impermanent nature of all experiences, bringing deep acceptance.",
      },
      {
        title: "Sufi Breath Prayer (Islam)",
        description:
          "Sacred breathing practices that align the heart with divine remembrance and presence.",
      },
    ],
  },
  connector: {
    id: "connector",
    title: "The Connector",
    icon: "🤝",
    description: "I want to understand how we're all linked",
    fullDescription:
      "You sense the deep interconnectedness of all life and seek to understand our shared humanity.",
    wisdom: [
      {
        title: "Indra's Net (Buddhism)",
        description:
          "A cosmic web where each being reflects all others, showing our fundamental interconnectedness.",
      },
      {
        title: "Ubuntu Philosophy (African Spirituality)",
        description:
          "'I am because we are' - the recognition that our humanity is bound up in one another.",
      },
      {
        title: "Body of Christ (Christianity)",
        description:
          "We are many parts of one body, each unique yet essential to the whole community.",
      },
    ],
  },
  creative: {
    id: "creative",
    title: "The Creative",
    icon: "🎨",
    description: "I find the sacred through beauty and art",
    fullDescription:
      "You discover the divine through creativity, beauty, and the artistic expression of the soul.",
    wisdom: [
      {
        title: "Sacred Geometry (Islamic Art)",
        description:
          "Mathematical patterns in art that reflect the infinite creativity and order of the divine.",
      },
      {
        title: "Bezalel the Craftsman (Judaism)",
        description:
          "God filling an artist with divine spirit to create beauty for sacred purposes.",
      },
      {
        title: "Zen Gardens (Buddhism)",
        description:
          "Artful arrangements of stone and sand that invite contemplation and reveal hidden truths.",
      },
    ],
  },
};

const ARCHETYPE_PRACTICES = {
  seeker: {
    key: "seeker",
    label: "The Seeker",
    religions: {
      judaism: [
        {
          id: "genesis_purpose",
          title: "Purpose in Genesis",
          description:
            "Explore how the creation narrative frames human purpose and responsibility.",
        },
        {
          id: "covenant_calling",
          title: "Covenant & Calling",
          description:
            "Unpack Abraham's journey and what it means to live a life of sacred mission.",
        },
        {
          id: "pirkei_avot_wisdom",
          title: "Pirkei Avot Wisdom",
          description:
            "Seek guidance from timeless ethical teachings on finding meaning.",
        },
      ],
      buddhism: [
        {
          id: "four_noble_truths",
          title: "Four Noble Truths",
          description:
            "Investigate the Buddha's diagnosis of suffering and the path to liberation.",
        },
        {
          id: "eightfold_path_overview",
          title: "Eightfold Path Overview",
          description:
            "Map out a practical roadmap toward a purposeful, awakened life.",
        },
        {
          id: "story_of_siddhartha",
          title: "Story of Siddhartha",
          description:
            "Follow the Buddha's own quest for meaning and how it speaks to yours.",
        },
      ],
      islam: [
        {
          id: "fitra",
          title: "Concept of Fitra",
          description:
            "Discover the Qur'anic view of humanity's innate purpose and goodness.",
        },
        {
          id: "seeking_knowledge",
          title: "Seeking Knowledge (ʿIlm)",
          description:
            "Learn why the pursuit of knowledge is central to a meaningful Muslim life.",
        },
        {
          id: "life_as_test",
          title: "Life as Test & Trust",
          description:
            "Reflect on verses framing life as a sacred trust and opportunity for growth.",
        },
      ],
      christianity: [
        {
          id: "sermon_on_mount",
          title: "Sermon on the Mount",
          description:
            "Examine Jesus' blueprint for purposeful living in the kingdom of God.",
        },
        {
          id: "spiritual_gifts",
          title: "Discovering Spiritual Gifts",
          description:
            "Identify personal callings through New-Testament teachings on vocation.",
        },
        {
          id: "parable_talents",
          title: "Parable of the Talents",
          description:
            "Explore stewardship and purposeful action through this classic parable.",
        },
      ],
    },
  },
  contemplative: {
    key: "contemplative",
    label: "The Contemplative",
    religions: {
      judaism: [
        {
          id: "hitbodedut",
          title: "Hitbodedut Practice",
          description:
            "Experience Rebbe Nachman's method of personal, meditative prayer.",
        },
        {
          id: "shema_meditation",
          title: "Meditation on the Shema",
          description:
            "Use the central prayer to cultivate unity and inner stillness.",
        },
        {
          id: "psalms_contemplation",
          title: "Psalms as Contemplation",
          description:
            "Turn to Tehillim for emotional release and mindful reflection.",
        },
      ],
      buddhism: [
        {
          id: "anapanasati",
          title: "Ānāpānasati (Breath)",
          description:
            "Anchor attention in the breath to develop calm and insight.",
        },
        {
          id: "metta",
          title: "Loving-Kindness (Mettā)",
          description:
            "Cultivate compassion for self and others through this heart practice.",
        },
        {
          id: "zazen",
          title: "Zazen",
          description: "Sit in open awareness following the Zen tradition.",
        },
      ],
      islam: [
        {
          id: "dhikr",
          title: "Dhikr",
          description:
            "Engage in rhythmic remembrance of the Divine for inner peace.",
        },
        {
          id: "salah_reflection",
          title: "Reflective Salah",
          description: "Deepen mindfulness within the five daily prayers.",
        },
        {
          id: "sufi_whirling",
          title: "Sufi Whirling",
          description:
            "Discover meditative movement aimed at union with the Beloved.",
        },
      ],
      christianity: [
        {
          id: "lectio_divina",
          title: "Lectio Divina",
          description:
            "Meditate on Scripture in four gentle, reflective steps.",
        },
        {
          id: "centering_prayer",
          title: "Centering Prayer",
          description:
            "Rest in silent consent to God's presence and action within.",
        },
        {
          id: "gregorian_chant",
          title: "Gregorian Chant",
          description: "Let sacred music open the heart to contemplation.",
        },
      ],
    },
  },
  connector: {
    key: "connector",
    label: "The Connector",
    religions: {
      judaism: [
        {
          id: "tikkun_olam",
          title: "Tikkun Olam",
          description: "Repair the world through social action and justice.",
        },
        {
          id: "shabbat_community",
          title: "Community in Shabbat",
          description:
            "Experience sacred togetherness around the Shabbat table.",
        },
        {
          id: "hillel_rule",
          title: "Hillel's Golden Rule",
          description:
            "Explore Judaism's core ethic of empathy and reciprocity.",
        },
      ],
      buddhism: [
        {
          id: "sangha",
          title: "Value of the Sangha",
          description:
            "Find support and wisdom in the community of practitioners.",
        },
        {
          id: "interbeing",
          title: "Interbeing",
          description:
            "Embrace Thích Nhất Hạnh's teaching on our deep interconnectedness.",
        },
        {
          id: "bodhisattva_ideal",
          title: "Bodhisattva Ideal",
          description: "Commit to awakening for the benefit of all beings.",
        },
      ],
      islam: [
        {
          id: "ummah",
          title: "The Ummah",
          description: "Explore the sense of global Muslim solidarity.",
        },
        {
          id: "zakat_charity",
          title: "Zakat & Sadaqah",
          description:
            "Live out compassion through obligatory and voluntary giving.",
        },
        {
          id: "salam_brotherhood",
          title: "Salām & Brotherhood",
          description:
            "Practice peace and fraternity in everyday interactions.",
        },
      ],
      christianity: [
        {
          id: "body_of_christ",
          title: "Body of Christ",
          description:
            "Understand the Church as a living, interconnected body.",
        },
        {
          id: "love_thy_neighbor",
          title: "Love Thy Neighbor",
          description: "Put Jesus' core commandment into action.",
        },
        {
          id: "acts_community",
          title: "Community in Acts",
          description: "Learn from the radical sharing of the early believers.",
        },
      ],
    },
  },
  creative: {
    key: "creative",
    label: "The Creative",
    religions: {
      judaism: [
        {
          id: "nigunim",
          title: "Chassidic Nigunim",
          description: "Channel the soul through wordless spiritual melodies.",
        },
        {
          id: "micro_calligraphy",
          title: "Micro-Calligraphy",
          description: "See Torah verses transform into intricate visual art.",
        },
        {
          id: "mystical_poetry",
          title: "Jewish Mystical Poetry",
          description:
            "Taste divine longing in medieval piyutim and modern verse.",
        },
      ],
      buddhism: [
        {
          id: "zen_gardens",
          title: "Designing a Zen Garden",
          description: "Create tranquil spaces that mirror inner clarity.",
        },
        {
          id: "mandalas",
          title: "Mandalas",
          description: "Use sacred geometry as a focus for meditation.",
        },
        {
          id: "haiku",
          title: "Haiku Meditation",
          description: "Capture moments of satori in concise poetic form.",
        },
      ],
      islam: [
        {
          id: "arabic_calligraphy",
          title: "Arabic Calligraphy",
          description: "Experience the Qur'an as flowing visual art.",
        },
        {
          id: "rumi_poetry",
          title: "Poetry of Rumi",
          description: "Dive into ecstatic verses on divine love.",
        },
        {
          id: "geometric_tiles",
          title: "Geometric Tile Design",
          description: "Discover God's order through intricate patterns.",
        },
      ],
      christianity: [
        {
          id: "iconography",
          title: "Iconography",
          description: "Pray with images that are windows into the sacred.",
        },
        {
          id: "sacred_music",
          title: "Sacred Music & Hymns",
          description: "Encounter the divine through harmonious sound.",
        },
        {
          id: "stained_glass",
          title: "Stained-Glass Narratives",
          description: "See biblical stories come alive in light and color.",
        },
      ],
    },
  },
};

export default function OnboardingFlow({
  onComplete,
  onSkip,
}: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<string>("");
  const [selectedTradition, setSelectedTradition] = useState<string>("");
  const [selectedNeed, setSelectedNeed] = useState<string>("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");

  const handleNext = () => {
    if (selectedIntent === "exploration") {
      // Exploration has 3 steps: intent -> archetype -> practice
      if (step === 1) {
        setStep(3); // Skip tradition selection
      } else if (step === 3) {
        setStep(4); // Go to practice selection
      } else {
        completeOnboarding();
      }
    } else {
      // Other intents have 3 steps: intent -> tradition -> specific
      if (step < 3) {
        setStep(step + 1);
      } else {
        completeOnboarding();
      }
    }
  };

  const handleBack = () => {
    if (selectedIntent === "exploration") {
      // Exploration flow
      if (step === 4) {
        setStep(3); // Go back to archetype selection
      } else if (step === 3) {
        setStep(1); // Go back to intent selection
      }
    } else {
      // Other intents
      if (step > 1) {
        setStep(step - 1);
      }
    }
  };

  const getRandomTopicFromEachTradition = () => {
    const traditions = [
      "judaism",
      "buddhism",
      "islam",
      "christianity",
    ] as const;
    return traditions.map((tradition) => {
      let topics;
      if (selectedIntent === "learning") {
        topics = SPIRITUAL_TOPICS[tradition];
      } else if (selectedIntent === "comfort") {
        topics = COMFORT_STORIES[tradition];
      } else {
        topics = SPIRITUAL_TOPICS[tradition]; // fallback
      }
      const randomIndex = Math.floor(Math.random() * topics.length);
      return {
        ...topics[randomIndex],
        tradition: tradition.charAt(0).toUpperCase() + tradition.slice(1),
      };
    });
  };

  const getTopicsToShow = () => {
    if (selectedIntent === "learning") {
      if (selectedTradition === "none") {
        return getRandomTopicFromEachTradition();
      } else if (
        selectedTradition &&
        SPIRITUAL_TOPICS[selectedTradition as keyof typeof SPIRITUAL_TOPICS]
      ) {
        return SPIRITUAL_TOPICS[
          selectedTradition as keyof typeof SPIRITUAL_TOPICS
        ];
      }
    } else if (selectedIntent === "comfort") {
      if (selectedTradition === "none") {
        return getRandomTopicFromEachTradition();
      } else if (
        selectedTradition &&
        COMFORT_STORIES[selectedTradition as keyof typeof COMFORT_STORIES]
      ) {
        return COMFORT_STORIES[
          selectedTradition as keyof typeof COMFORT_STORIES
        ];
      }
    } else if (selectedIntent === "exploration") {
      // For exploration, we show journey archetypes instead of tradition-specific content
      return Object.values(JOURNEY_ARCHETYPES);
    }
    return SPECIFIC_NEEDS[selectedIntent as keyof typeof SPECIFIC_NEEDS] || [];
  };

  const getPracticesForArchetype = () => {
    if (
      !selectedArchetype ||
      !ARCHETYPE_PRACTICES[
        selectedArchetype as keyof typeof ARCHETYPE_PRACTICES
      ]
    ) {
      return [];
    }

    const archetype =
      ARCHETYPE_PRACTICES[
        selectedArchetype as keyof typeof ARCHETYPE_PRACTICES
      ];
    const allPractices: Array<{
      id: string;
      title: string;
      description: string;
      tradition: string;
      traditionKey: string;
    }> = [];

    // Combine practices from all traditions for this archetype
    Object.entries(archetype.religions).forEach(([tradition, practices]) => {
      practices.forEach(
        (practice: { id: string; title: string; description: string }) => {
          allPractices.push({
            ...practice,
            tradition: tradition.charAt(0).toUpperCase() + tradition.slice(1),
            traditionKey: tradition,
          });
        }
      );
    });

    return allPractices;
  };

  const completeOnboarding = () => {
    const tags: string[] = [];
    let suggestedModel: ModelName = "PastorGPT"; // Default
    let initialPrompt = "";

    // Add intent tags
    if (selectedIntent === "comfort") tags.push("#sad", "#comfort");
    if (selectedIntent === "learning") tags.push("#learning", "#curious");
    if (selectedIntent === "guidance")
      tags.push("#moral-conflict", "#guidance");
    if (selectedIntent === "exploration") tags.push("#exploring", "#open");

    // Determine model based on tradition or selected practice
    if (selectedIntent === "exploration" && selectedArchetype) {
      // For exploration with practice selection, determine model from the practice's tradition
      const practices = getPracticesForArchetype();
      const selectedPractice = practices.find((p) => p.id === selectedNeed);

      if (selectedPractice) {
        const traditionKey = selectedPractice.traditionKey;
        const tradition = TRADITIONS.find((t) => t.id === traditionKey);
        if (tradition && tradition.model) {
          suggestedModel = tradition.model;
          tags.push(`#${traditionKey}`);
        }
      }
    } else {
      // For other flows, use the selected tradition
      const tradition = TRADITIONS.find((t) => t.id === selectedTradition);
      if (tradition && tradition.model) {
        suggestedModel = tradition.model;
        tags.push(`#${selectedTradition}`);
      } else if (selectedIntent === "comfort") {
        // Default to PastorGPT for comfort if no tradition selected
        suggestedModel = "PastorGPT";
      }
    }

    // Create initial prompt
    if (selectedNeed) {
      if (
        (selectedIntent === "learning" || selectedIntent === "comfort") &&
        (selectedNeed.includes("tradition:") ||
          selectedNeed.includes("name:") ||
          selectedNeed.includes("title:"))
      ) {
        // Handle spiritual topic or comfort story selection
        const topicName =
          selectedNeed.split("name:")[1]?.split(",")[0]?.trim() ||
          selectedNeed.split("title:")[1]?.split(",")[0]?.trim();
        if (topicName) {
          if (selectedIntent === "learning") {
            initialPrompt = `I'd like to learn about ${topicName}. Can you explain this concept and its significance?`;
          } else if (selectedIntent === "comfort") {
            initialPrompt = `I'm going through a difficult time and would find comfort in hearing about ${topicName}. Can you share this story and its meaning?`;
          }
        } else {
          initialPrompt = selectedNeed;
        }
      } else if (
        selectedIntent === "exploration" &&
        selectedNeed.includes("archetype:")
      ) {
        // Handle journey archetype selection
        const archetypeId = selectedNeed
          .split("archetype:")[1]
          ?.split(",")[0]
          ?.trim();
        const archetype = Object.values(JOURNEY_ARCHETYPES).find(
          (a) => a.id === archetypeId
        );
        if (archetype) {
          initialPrompt = `I resonate with being ${archetype.title}. ${archetype.fullDescription} Can you share some wisdom that speaks to this part of my spiritual journey?`;
        } else {
          initialPrompt = selectedNeed;
        }
      } else if (selectedIntent === "exploration" && selectedArchetype) {
        // Handle specific practice selection for exploration
        const practices = getPracticesForArchetype();
        const selectedPractice = practices.find((p) => p.id === selectedNeed);
        const archetype = Object.values(JOURNEY_ARCHETYPES).find(
          (a) => a.id === selectedArchetype
        );

        if (selectedPractice && archetype) {
          initialPrompt = `As ${archetype.title}, I'm drawn to exploring ${selectedPractice.title}. ${selectedPractice.description} Can you guide me in this practice?`;
        } else {
          initialPrompt = selectedNeed;
        }
      } else {
        initialPrompt = selectedNeed;
      }
    } else {
      // Generate a default prompt based on intent
      const intentMap = {
        learning:
          "I'm interested in learning about spiritual wisdom. Where should I start?",
        comfort:
          "I'm going through a difficult time and could use some spiritual comfort.",
        guidance:
          "I'm facing a decision and would appreciate some spiritual guidance.",
        exploration:
          "I'm curious about spirituality. What wisdom can you share with me?",
      };
      initialPrompt =
        intentMap[selectedIntent as keyof typeof intentMap] ||
        "Hello, I'd like to explore spirituality.";
    }

    const userIntent: UserIntent = {
      primaryIntent: selectedIntent as UserIntent["primaryIntent"],
      spiritualTradition: selectedTradition as UserIntent["spiritualTradition"],
      specificNeed: selectedNeed,
      tags,
      suggestedModel,
      initialPrompt,
    };

    onComplete(userIntent);
  };

  const canProceed = () => {
    if (step === 1) return selectedIntent;
    if (step === 2) return selectedTradition;
    if (step === 3) {
      if (selectedIntent === "exploration") {
        return selectedArchetype;
      } else {
        return selectedNeed;
      }
    }
    if (step === 4) return selectedNeed;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6">
      <Card className="w-full max-w-2xl bg-background/90 border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-foreground mr-2" />
              <h2 className="text-xl sm:text-2xl font-light text-foreground">
                Welcome to Sephira
              </h2>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Let&apos;s help you find the right spiritual guidance
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="flex space-x-2">
              {selectedIntent === "exploration"
                ? // 3 steps for exploration: intent, archetype, practice
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 sm:h-2 w-12 sm:w-16 rounded-full transition-colors ${
                        (i === 1 && step >= 1) ||
                        (i === 2 && step >= 3) ||
                        (i === 3 && step >= 4)
                          ? "bg-foreground"
                          : "bg-muted"
                      }`}
                    />
                  ))
                : // 3 steps for other intents
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 sm:h-2 w-12 sm:w-16 rounded-full transition-colors ${
                        i <= step ? "bg-foreground" : "bg-muted"
                      }`}
                    />
                  ))}
            </div>
          </div>

          {/* Question content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[250px] sm:min-h-[300px]"
            >
              {/* Step 1: Intent */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                    What brings you here today?
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {INTENTS.map((intent) => (
                      <button
                        key={intent.id}
                        onClick={() => setSelectedIntent(intent.id)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                          selectedIntent === intent.id
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/20 active:border-foreground/30"
                        }`}
                      >
                        <div className="flex items-start">
                          <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">
                            {intent.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-foreground font-medium text-sm sm:text-base">
                              {intent.label}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm mt-1">
                              {intent.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Tradition */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                    Are you drawn to any particular spiritual tradition?
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {TRADITIONS.map((tradition) => (
                      <button
                        key={tradition.id}
                        onClick={() => setSelectedTradition(tradition.id)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                          selectedTradition === tradition.id
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/20 active:border-foreground/30"
                        }`}
                      >
                        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                          {tradition.icon}
                        </div>
                        <div className="text-foreground text-xs sm:text-sm">
                          {tradition.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Learning Topics or Specific needs */}
              {step === 3 && (
                <div>
                  {selectedIntent === "learning" ? (
                    <div>
                      <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                        {selectedTradition === "none"
                          ? "Here are some fascinating topics from different traditions:"
                          : "Which topic would you like to explore?"}
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {getTopicsToShow().map((topic, index) => (
                          <button
                            key={`${topic.name}-${index}`}
                            onClick={() =>
                              setSelectedNeed(
                                `tradition:${selectedTradition}, name:${topic.name}, description:${topic.description}`
                              )
                            }
                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                              selectedNeed.includes(topic.name)
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/20 active:border-foreground/30"
                            }`}
                          >
                            <div className="text-foreground font-medium text-sm sm:text-base mb-1">
                              {topic.name}
                              {"tradition" in topic && (
                                <span className="text-muted-foreground text-xs ml-2">
                                  ({topic.tradition})
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm">
                              {topic.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : selectedIntent === "comfort" ? (
                    <div>
                      <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                        {selectedTradition === "none"
                          ? "Here are some comforting stories from different traditions:"
                          : "Which story speaks to your heart?"}
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {getTopicsToShow().map((story, index) => (
                          <button
                            key={`${story.title || story.name}-${index}`}
                            onClick={() =>
                              setSelectedNeed(
                                `tradition:${selectedTradition}, title:${story.title || story.name}, description:${story.description}`
                              )
                            }
                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                              selectedNeed.includes(story.title || story.name)
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/20 active:border-foreground/30"
                            }`}
                          >
                            <div className="text-foreground font-medium text-sm sm:text-base mb-1">
                              {story.title || story.name}
                              {"tradition" in story && (
                                <span className="text-muted-foreground text-xs ml-2">
                                  ({story.tradition})
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm">
                              {story.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : selectedIntent === "exploration" ? (
                    <div>
                      <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                        Which spiritual journey archetype resonates with you?
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        {getTopicsToShow().map((archetype, index) => (
                          <button
                            key={`${archetype.id}-${index}`}
                            onClick={() => {
                              setSelectedArchetype(archetype.id);
                              setSelectedNeed(
                                `archetype:${archetype.id}, title:${archetype.title}, description:${archetype.fullDescription}`
                              );
                            }}
                            className={`p-4 sm:p-5 rounded-lg border-2 transition-all text-left ${
                              selectedArchetype === archetype.id
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/20 active:border-foreground/30"
                            }`}
                          >
                            <div className="flex items-start">
                              <span className="text-2xl sm:text-3xl mr-4 flex-shrink-0">
                                {archetype.icon}
                              </span>
                              <div className="min-w-0">
                                <div className="text-foreground font-medium text-base sm:text-lg mb-2">
                                  {archetype.title}
                                </div>
                                <div className="text-muted-foreground text-sm sm:text-base mb-3">
                                  {archetype.description}
                                </div>
                                <div className="text-muted-foreground text-xs sm:text-sm italic">
                                  {archetype.fullDescription}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                        Which of these resonates with you most?
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {SPECIFIC_NEEDS[
                          selectedIntent as keyof typeof SPECIFIC_NEEDS
                        ]?.map((need) => (
                          <button
                            key={need}
                            onClick={() => setSelectedNeed(need)}
                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                              selectedNeed === need
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/20 active:border-foreground/30"
                            }`}
                          >
                            <div className="text-foreground text-sm sm:text-base">
                              {need}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Practice Selection */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                    Which practice would you like to start with?
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {getPracticesForArchetype().map((practice, index) => (
                      <button
                        key={`${practice.id}-${index}`}
                        onClick={() => {
                          setSelectedNeed(practice.id);
                        }}
                        className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                          selectedNeed === practice.id
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/20 active:border-foreground/30"
                        }`}
                      >
                        <div className="text-foreground font-medium text-sm sm:text-base mb-1">
                          {practice.title}
                          <span className="text-muted-foreground text-xs ml-2">
                            ({practice.tradition})
                          </span>
                        </div>
                        <div className="text-muted-foreground text-xs sm:text-sm">
                          {practice.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-6 sm:mt-8">
            <div>
              {(step > 1 && selectedIntent !== "exploration") ||
              (step === 3 && selectedIntent === "exploration") ||
              (step === 4 && selectedIntent === "exploration") ? (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-foreground hover:text-foreground/80 text-sm sm:text-base px-3 sm:px-4"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Back
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="text-muted-foreground hover:text-foreground text-sm sm:text-base px-3 sm:px-4"
                >
                  Skip and Explore
                </Button>
              )}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-foreground text-background hover:bg-foreground/80 disabled:opacity-50 text-sm sm:text-base px-4 sm:px-6"
            >
              {(step === 3 && selectedIntent !== "exploration") || step === 4
                ? "Start Journey"
                : "Next"}
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
