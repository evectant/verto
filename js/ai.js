// AI Mode for generating Latin phrases via Anthropic API

// Configuration
const AI_MODEL = "claude-opus-4-5-20251101";
const AI_API_URL = "https://api.anthropic.com/v1/messages";
const AI_PHRASE_COUNT = 30;
const WORDS_PER_DECLENSION = 10;

// Thinking budget options
const AI_THINKING_BUDGET_QUICK = 1024;
const AI_THINKING_BUDGET_SLOW = 4096;

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

// Get filtered vocabulary based on current settings
function getFilteredVocabulary(selectedDeclensions, selectedConjugations) {
  const vocabulary = {
    nouns: [],
    verbs: [],
  };

  for (const declension of selectedDeclensions) {
    const nouns = nounDatabase[declension];
    if (nouns) {
      const sampled = sampleArray(nouns, WORDS_PER_DECLENSION);
      for (const noun of sampled) {
        vocabulary.nouns.push(`${noun.la} (${noun.en})`);
      }
    }
  }

  for (const conjugation of selectedConjugations) {
    const verbs = verbDatabase[conjugation];
    if (verbs) {
      for (const verb of verbs) {
        const construction = verb.construction ? `, + ${verb.construction}.` : "";
        vocabulary.verbs.push(`${verb.la} (${verb.en}${construction})`);
      }
    }
  }

  vocabulary.nouns.sort();
  vocabulary.verbs.sort();

  return vocabulary;
}

// Build the prompt for the AI
function buildPrompt(vocabulary, selectedTenses, pronounsEnabled, adjectivesEnabled, storyModeEnabled, count) {
  const tenseList = selectedTenses.map((t) => TENSE_NAMES[t] || t).join(" and ");

  let pronounRules = "";
  if (pronounsEnabled) {
    pronounRules = `- Use pronouns often, including all three persons, reflexive pronouns, and possessive adjectives.`;
  }

  let adjectiveRules = "- Do NOT use adjectives (except possessives) or adverbs.";
  if (adjectivesEnabled) {
    const allAdjectives = [...adjectiveDatabase.declension12, ...adjectiveDatabase.declension3]
      .map((adj) => `${adj.la} (${adj.en})`)
      .sort()
      .join(", ");
    adjectiveRules = `- Use ONLY these adjectives: ${allAdjectives}.
- Do NOT use adverbs.`;
  }

  let storyInstruction = "";
  if (storyModeEnabled) {
    const plot = BASIC_PLOTS[Math.floor(Math.random() * BASIC_PLOTS.length)];
    const endings = ["a happy ending", "an unhappy ending", "an ambiguous ending"];
    const ending = endings[Math.floor(Math.random() * endings.length)];
    storyInstruction = ` These sentences should form a coherent story with ${ending}, based on the following plot: "${plot}". Include some direct speech to exercise 1st and 2nd person grammar.`;
  }

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
- Use ONLY these tenses: ${tenseList}.
- Exercise as many noun cases as possible.
- When using nouns with ambiguous number, always indicate number in parentheses: "people (sg.)" or "people (pl.)".
- When using nouns with ambiguous gender, always indicate gender in parentheses: "friend (f.)" or "friend (m.)".
- When using "you", "your", "yours", "yourself", always indicate number in parentheses: "you (sg.)" or "you (pl.)".
- Use "suus", "sua", "suum", etc. ONLY when the possessor is the grammatical subject. Use the genitive ("eius", "eōrum", "eārum", etc.) when the possessor is NOT the subject.

Format rules:
- Return ONLY a JSON array: [{"en": "...", "la": "..."}].
- Use macrons and proper punctuation.`;
}

// Call the Anthropic API to generate phrases
async function generateAIPhrases(selectedDeclensions, selectedConjugations, selectedTenses, pronounsEnabled, adjectivesEnabled, storyModeEnabled, thinkingBudget) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key not set");
  }

  const vocabulary = getFilteredVocabulary(selectedDeclensions, selectedConjugations);

  // Check if we have enough vocabulary
  if (vocabulary.nouns.length === 0) {
    throw new Error("No nouns available with selected declensions");
  }
  if (vocabulary.verbs.length === 0) {
    throw new Error("No verbs available with selected conjugations");
  }

  const prompt = buildPrompt(vocabulary, selectedTenses, pronounsEnabled, adjectivesEnabled, storyModeEnabled, AI_PHRASE_COUNT);

  const requestBody = {
    model: AI_MODEL,
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: thinkingBudget,
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
  try {
    // Try to extract JSON from the response (in case there's extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const phrases = JSON.parse(jsonMatch[0]);

    // Validate the structure
    if (!Array.isArray(phrases)) {
      throw new Error("Response is not an array");
    }

    for (const phrase of phrases) {
      if (typeof phrase.en !== "string" || typeof phrase.la !== "string") {
        throw new Error("Invalid phrase structure");
      }
    }

    return phrases;
  } catch (parseError) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Failed to parse AI response: " + parseError.message);
  }
}
