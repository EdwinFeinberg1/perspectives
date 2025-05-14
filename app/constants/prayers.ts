// src/data/prayers.ts

export const Faiths = {
  Judaism: "judaism",
  Islam: "islam",
  Christianity: "christianity",
  General: "general",
} as const;
export type Faith = (typeof Faiths)[keyof typeof Faiths];

export const Categories = {
  Morning: "morning",
  Healing: "healing",
  Gratitude: "gratitude",
  General: "general", // catch-all
  Wealth: "wealth",
  Health: "health",
  Discernment: "discernment",
  AnyTime: "any_time",
} as const;
export type Category = (typeof Categories)[keyof typeof Categories];

export interface Prayer {
  id: string;
  faith: Faith;
  category: Category;
  title: string;
  text: string;
  transliteration?: string;
  translation?: string;
  tags?: string[];
  source?: string; // e.g., "Psalm 23" or URL
  language?: string; // ISO, if not implied
  audioUrl?: string; // optional TTS / chant
}
/*──────────────────────  P R A Y E R   D A T A  ──────────────────────*/

export const prayers = [
  /* ─────────────  J U D A I S M  ───────────── */
  {
    id: "judaism_modeh_ani",
    faith: Faiths.Judaism,
    category: Categories.Morning,
    title: "Modeh Ani",
    text: "מודה אני לפניך מלך חי וְקָיָם, שהחזרת בי נשמתי בחמלה – רבה אמונתך׃",
    transliteration: `Modeh ani lefanecha, Melech chai v'kayam; she-hechezarta bi nishmati b'chemlah—rabbah emunatecha.`,
    translation:
      "I give thanks before You, living and eternal King, for You have mercifully restored my soul within me; Your faithfulness is great.",
    tags: ["morning", "gratitude"],
  },
  {
    id: "judaism_mi_sheberach",
    faith: Faiths.Judaism,
    category: Categories.Healing,
    title: "Mi Sheberach (Prayer for Healing)",
    text: "May the One who blessed our ancestors, Abraham, Isaac and Jacob, Sarah, Rebecca, Rachel and Leah, bless and heal <NAME>. May the Holy One send them a complete healing of body and spirit, swiftly and soon, and let us say, Amen.",
    translation:
      "May the One who blessed our ancestors—Abraham, Isaac and Jacob; Sarah, Rebecca, Rachel and Leah—bless and heal those who are ill: <NAME>. May the Holy Blessed One grant them a complete recovery of body and spirit, swiftly and mercifully. We praise You, God, who heals the sick, and let us say: Amen.",
    tags: ["healing"],
  },
  {
    id: "judaism_birkat_hamazon",
    faith: Faiths.Judaism,
    category: Categories.Gratitude,
    title: "Birkat HaMazon (Grace After Meals – short)",
    text: "ברוך אתה ה׳ אלוהינו מלך העולם, הזן את העולם כולו בטובו בחן בחסד וברחמים. ה׳ טוב לכל, וברכתו על כל מעשיו. זן ומפרנס לכל חי, מלא רחמים. הזן את עמו ישראל בכל יום וברוך אתה ה׳ הזן את הכל.",
    translation:
      "Blessed are You, Lord our God, King of the universe, Who nourishes the entire world with goodness, grace, kindness and mercy. The Lord is good to all, and His compassion embraces all His works. He sustains and feeds all living beings with abundant mercy. Do not let us lack, Lord our God, for ever and ever; for You are the Fountain of nourishment for all. Blessed are You, Lord, Who nourishes all.",
    tags: ["gratitude", "after_meal"],
  },

  /* ─────────────  I S L A M  ───────────── */
  {
    id: "islam_fatiha",
    faith: Faiths.Islam,
    category: Categories.General,
    title: "Sūrah Al-Fātiḥah",
    text: `بِسْمِ ٱللَّٰهِ الرَّحْمَـٰنِ الرَّحِيمِ
ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَالَمِينَ
الرَّحْمَـٰنِ الرَّحِيمِ
مَـٰلِكِ يَوْمِ ٱلدِّينِ
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
ٱهْدِنَا الصِّرَاطَ ٱلْمُسْتَقِيمَ
صِرَاطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ
غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّالِّينَ.`,
    transliteration: `Bismillāhi r-raḥmāni r-raḥīm
Al-ḥamdu lillāhi rabbi l-'ālamīn
Ar-raḥmāni r-raḥīm
Māliki yawmi d-dīn
'Iyyāka na'budu wa 'iyyāka nasta'īn
Ihdinā ṣ-ṣirāṭa l-mustaqīm
Ṣirāṭa l-laḏīna an'amta 'alayhim
ġayri l-maġḍūbi 'alayhim walā ḍ-ḍālīn.`,
    translation: `In the name of Allah, the Entirely Merciful, the Especially Merciful.
[All] praise is due to Allah, Lord of the worlds—
the Entirely Merciful, the Especially Merciful,
Sovereign of the Day of Recompense.
It is You we worship and You we ask for help.
Guide us to the straight path—
the path of those upon whom You have bestowed favor,
not of those who have evoked [Your] anger or of those who are astray.`,
    tags: ["recitation", "any_time"],
  },
  {
    id: "islam_dua_morning",
    faith: Faiths.Islam,
    category: Categories.Morning,
    title: "Morning Duʿāʾ",
    text: `اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.`,
    translation: `O Allah, by You we enter the morning and by You we enter the evening;
by You we live and by You we die, and to You is the resurrection.`,
    tags: ["morning"],
  },
  {
    id: "islam_dua_healing",
    faith: Faiths.Islam,
    category: Categories.Healing,
    title: "Duʿāʾ for Healing",
    text: "أَسْأَلُ اللهَ العَظِيمَ رَبَّ العَرْشِ العَظِيمِ أَنْ يَشْفِيَكَ.",
    translation:
      "I ask Allah the Mighty, Lord of the Mighty Throne, to cure you.",
    tags: ["healing"],
  },

  /* ─────────────  C H R I S T I A N I T Y  ───────────── */
  {
    id: "christian_lords_prayer",
    faith: Faiths.Christianity,
    category: Categories.General,
    title: "The Lord's Prayer",
    text: "Our Father, who art in heaven, hallowed be Thy name … for ever and ever. Amen.",
    tags: ["any_time"],
  },
  {
    id: "christian_morning_prayer",
    faith: Faiths.Christianity,
    category: Categories.Morning,
    title: "Simple Morning Prayer",
    text: "O Lord, grant me to greet this coming day in peace. Help me in all things to rely upon Your holy will … Amen.",
    tags: ["morning"],
  },
  {
    id: "christian_prayer_healing",
    faith: Faiths.Christianity,
    category: Categories.Healing,
    title: "Prayer for Healing",
    text: "Gracious God, in You alone is health. Send Your healing power to <NAME>. Restore them in body and spirit, that they may praise Your name. Amen.",
    tags: ["healing"],
  },

  /* ─────────────  G E N E R A L  ───────────── */
  {
    id: "general_health",
    faith: Faiths.General,
    category: Categories.Health,
    title: "Prayer for Health",
    text: "Source of Life, fill me with strength and renew every cell within me. May my body mend, and my spirit rise in hope.",
  },
  {
    id: "general_wealth",
    faith: Faiths.General,
    category: Categories.Wealth,
    title: "Prayer for Prosperity",
    text: "Infinite Provider, guide my hands and mind toward honest gain. Let abundance flow so I may bless others in return.",
  },
  {
    id: "general_discernment",
    faith: Faiths.General,
    category: Categories.Discernment,
    title: "Prayer for Discernment",
    text: "Light of Wisdom, clear the noise around me; help me see the path that aligns with truth and love.",
  },
] as const satisfies readonly Prayer[];
/*──────────────────────  H E L P E R S  ──────────────────────*/

// Cheap lookup maps so UI never filters manually
export const prayersById = Object.fromEntries(
  prayers.map((p) => [p.id, p])
) as Record<Prayer["id"], (typeof prayers)[number]>;

export const prayersByFaith: Record<Faith, Prayer[]> = {
  judaism: [],
  islam: [],
  christianity: [],
  general: [],
};
prayers.forEach((p) => prayersByFaith[p.faith].push(p));

export const prayersByCategory: Record<Category, Prayer[]> = {
  morning: [],
  healing: [],
  gratitude: [],
  general: [],
  wealth: [],
  health: [],
  discernment: [],
  any_time: [],
};
prayers.forEach((p) => prayersByCategory[p.category].push(p));

/*────────────  Example consumers  ────────────*/

// get all morning Jewish prayers:
export const getPrayers = {
  byFaith: (faith: Faith) => prayersByFaith[faith],
  byCategory: (cat: Category) => prayersByCategory[cat],
  morningJewish: () =>
    prayersByFaith.judaism.filter((p) => p.category === Categories.Morning),
};
