// AI Mode for generating Latin phrases via Anthropic API

// Configuration
const AI_MODEL = "claude-opus-4-5-20251101";
const AI_API_URL = "https://api.anthropic.com/v1/messages";
const AI_PHRASE_COUNT = 30;

// Thinking budget options
const AI_THINKING_BUDGET_QUICK = 1024;
const AI_THINKING_BUDGET_SLOW = 4096;

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

// Get filtered vocabulary based on current settings
function getFilteredVocabulary(selectedDeclensions, selectedConjugations) {
  const vocabulary = {
    nouns: [],
    verbs: [],
  };

  for (const declension of selectedDeclensions) {
    const nouns = nounDatabase[declension];
    if (nouns) {
      for (const noun of nouns) {
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
    adjectiveRules = `- Use ONLY these adjectives: ${ADJECTIVES.join(", ")}.
- Do NOT use adverbs.`;
  }

  let storyInstruction = "";
  if (storyModeEnabled) {
    const roll = Math.random();
    const endingStyle = roll < 1 / 3 ? "a happy ending" : roll < 2 / 3 ? "an unhappy ending" : "a philosophically ambiguous ending";
    storyInstruction = ` These sentences should form a coherent story with a beginning, a plot twist in the middle, and ${endingStyle}. Include some direct speech to exercise 1st and 2nd person grammar.`;
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
