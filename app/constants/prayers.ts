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
  Scripture: "scripture",
  Meditation: "meditation",
  Liturgical: "liturgical",
  Affirmation: "affirmation",
  Chant: "chant",
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
  {
    id: "76",
    faith: Faiths.Christianity,
    category: Categories.Scripture,
    title: 'Rest for the Weary (Matthew 11:28)',
    text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    source: 'https://www.biblegateway.com/passage/?search=Matthew+11%3A28',
    tags: ['burnout', 'stress', 'focus']
  },
  {
    id: "77",
    faith: Faiths.Christianity,
    category: Categories.Scripture,
    title: 'Trust in the Lord (Proverbs 3:5–6)',
    text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways acknowledge Him, and He will make your paths straight.',
    source: 'https://www.biblegateway.com/passage/?search=Proverbs+3%3A5-6',
    tags: ['courage', 'guidance', 'trust']
  },
  {
    id: "78",
    faith: Faiths.Christianity,
    category: Categories.Scripture,
    title: 'The Lord Is Near the Brokenhearted (Psalm 34:18)',
    text: 'The LORD is near to the brokenhearted and saves those who are crushed in spirit.',
    source: 'https://www.biblegateway.com/passage/?search=Psalm+34%3A18',
    tags: ['grief', 'comfort', 'love']
  },
  {
    id: "79",
    faith: Faiths.Christianity,
    category: Categories.Scripture,
    title: 'Never Will I Leave You (Hebrews 13:5)',
    text: '“Never will I leave you; never will I forsake you.”',
    source: 'https://www.biblegateway.com/passage/?search=Hebrews+13%3A5',
    tags: ['loneliness', 'comfort', 'love']
  },
  {
    id: "80",
    faith: Faiths.Christianity,
    category: Categories.Scripture,
    title: 'Rejoice in This Day (Psalm 118:24)',
    text: 'This is the day the LORD has made; let us rejoice and be glad in it.',
    source: 'https://www.biblegateway.com/passage/?search=Psalm+118%3A24',
    tags: ['gratitude', 'joy', 'focus']
  },
  {
    id: "81",
    faith: Faiths.Islam,
    category: Categories.Liturgical,
    title: 'Dua for Relief from Anxiety and Sorrow',
    text: 'اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَالحَزَنِ، وَالعَجزِ وَالكَسَلِ، وَالبُخلِ وَالجُبنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dhala'id-dayni wa ghalabatir-rijaal.",
    translation: 'O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from miserliness and cowardice, and from being overwhelmed by debt and overpowered by others.',
    source: 'https://sunnah.com/nasai:5537',
    language: 'Arabic',
    tags: ['stress', 'anxiety', 'grief']
  },
  {
    id: "82",
    faith: Faiths.Islam,
    category: Categories.Scripture,
    title: 'Prayer for Strength and Mercy (Qur’an 2:286)',
    text: 'رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ، وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا',
    transliteration: "Rabbana wa la tuhammilna ma la taqata lana bih, wa'fu anna, waghfir lana, warhamna.",
    translation: 'Our Lord, do not burden us with more than we have strength to bear. Pardon us, forgive us, and have mercy on us.',
    source: 'https://quran.com/2/286',
    language: 'Arabic',
    tags: ['burnout', 'forgiveness', 'mercy']
  },
  {
    id: "83",
    faith: Faiths.Islam,
    category: Categories.Meditation,
    title: 'Dua for Guidance (Istikhara)',
    text: 'O Allah, I seek Your guidance in my decision, for You know and I do not. Choose the best path for me, grant me benefit in it, and make me content with the outcome.',
    tags: ['courage', 'guidance', 'trust']
  },
  {
    id: "84",
    faith: Faiths.Islam,
    category: Categories.Meditation,
    title: 'Dua for Community and Belonging',
    text: 'O Allah, unite our hearts and let no one among us feel alone. Remove prejudice from our midst and make us instruments of Your mercy, so that everyone finds acceptance and love in our community.',
    tags: ['loneliness', 'community', 'love']
  },
  {
    id: "85",
    faith: Faiths.Islam,
    category: Categories.Meditation,
    title: 'Dua of Gratitude for Blessings',
    text: 'O Allah, help me remember You and give thanks for Your countless blessings. I praise You for the small and great gifts in my life, and I am grateful for every mercy You have bestowed upon me.',
    tags: ['gratitude', 'love', 'focus']
  },
  {
    id: "86",
    faith: Faiths.Judaism,
    category: Categories.Liturgical,
    title: 'Hashkiveinu (Prayer for Peaceful Rest)',
    text: 'הַשְׁכִּיבֵנוּ יְיָ אֱלֹהֵֽינוּ לְשָׁלוֹם, וְהַעֲמִידֵֽנוּ מַלְכֵּֽנוּ לְחַיִּים. וּפְרוֹשׂ עָלֵֽינוּ סֻכַּת שְׁלוֹמֶֽךָ.',
    transliteration: "Hashkiveinu Adonai Eloheinu l'shalom, v'ha'amideinu Malkeinu l'chayyim. Ufros aleinu sukkat sh'lomekha.",
    translation: 'Cause us, O Lord our God, to lie down in peace, and raise us up to life. Spread over us Your shelter of peace.',
    source: 'https://www.sefaria.org/sheets/29587?lang=en',
    language: 'Hebrew',
    tags: ['burnout', 'stress', 'comfort']
  },
  {
    id: "87",
    faith: Faiths.Judaism,
    category: Categories.Scripture,
    title: "Chazak v'Ematz (Joshua 1:9)",
    text: 'חֲזַק וֶאֱמָץ, אַל־תַּעֲרֹץ וְאַל־תֵּחָת, כִּי עִמְּךָ יְיָ אֱלֹהֶיךָ בְּכֹל אֲשֶׁר תֵּלֵךְ.',
    transliteration: "Chazak ve'ematz, al ta'arotz v'al teichat, ki imkha Adonai Eloheikha b'khol asher teileikh.",
    translation: 'Be strong and courageous; do not be terrified or dismayed, for the Lord your God is with you wherever you go.',
    source: 'https://www.sefaria.org/Joshua.1.9',
    language: 'Hebrew',
    tags: ['courage', 'fear', 'strength']
  },
  {
    id: "88",
    faith: Faiths.Judaism,
    category: Categories.Meditation,
    title: 'Prayer of Embracing All Identities',
    text: "Eloheinu v'Elohei avoteinu v'imoteinu (Our God and God of our ancestors), You have created each of us b'tzelem Elohim, in Your image. Help us open our hearts to everyone, no matter who they are or whom they love, so that all Your children feel cherished and at home.",
    tags: ['love', 'belonging', 'community']
  },
  {
    id: "89",
    faith: Faiths.Judaism,
    category: Categories.Liturgical,
    title: 'Shehecheyanu (Gratitude for the Moment)',
    text: 'בָּרוּךְ אַתָּה יְיָ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁהֶחֱיָנוּ וְקִיְּמָנוּ וְהִגִּיעָנוּ לַזְּמַן הַזֶּה.',
    transliteration: "Baruch atah Adonai Eloheinu, Melech ha'olam, shehecheyanu, v'kiy'manu, v'higiyanu lazman hazeh.",
    translation: 'Blessed are You, Adonai our God, Ruler of the universe, who has kept us alive, sustained us, and enabled us to reach this moment.',
    source: 'https://www.chabad.org/library/article_cdo/aid/91120/jewish/Shehecheyanu.htm',
    language: 'Hebrew',
    tags: ['gratitude', 'joy', 'thankfulness']
  },
  {
    id: "90",
    faith: Faiths.Judaism,
    category: Categories.Meditation,
    title: 'Prayer for Healing the Earth (Tikkun Olam)',
    text: 'Ribbono Shel Olam (Master of the Universe), grant us the strength to help heal our planet. When we feel despair at the harm done to the earth, remind us of our sacred responsibility in tikkun olam — repairing the world. Inspire us to act with wisdom and courage for the sake of future generations.',
    tags: ['climate', 'anxiety', 'hope']
  },
  {
    id: "91",
    faith: Faiths.General,
    category: Categories.Meditation,
    title: 'Loving-Kindness Meditation (Metta)',
    text: 'May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease and be free from suffering.',
    tags: ['love', 'compassion', 'stress']
  },
  {
    id: "92",
    faith: Faiths.General,
    category: Categories.Meditation,
    title: 'Meditation on Perception (Epictetus)',
    text: 'People are disturbed not by things, but by the view they take of them.',
    source: 'http://classics.mit.edu/Epictetus/epicench.html',
    tags: ['stress', 'focus', 'perspective', 'stoicism']
  },
  {
    id: "93",
    faith: Faiths.General,
    category: Categories.Affirmation,
    title: 'Digital Detox Affirmation',
    text: 'I set aside my devices and the online noise to find rest. In this digital age, I give myself permission to unplug and be present in the quiet moment.',
    tags: ['burnout', 'focus', 'stress']
  },
  {
    id: "94",
    faith: Faiths.General,
    category: Categories.Affirmation,
    title: 'Affirmation for Rest and Renewal',
    text: 'I am more than my productivity. I give myself permission to slow down, to rest, and to heal. Taking care of myself is both necessary and good.',
    tags: ['burnout', 'stress', 'healing']
  },
  {
    id: "95",
    faith: Faiths.General,
    category: Categories.Affirmation,
    title: 'Affirmation of Belonging',
    text: 'I am worthy of love and belonging. I do not have to change who I am or whom I love to be accepted. I celebrate myself openly and know that I matter in this world.',
    tags: ['love', 'belonging', 'loneliness']
  },
  {
    id: "96",
    faith: Faiths.General,
    category: Categories.Affirmation,
    title: 'Affirmation for Courageous Decisions',
    text: 'I have the courage and clarity to make the choices that are right for me. I will not let fear decide my future. I trust myself to walk the path that aligns with my values.',
    tags: ['courage', 'fear', 'trust']
  },
  {
    id: "97",
    faith: Faiths.General,
    category: Categories.Meditation,
    title: 'Meditation for Climate Anxiety',
    text: 'When I feel overwhelmed by climate news, I pause and take a deep breath. I remember that even small actions make a difference. I ground myself in hope, and commit to caring for the earth one day at a time.',
    tags: ['climate', 'anxiety', 'hope']
  },
  {
    id: "98",
    faith: Faiths.General,
    category: Categories.Affirmation,
    title: 'Affirmation of Letting Go',
    text: 'I release the burden of anger and resentment. I forgive others and myself — not to excuse hurtful actions, but to free my heart from the past. I move forward with peace and compassion.',
    tags: ['forgiveness', 'healing', 'love']
  },
  {
    id: "99",
    faith: Faiths.General,
    category: Categories.Affirmation,
    title: "Affirmation of Gratitude",
    text: "I take a moment to appreciate the small blessings around me. I am thankful for simple things — a kind word, a warm meal, a new day. In gratitude, I find contentment and peace.",
    tags: ["gratitude", "joy", "focus"],
  },
  {
    id: "100",
    faith: Faiths.General,
    category: Categories.Chant,
    title: "Mantra of Compassion (Om Mani Padme Hum)",
    text: "ॐ मणि पद्मे हूँ",
    transliteration: "Om Mani Padme Hum",
    translation: "“Hail to the Jewel in the Lotus,” a mantra for universal compassion.",
    language: "Sanskrit",
    tags: ['love', 'compassion', 'focus']
  }
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
  scripture: [],
  meditation: [],
  liturgical: [],
  affirmation: [],
  chant: [],
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
