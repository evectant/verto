// AI Mode for generating Latin phrases via Anthropic API

// Configuration - easily swappable
const AI_MODEL = "claude-opus-4-5-20251101";
const AI_API_URL = "https://api.anthropic.com/v1/messages";
const AI_PHRASE_COUNT = 30;

// Thinking budget options
const AI_THINKING_BUDGET_QUICK = 1024;
const AI_THINKING_BUDGET_SLOW = 4096;

// PREPOSITIONS is defined in utils.js (loaded first)

// LocalStorage keys
const API_KEY_STORAGE_KEY = "verto_anthropic_api_key";
const AI_PHRASES_STORAGE_KEY = "verto_ai_phrases";

// Tense name mapping for the LLM prompt (internal key -> full grammatical name)
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
function getFilteredVocabulary(selectedDeclensions, selectedConjugations, pronounsEnabled) {
  const vocabulary = {
    nouns: [],
    verbs: [],
  };

  // Collect nouns from selected declensions (just English + Latin nominative)
  const categories = ["person", "location", "thing", "concept", "emotion", "collective"];

  for (const category of categories) {
    if (!nounDatabase[category]) continue;

    for (const declension of selectedDeclensions) {
      const nouns = nounDatabase[category][declension];
      if (nouns) {
        for (const noun of nouns) {
          if (noun.nom.sg) {
            vocabulary.nouns.push(`${noun.nom.sg} (${noun.en})`);
          }
        }
      }
    }
  }

  // Collect verbs from selected conjugations (just English + Latin infinitive)
  for (const conjugation of selectedConjugations) {
    const verbNames = verbsByConjugation[conjugation];
    if (verbNames) {
      for (const verbName of verbNames) {
        const verb = verbDatabase[verbName];
        if (verb) {
          const construction = verb.construction ? `, + ${verb.construction}.` : "";
          vocabulary.verbs.push(`${verb.la.infinitive} (${verb.en.infinitive}${construction})`);
        }
      }
    }
  }

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

  const storyInstruction = storyModeEnabled
    ? " These sentences should form a coherent story with a beginning and end."
    : "";

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

  const vocabulary = getFilteredVocabulary(selectedDeclensions, selectedConjugations, pronounsEnabled);

  // Check if we have enough vocabulary
  if (vocabulary.nouns.length === 0) {
    throw new Error("No nouns available with selected declensions");
  }
  if (vocabulary.verbs.length === 0) {
    throw new Error("No verbs available with selected conjugations");
  }

  const prompt = buildPrompt(vocabulary, selectedTenses, pronounsEnabled, adjectivesEnabled, storyModeEnabled, AI_PHRASE_COUNT);

  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
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
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
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
