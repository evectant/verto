// AI Mode for generating Latin phrases via Anthropic API

// Configuration
const AI_MODEL = "claude-opus-4-5-20251101";

const AI_API_URL = "https://api.anthropic.com/v1/messages";
const AI_PHRASE_COUNT = 30;
const AI_THINKING_BUDGET = 4096;

// 37 Basic Plots (based on Georges Polti's dramatic situations)
const BASIC_PLOTS = [
  "Supplication: Someone who needs help, usually due to the antagonist.",
  "Deliverance: Rescuing another person from danger or captivity.",
  "Recovery of a lost one: Finding someone who was lost, without necessarily requiring rescue.",
  "Loss of loved ones: Dealing with the death or departure of those close to the protagonist.",
  "Abduction: Kidnapping and the negotiation or rescue that follows.",
  "Crime pursued by vengeance: Revenge taken into the protagonist's own hands.",
  "Vengeance taken for kin upon kin: Revenge involving family members, with conflict over blood ties.",
  "Enmity of kin: Hatred or heated disagreement between relatives; a family feud.",
  "Rivalry of kin: Sibling rivalry or competition between family members.",
  "Crimes of love: Deliberate crimes of passion.",
  "Involuntary crimes of love: Unintentional transgressions, such as unknowingly incestuous relationships.",
  "Murderous adultery: A love triangle where one or more parties are married, ending in death.",
  "Adultery: A love triangle involving married parties, without murder.",
  "Slaying of kin unrecognized: Killing a rival who turns out to be a family member.",
  "Self-sacrifice for an ideal: Giving up something precious for a principle or belief.",
  "Self-sacrifice for kin: Sacrificing for family, from working overtime to taking a bullet.",
  "All sacrificed for passion: Giving up everything for love or what feels like love.",
  "Necessity of sacrificing loved ones: Choosing between loved ones or betraying one for others' protection.",
  "Discovery of the dishonor of a loved one: Learning of a loved one's shameful actions.",
  "Obstacles to love: Lovers overcoming barriers, or the tragedy of their failure.",
  "An enemy loved: Falling for someone who is also an adversary.",
  "Mistaken jealousy: Acting on incorrect suspicions of betrayal and facing consequences.",
  "Erroneous judgement: Action taken based on incorrect suspicion or wrongful accusation.",
  "Pursuit: Hunting down a fugitive or chasing someone for any reason.",
  "Disaster: Anticipation before or survival after a natural or human-inflicted catastrophe.",
  "Falling prey to cruelty or misfortune: Becoming a victim and finding a way out.",
  "Revolt: Overthrowing authority, mutiny, or taking a stand against the status quo.",
  "Daring enterprise: An adventure story, often involving a quest.",
  "The enigma: A mystery or mysterious person leading to another plot strand.",
  "Obtaining: Facing obstacles while trying to attain something valuable.",
  "Madness: Exploring insanity, whether it claims a victim or blurs the line with sanity.",
  "Fatal imprudence: A character's naivete or carelessness leading to drastic consequences.",
  "Rivalry of superior versus inferior: A weaker character facing a stronger rival or former mentor.",
  "Ambition: From rags to riches, or greed and its consequences.",
  "Conflict with a god: Mortals versus immortals, superpowers, or superior beings.",
  "Remorse: Regret over past actions and exploring the motivations behind them.",
  "Mistaken identity: Being mistaken for someone else, with comedic or tragic results.",
];

// LocalStorage keys
const API_KEY_STORAGE_KEY = "verto_anthropic_api_key";
const AI_PHRASES_STORAGE_KEY = "verto_ai_phrases";

// Tense name mapping for the LLM prompt
const TENSE_NAMES = {
  present: "present indicative active",
  perfect: "perfect indicative active",
  future: "future indicative active",
};

// Get stored API key
function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

// Save API key to localStorage
function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

// Get stored AI phrases
function getAIPhrases() {
  const stored = localStorage.getItem(AI_PHRASES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

// Save AI phrases to localStorage
function saveAIPhrases(phrases) {
  localStorage.setItem(AI_PHRASES_STORAGE_KEY, JSON.stringify(phrases));
}

// Sample up to n random items from an array
function sampleArray(array, n) {
  if (array.length <= n) {
    return [...array];
  }
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

// Sample nouns from selected declensions, distributed equally
function sampleNouns(selectedDeclensions, nounCount) {
  const nounsPerDeclension = Math.ceil(nounCount / selectedDeclensions.length);
  const nouns = [];
  for (const declension of selectedDeclensions) {
    const declNouns = nounDatabase[declension];
    if (declNouns) {
      const sampled = sampleArray(declNouns, nounsPerDeclension);
      for (const noun of sampled) {
        nouns.push(`${noun.la} (${noun.en})`);
      }
    }
  }
  return nouns.sort();
}

// Sample verbs from selected conjugations, distributed equally
function sampleVerbs(selectedConjugations, verbCount) {
  const verbsPerConjugation = Math.ceil(verbCount / selectedConjugations.length);
  const verbs = [];
  for (const conjugation of selectedConjugations) {
    const conjVerbs = verbDatabase[conjugation];
    if (conjVerbs) {
      const sampled = sampleArray(conjVerbs, verbsPerConjugation);
      for (const verb of sampled) {
        const construction = verb.construction ? `, + ${verb.construction}.` : "";
        verbs.push(`${verb.la} (${verb.en}${construction})`);
      }
    }
  }
  return verbs.sort();
}

// Sample adjectives from both declension groups, distributed equally
function sampleAdjectives(adjectiveCount) {
  const adjectivesPerGroup = Math.ceil(adjectiveCount / 2);
  return [
    ...sampleArray(adjectiveDatabase.declension12, adjectivesPerGroup),
    ...sampleArray(adjectiveDatabase.declension3, adjectivesPerGroup),
  ]
    .map((adj) => `${adj.la} (${adj.en})`)
    .sort();
}

// Build the prompt for the AI
function buildPrompt(vocabulary, selectedTenses, pronounsEnabled, adjectivesEnabled, adjectiveCount, count) {
  const tenseList = selectedTenses.map((t) => TENSE_NAMES[t] || t).join(" and ");

  let pronounRules = "";
  if (pronounsEnabled) {
    pronounRules = `- Use pronouns often, including all three persons, reflexive pronouns, and possessive adjectives.`;
  }

  let adjectiveRules = "- Do NOT use adjectives (except possessives) or adverbs.";
  if (adjectivesEnabled) {
    const adjectives = sampleAdjectives(adjectiveCount);
    adjectiveRules = `- Use ONLY these adjectives: ${adjectives.join(", ")}.
- Do NOT use adverbs.`;
  }

  const plot = BASIC_PLOTS[Math.floor(Math.random() * BASIC_PLOTS.length)];
  const endings = ["a happy ending", "an unhappy ending", "an ambiguous ending"];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  const storyInstruction = ` These sentences should form a coherent story with ${ending}, based on the following plot: "${plot}". Include some direct speech to exercise 1st and 2nd person grammar.`;

  return `Generate ${count} Latin sentences with English translations for language learning.${storyInstruction}

Follow the Latin vocabulary and grammar rules below VERY strictly. Translate the Latin faithfully; prioritize accuracy over fluency.

Latin vocabulary rules (use ONLY these words, no exceptions):
- Nouns: ${vocabulary.nouns.join(", ")}.
- Verbs: ${vocabulary.verbs.join(", ")}.
- Prepositions: ${PREPOSITIONS.join(", ")}.
${pronounRules}
${adjectiveRules}
- Exercise as much of this vocabulary as possible.
- NEVER use unlisted words.

Latin grammar rules:
- Use ONLY these tenses: ${tenseList}. Distribute tenses roughly equally across the sentences.
- Exercise as many noun cases as possible.
- When using nouns with ambiguous number, always indicate number in the ENGLISH translation in parentheses: "people (sg.)" or "people (pl.)". Never add these annotations to the Latin.
- When using nouns with ambiguous gender, always indicate gender in the ENGLISH translation in parentheses: "friend (f.)" or "friend (m.)". Never add these annotations to the Latin.
- When using "you", "your", "yours", "yourself", always indicate number in the ENGLISH translation in parentheses: "you (sg.)" or "you (pl.)". Never add these annotations to the Latin.
- Use "suus", "sua", "suum", etc. ONLY when the possessor is the grammatical subject. Use the genitive ("eius", "eōrum", "eārum", etc.) when the possessor is NOT the subject.

Format rules:
- Return ONLY a JSON array: [{"en": "...", "la": "..."}].
- Use macrons and proper punctuation.`;
}

// Call the Anthropic API with a prompt and parse the JSON response
async function callAI(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key not set");
  }

  const requestBody = {
    model: AI_MODEL,
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: AI_THINKING_BUDGET,
    },
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  console.log("AI Request:", requestBody);

  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  console.log("AI Response:", data);

  const textBlock = data.content.find((block) => block.type === "text");
  const content = textBlock?.text;

  if (!content) {
    throw new Error("No content in API response");
  }

  // Parse the JSON response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("No JSON array found in response");
  }

  const phrases = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(phrases)) {
    throw new Error("Response is not an array");
  }

  for (const phrase of phrases) {
    if (typeof phrase.en !== "string" || typeof phrase.la !== "string") {
      throw new Error("Invalid phrase structure");
    }
  }

  return phrases;
}

// Generate story phrases via API
async function generateAIPhrases(selectedDeclensions, selectedConjugations, selectedTenses, pronounsEnabled, adjectivesEnabled, nounCount, verbCount, adjectiveCount) {
  const nouns = sampleNouns(selectedDeclensions, nounCount);
  const verbs = sampleVerbs(selectedConjugations, verbCount);

  if (nouns.length === 0) {
    throw new Error("No nouns available with selected declensions");
  }
  if (verbs.length === 0) {
    throw new Error("No verbs available with selected conjugations");
  }

  const prompt = buildPrompt({ nouns, verbs }, selectedTenses, pronounsEnabled, adjectivesEnabled, adjectiveCount, AI_PHRASE_COUNT);
  return callAI(prompt);
}

// Build prompt for agreement practice mode
function buildAgreementPrompt(nouns, adjectives, count) {
  return `Generate ${count} Latin agreement exercises for language learning.

Each exercise is an adjective-noun phrase that must agree in case, number, and gender. Use ALL FIVE CASES:

1. NOMINATIVE (nom.): subject phrases - "great city", "strong men"
2. GENITIVE (gen.): possession phrases - "of great city", "of strong men"
3. DATIVE (dat.): indirect object phrases - "to/for great city", "to/for strong men"
4. ACCUSATIVE (acc.): with prepositions - "into great city", "through strong men"
5. ABLATIVE (abl.): with prepositions - "in great city", "with strong men"

Example outputs:
- English: "great city (nom.)" → Latin: "urbs magna"
- English: "of strong men (gen.)" → Latin: "virōrum fortium"
- English: "to/for good girl (dat.)" → Latin: "puellae bonae"
- English: "through deep water (acc.)" → Latin: "per aquam altam"
- English: "with good girl (abl.)" → Latin: "cum puellā bonā"

Rules:
- Use ONLY these nouns: ${nouns.join(", ")}.
- Use ONLY these adjectives: ${adjectives.join(", ")}.
- For acc. and abl., use common Latin prepositions (ad, in, per, cum, ex, sine, etc.).
- Distribute exercises roughly equally across all 5 cases.
- Vary the numbers: use both singular and plural forms.
- Vary the genders: use masculine, feminine, and neuter nouns.
- The adjective must correctly agree with the noun in case, number, and gender.
- Use macrons on all long vowels.
- Use these case abbreviations: nom., gen., dat., acc., abl.

Format rules:
- Return ONLY a JSON array: [{"en": "...", "la": "..."}].
- For nom./gen./dat.: English is "<adj> <noun> (case)" or "of/to/for <adj> <noun> (case)", Latin is "<noun> <adj>"
- For acc./abl.: English is "<prep meaning> <adj> <noun> (case)", Latin is "<prep> <noun> <adj>"`;
}

// Generate agreement practice phrases via API
async function generateAgreementPhrases(selectedDeclensions, nounCount, adjectiveCount) {
  const nouns = sampleNouns(selectedDeclensions, nounCount);
  const adjectives = sampleAdjectives(adjectiveCount);

  if (nouns.length === 0) {
    throw new Error("No nouns available with selected declensions");
  }

  const prompt = buildAgreementPrompt(nouns, adjectives, AI_PHRASE_COUNT);
  return callAI(prompt);
}

// Vocabulary mode: English -> Latin + declension/conjugation
// No AI - samples based on count settings
function generateVocabularyPhrases(selectedDeclensions, selectedConjugations, adjectivesEnabled, nounCount, verbCount, adjectiveCount) {
  const phrases = [];

  // Map declension keys to numbers
  const declensionNumbers = {
    declension1: "1",
    declension2: "2",
    declension3: "3",
    declension4: "4",
    declension5: "5",
  };

  // Map conjugation keys to numbers
  const conjugationNumbers = {
    conj1: "1",
    conj2: "2",
    conj3: "3",
    conj3io: "3io",
    conj4: "4",
    irregular: "irreg",
  };

  // Add nouns (nominative form), distributed across declensions
  if (selectedDeclensions.length > 0) {
    const nounsPerDeclension = Math.ceil(nounCount / selectedDeclensions.length);
    for (const declension of selectedDeclensions) {
      const declNouns = nounDatabase[declension];
      if (declNouns) {
        const declNum = declensionNumbers[declension];
        const sampled = sampleArray(declNouns, nounsPerDeclension);
        for (const noun of sampled) {
          phrases.push({
            en: `${noun.en} (noun)`,
            la: `${noun.la} ${declNum}${noun.gender}`,
          });
        }
      }
    }
  }

  // Add verbs (infinitive form), distributed across conjugations
  if (selectedConjugations.length > 0) {
    const verbsPerConjugation = Math.ceil(verbCount / selectedConjugations.length);
    for (const conjugation of selectedConjugations) {
      const conjVerbs = verbDatabase[conjugation];
      if (conjVerbs) {
        const conjNum = conjugationNumbers[conjugation];
        const sampled = sampleArray(conjVerbs, verbsPerConjugation);
        for (const verb of sampled) {
          phrases.push({
            en: `${verb.en} (verb)`,
            la: `${verb.la} ${conjNum}`,
          });
        }
      }
    }
  }

  // Add adjectives (nominative masculine singular), distributed across groups
  if (adjectivesEnabled) {
    const adjectivesPerGroup = Math.ceil(adjectiveCount / 2);
    const sampled12 = sampleArray(adjectiveDatabase.declension12, adjectivesPerGroup);
    const sampled3 = sampleArray(adjectiveDatabase.declension3, adjectivesPerGroup);
    for (const adj of sampled12) {
      phrases.push({
        en: `${adj.en} (adj.)`,
        la: `${adj.la} 12`,
      });
    }
    for (const adj of sampled3) {
      phrases.push({
        en: `${adj.en} (adj.)`,
        la: `${adj.la} 3`,
      });
    }
  }

  return phrases;
}
