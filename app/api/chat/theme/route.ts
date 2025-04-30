// api/theme/route.ts

export type Theme = {
    name: string
    emoji: string
    color: string
    prompts: string[]
  }
  
  export const THEMES: Theme[] = [
    {
      name: "Compassion",
      emoji: "💗",
      color: "rose-400",
      prompts: [
        "How can I cultivate compassion in my daily interactions?",
        "What does my tradition teach about showing compassion to strangers?",
        "A short practice to open my heart to more compassion?",
        "Story or text that illustrates radical compassion?"
      ]
    },
    {
      name: "Gratitude",
      emoji: "🙏",
      color: "yellow-400",
      prompts: [
        "How can I practice gratitude every morning?",
        "What sacred text speaks about the power of gratitude?",
        "A micro-ritual to deepen my sense of gratitude?",
        "How does gratitude transform my mindset according to my tradition?"
      ]
    },
    {
      name: "Forgiveness",
      emoji: "🕊️",
      color: "emerald-400",
      prompts: [
        "What steps lead to true forgiveness in my tradition?",
        "How can I forgive someone who hurt me deeply?",
        "A brief practice to release resentment?",
        "Why is forgiveness considered healing in spiritual texts?"
      ]
    },
    {
      name: "Courage",
      emoji: "🦁",
      color: "orange-400",
      prompts: [
        "How does my tradition define real courage?",
        "A daily exercise to build spiritual courage?",
        "Which story exemplifies courage in my sacred writings?",
        "How can I face my fears with faith?"
      ]
    },
    {
      name: "Humility",
      emoji: "🌾",
      color: "teal-400",
      prompts: [
        "What does humility look like in action?",
        "How can I practice humility without self-deprecation?",
        "A one-minute reflection on humility?",
        "Which sacred passage teaches about humility?"
      ]
    },
    {
      name: "Wisdom",
      emoji: "📖",
      color: "blue-400",
      prompts: [
        "How can I seek wisdom each day?",
        "Which proverb or verse best captures wisdom?",
        "A daily question to grow in wisdom?",
        "How do faith traditions distinguish knowledge vs. wisdom?"
      ]
    },
    {
      name: "Patience",
      emoji: "⏳",
      color: "indigo-400",
      prompts: [
        "What’s a micro-practice for building patience?",
        "How does my faith teach me to wait patiently?",
        "Which story shows the reward of patience?",
        "How can I turn impatience into mindful waiting?"
      ]
    },
    {
      name: "Hope",
      emoji: "✨",
      color: "pink-400",
      prompts: [
        "How can I nurture hope in difficult times?",
        "What sacred promise speaks to hope?",
        "A short ritual to re-ignite my hope?",
        "How does hope shape my spiritual outlook?"
      ]
    },
    {
      name: "Empathy",
      emoji: "🤝",
      color: "lime-400",
      prompts: [
        "How can I deepen my empathy for others?",
        "What practice builds empathetic listening?",
        "Which text challenges me to feel another’s pain?",
        "A daily task to grow my empathy?"
      ]
    },
    {
      name: "Joy",
      emoji: "🎉",
      color: "amber-400",
      prompts: [
        "How does my tradition celebrate joy?",
        "A 30-second ritual to invite more joy?",
        "Which story overflows with spiritual joy?",
        "How can I sustain joy through challenges?"
      ]
    },
    {
      name: "Peace",
      emoji: "🕊️",
      color: "cyan-400",
      prompts: [
        "What does inner peace mean in my faith?",
        "A breathing exercise for peace?",
        "Which verse offers comfort and peace?",
        "How can I spread peace in my community?"
      ]
    },
    {
      name: "Trust",
      emoji: "🤲",
      color: "violet-400",
      prompts: [
        "How can I deepen my trust in the Divine?",
        "A short reflection on surrender and trust?",
        "Which sacred passage speaks of trust?",
        "How does trust shape courageous action?"
      ]
    },
    {
      name: "Resilience",
      emoji: "🌱",
      color: "green-400",
      prompts: [
        "How does my tradition teach resilience?",
        "A daily mantra to boost resilience?",
        "Which story models spiritual resilience?",
        "How can I transform trials into growth?"
      ]
    },
    {
      name: "Generosity",
      emoji: "🎁",
      color: "purple-400",
      prompts: [
        "How can I practice generosity of spirit?",
        "What small act of giving can I do today?",
        "Which text celebrates selfless giving?",
        "How does generosity enrich my faith journey?"
      ]
    },
    {
      name: "Mindfulness",
      emoji: "🧘",
      color: "sky-400",
      prompts: [
        "A one-minute mindfulness exercise?",
        "How does my tradition define mindfulness?",
        "Which teaching invites me to be present?",
        "How can I bring mindfulness into routine tasks?"
      ]
    },
    {
      name: "Integrity",
      emoji: "⚖️",
      color: "gray-400",
      prompts: [
        "What does integrity demand of me today?",
        "Which text underscores honesty and integrity?",
        "A brief reflection on ethical living?",
        "How can I align actions with beliefs?"
      ]
    },
    {
      name: "Love",
      emoji: "❤️",
      color: "red-400",
      prompts: [
        "How can I embody unconditional love?",
        "Which verse teaches about divine love?",
        "A heart-opening practice for love?",
        "How does love transform relationships?"
      ]
    },
    {
      name: "Healing",
      emoji: "🩹",
      color: "emerald-600",
      prompts: [
        "What practice promotes spiritual healing?",
        "Which story speaks of miraculous healing?",
        "A short ritual for personal healing?",
        "How can I offer healing to others?"
      ]
    },
    {
      name: "Justice",
      emoji: "⚖️",
      color: "yellow-600",
      prompts: [
        "How does my tradition define justice?",
        "What micro-action promotes justice today?",
        "Which text calls for social justice?",
        "How can I balance mercy and justice?"
      ]
    },
    {
      name: "Reflection",
      emoji: "🪞",
      color: "blue-600",
      prompts: [
        "A journaling prompt for self-reflection?",
        "How does reflection deepen my faith?",
        "Which verse invites me to look inward?",
        "How can I build a daily reflection habit?"
      ]
    }
  ]
  