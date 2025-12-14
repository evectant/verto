// AI Mode for generating Latin phrases via Anthropic API

// Configuration - easily swappable
const AI_MODEL = "claude-opus-4-5-20251101";
const AI_API_URL = "https://api.anthropic.com/v1/messages";
const AI_PHRASE_COUNT = 30;

// LocalStorage key for API key
const API_KEY_STORAGE_KEY = "verto_anthropic_api_key";

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
            vocabulary.nouns.push(`${noun.en} (${noun.nom.sg}, ${noun.gender})`);
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
          vocabulary.verbs.push(`${verb.en.infinitive} (${verb.la.infinitive})`);
        }
      }
    }
  }

  return vocabulary;
}

// Build the prompt for the AI
function buildPrompt(vocabulary, selectedTenses, pronounsEnabled, count) {
  const tenseList = selectedTenses.map((t) => TENSE_NAMES[t] || t).join(" and ");

  let pronounRules = "";
  if (pronounsEnabled) {
    pronounRules = `Subjects may be 1st person (I/we), 2nd person (you), or 3rd person (nouns or he/she/it/they)
- Use reflexive pronouns often (se, sibi, secum)
- Use possessives often (meus, tuus, suus, noster, vester)`;
  }

  return `Generate ${count} Latin sentences with English translations for language learning.

Grammar rules:
- Use ONLY these nouns: ${vocabulary.nouns.join(", ")}
- Use ONLY these verbs: ${vocabulary.verbs.join(", ")}
- Use ONLY these tenses: ${tenseList}
- Use ONLY these prepositions: a, ab, ad, cum, de, ex, in, sine
- ${pronounRules}
- Do NOT use adjectives (except possessives) or adverbs
- Exercise as much vocabulary and grammar listed above as possible

Format rules:
- Return ONLY a JSON array: [{"en": "...", "la": "..."}].
- No macrons in Latin.
- No period at the end.
- Lowercase except proper nouns.`;
}

// Call the Anthropic API to generate phrases
async function generateAIPhrases(selectedDeclensions, selectedConjugations, selectedTenses, pronounsEnabled) {
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

  const prompt = buildPrompt(vocabulary, selectedTenses, pronounsEnabled, AI_PHRASE_COUNT);

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
      max_tokens: 4096,
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
  const content = data.content[0]?.text;

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
