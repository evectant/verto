// AI Mode for generating Latin phrases via Anthropic API

// Configuration
const AI_MODEL = "claude-fable-5";

const AI_API_URL = "https://api.anthropic.com/v1/messages";
const AI_MAX_TOKENS = 32000;
const AI_PHRASE_COUNT = 30;
const AI_GENERATE_EFFORT = "medium";
const AI_VERIFY_EFFORT = "high";

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

// Genre/mood layer applied on top of the basic plot to set the story's vibe
const STORY_GENRES = [
  "Tragic: a somber tone moving toward loss, ruin, or downfall.",
  "Mythological: gods, fate, and legend shaping mortal affairs.",
  "Epic: war, sieges, and armies on the march, with glory and slaughter at grand scale.",
  "Political intrigue: conspiracy, betrayal, and the ruthless struggle for power.",
  "Apocalyptic: plague, divine wrath, and a city or world coming to its end.",
  "Noir: a jaded investigator, shadows and lies, betrayal and a fatal attraction.",
  "Heist: a crew, a meticulous plan to steal a great prize, and the inevitable double-cross.",
  "Courtroom drama: a trial swinging on fierce oratory, hidden evidence, and a surprise witness.",
  "Horror: relentless terror, monsters, and the macabre, with mounting dread.",
  "Gothic: decaying ruins, family curses, and brooding gloom.",
  "Dreamlike: surreal and shifting, where logic dissolves and the strange feels ordinary.",
  "Picaresque: a roguish wanderer surviving by wit through episodic misadventure.",
];

// Verbs always included in story mode regardless of conjugation selection
const ALWAYS_AVAILABLE_VERBS = [
  { en: "to be", la: "esse" },
  { en: "to make", la: "facere" },
  { en: "to have", la: "habēre" },
  { en: "to tell", la: "dīcere" },
  { en: "to be able", la: "posse" },
];

// JSON schema enforced via structured outputs (output_config.format)
const PHRASES_SCHEMA = {
  type: "object",
  properties: {
    phrases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          en: { type: "string" },
          la: { type: "string" },
          lemmas: { type: "array", items: { type: "string" } },
        },
        required: ["en", "la", "lemmas"],
        additionalProperties: false,
      },
    },
  },
  required: ["phrases"],
  additionalProperties: false,
};

// LocalStorage keys
const API_KEY_STORAGE_KEY = "verto_anthropic_api_key";
const AI_PHRASES_STORAGE_KEY = "verto_ai_phrases";

// Tense name mapping for the LLM prompt
const TENSE_NAMES = {
  present: "present indicative active",
  imperfect: "imperfect indicative active",
  future: "future indicative active",
  perfect: "perfect indicative active",
  pluperfect: "pluperfect indicative active",
  futurePerfect: "future perfect indicative active",
  presentPassive: "present indicative passive",
  imperfectPassive: "imperfect indicative passive",
  futurePassive: "future indicative passive",
  ppp: "perfect passive",
  pluperfectPassive: "pluperfect indicative passive",
  fpp: "future perfect passive",
  presentParticiple: "present active participle",
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
  return nouns.sort((a, b) => normalizeLemma(a).localeCompare(normalizeLemma(b)));
}

// Sample verbs from selected conjugations, distributed equally
function sampleVerbs(selectedConjugations, verbCount) {
  const verbs = [];
  for (const verb of ALWAYS_AVAILABLE_VERBS) {
    verbs.push(`${verb.la} (${verb.en})`);
  }
  const remaining = Math.max(0, verbCount - verbs.length);
  if (remaining > 0 && selectedConjugations.length > 0) {
    const verbsPerConjugation = Math.ceil(remaining / selectedConjugations.length);
    for (const conjugation of selectedConjugations) {
      const conjVerbs = verbDatabase[conjugation];
      if (conjVerbs) {
        const sampled = sampleArray(conjVerbs, verbsPerConjugation);
        for (const verb of sampled) {
          const formatted = `${verb.la} (${verb.en}${verb.construction ? `, + ${verb.construction}.` : ""})`;
          if (!verbs.includes(formatted)) {
            verbs.push(formatted);
          }
        }
      }
    }
  }
  return verbs.sort((a, b) => normalizeLemma(a).localeCompare(normalizeLemma(b)));
}

// Sample adjectives from both declension groups, distributed equally
function sampleAdjectives(adjectiveCount) {
  const adjectivesPerGroup = Math.ceil(adjectiveCount / 2);
  return [
    ...sampleArray(adjectiveDatabase.declension12, adjectivesPerGroup),
    ...sampleArray(adjectiveDatabase.declension3, adjectivesPerGroup),
  ]
    .map((adj) => `${adj.la} (${adj.en})`)
    .sort((a, b) => normalizeLemma(a).localeCompare(normalizeLemma(b)));
}

// Build the prompt for the AI
function buildPrompt(vocabulary, selectedTenses, count) {
  const tenseList = selectedTenses.map((t) => TENSE_NAMES[t] || t).join(", ");

  const adjectiveRules = vocabulary.adjectives && vocabulary.adjectives.length > 0
    ? `Use ONLY these adjectives: ${vocabulary.adjectives.join(", ")}.`
    : "Do not use adjectives (except possessives).";

  const plot = BASIC_PLOTS[Math.floor(Math.random() * BASIC_PLOTS.length)];
  const genre = STORY_GENRES[Math.floor(Math.random() * STORY_GENRES.length)];
  const endings = ["a happy ending", "an unhappy ending", "an ambiguous ending"];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  const storyInstruction = `These sentences should form a coherent story with ${ending}, based on the following plot: "${plot}". Tell it in the ${genre.split(":")[0].toLowerCase()} style: ${genre.split(": ")[1]}`;

  return `Generate ${count} Latin sentences with English translations for language learning. ${storyInstruction}

Follow the rules below exactly.

Latin vocabulary rules:
- Use ONLY these nouns: ${vocabulary.nouns.join(", ")}.
- Use ONLY these verbs: ${vocabulary.verbs.join(", ")}.
- ${adjectiveRules}
- Do not use proper nouns or invented character names; refer to characters and places with the allowed common nouns.
- Exercise as much of the given vocabulary as possible.
- Common conjunctions and prepositions are allowed; they are not restricted to any list.
- Use personal pronouns, reflexive pronouns, and possessive adjectives in all three persons.
- Do not use adverbs except common particles like "non" and "quoque".

Latin grammar rules:
- Use ONLY these tenses: ${tenseList}.${selectedTenses.includes("ppp") ? `
- For perfect passive, use both participial adjectives (e.g., "mīlitēs missī") and full perfect passive indicative with esse (e.g., "urbs capta est").` : ""}${selectedTenses.includes("pluperfectPassive") ? `
- For pluperfect passive, use the perfect passive participle with the imperfect of esse (e.g., "urbs capta erat" = "the city had been captured").` : ""}${selectedTenses.includes("fpp") ? `
- For future perfect passive, use the perfect passive participle with the future of esse (e.g., "urbs capta erit" = "the city will have been captured").` : ""}${selectedTenses.includes("presentParticiple") ? `
- For the present active participle, attach the participle to a noun, agreeing in case and number (e.g., "vir audiēns" = "the listening man", "mīlitibus fugientibus" = "for the fleeing soldiers"); the sentence's main verb must still be in one of the allowed finite tenses.` : ""}
- Favor complex sentences of two or more clauses: link clauses with coordinating conjunctions, and use relative clauses (quī, quae, quod) and subordinate clauses with indicative conjunctions (quod, ubi, dum, sī, postquam, quamquam). Avoid conjunctions that require the subjunctive.
- Exercise all of the given tenses in roughly equal proportion.
- Exercise all five noun cases (nominative, genitive, dative, accusative, ablative) in roughly equal proportion; do not use the vocative.
- Include direct speech to exercise 1st and 2nd person grammar.
- Use "suus", etc. only when the possessor is the grammatical subject; use "eius", etc. otherwise.

English translation rules:
- Translate the Latin faithfully, prioritizing accuracy over fluency.
- When an English word is ambiguous in gender or number, annotate it - for example: "friend (f.)", "you (pl.)".${selectedTenses.includes("imperfect") ? `
- ASPECT (important): the imperfect and perfect both map to the English simple past (e.g. "she walked"), which is ambiguous. To disambiguate, translate the imperfect with explicitly ongoing or habitual English - "she was walking" or "she used to walk" - never the bare simple past. Reserve the simple past ("she walked") for the perfect. Only if natural progressive/habitual English is genuinely impossible, fall back to annotating the verb - for example: "she walked (impf.)".` : ""}${selectedTenses.includes("presentPassive") || selectedTenses.includes("imperfectPassive") ? `
- VOICE (important): the present and imperfect passive describe ongoing actions and must be translated with the progressive: "laudātur" = "is being praised" (never the bare "is praised") and "laudābātur" = "was being praised" (never the bare "was praised"). The bare forms collide with the perfect passive ("laudāta est" = "she was praised / has been praised"); reserve those for the perfect passive.` : ""}${selectedTenses.includes("futurePerfect") ? `
- Translate the future perfect with "will have ..." (e.g., "audīverō" = "I will have heard"), never as a bare simple future or present - even in subordinate clauses where English would prefer one.` : ""}

Format rules:
- Each phrase's "lemmas" lists the dictionary form of every noun, verb, and adjective used in the sentence - including any that are not in the allowed vocabulary - in order of appearance:
  - Nominative singular for nouns (e.g., "puella")
  - Infinitive for verbs (e.g., "amāre")
  - Masculine nominative singular for adjectives (e.g., "magnus")
  - For participles, the infinitive of the verb (e.g., "mittere" for "missī"), never the participle form
  - Do not include function words: pronouns, possessives (meus, suus, etc.), conjunctions, prepositions, particles.
- A validator will programmatically check every entry in "lemmas" against the allowed vocabulary, so list each content word honestly and use the exact dictionary form.
- Use macrons on all long vowels, and proper punctuation.`;
}

// Call the Anthropic API with a prompt and parse the JSON response
async function callAI(prompt, effort) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key not set");
  }

  const requestBody = {
    model: AI_MODEL,
    max_tokens: AI_MAX_TOKENS,
    thinking: {
      type: "adaptive",
      display: "summarized",
    },
    output_config: {
      effort: effort,
      format: {
        type: "json_schema",
        schema: PHRASES_SCHEMA,
      },
    },
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const startTime = performance.now();

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
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  const thinkingBlock = data.content.find((block) => block.type === "thinking");
  const textBlock = data.content.find((block) => block.type === "text");
  const content = textBlock?.text;

  console.log(
    `=== AI Log (${elapsed}s) ===\n\n` +
    "--- Prompt ---\n" + prompt + "\n\n" +
    (thinkingBlock ? "--- Thinking ---\n" + thinkingBlock.thinking + "\n\n" : "") +
    "--- Response ---\n" + (content || "(empty)")
  );

  if (data.stop_reason === "refusal") {
    throw new Error(data.stop_details?.explanation || "The model declined to answer this request");
  }
  if (data.stop_reason === "max_tokens") {
    throw new Error("Response was cut off by the token limit");
  }

  if (!content) {
    throw new Error("No content in API response");
  }

  // Structured outputs guarantee the response matches PHRASES_SCHEMA
  const phrases = JSON.parse(content).phrases;

  if (!Array.isArray(phrases)) {
    throw new Error("Response is not an array");
  }

  for (const phrase of phrases) {
    if (typeof phrase.en !== "string" || typeof phrase.la !== "string") {
      throw new Error("Invalid phrase structure");
    }
  }

  return { phrases, elapsed: parseFloat(elapsed) };
}

// Strip macrons and lowercase a Latin word for matching (̀-ͯ = combining marks)
function normalizeLemma(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// Build a set of allowed content lemmas from the sampled vocabulary
function buildAllowedLemmas(vocabulary) {
  const allowed = new Set();
  const all = [...(vocabulary.nouns || []), ...(vocabulary.verbs || []), ...(vocabulary.adjectives || [])];
  for (const item of all) {
    const lemma = item.split(" (")[0];
    allowed.add(normalizeLemma(lemma));
  }
  return allowed;
}

// Find lemmas reported by the generator that are not in the allowed vocabulary
function validateVocabulary(phrases, allowedLemmas) {
  const violations = [];
  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    if (!Array.isArray(phrase.lemmas)) continue;
    const violatingLemmas = [];
    for (const lemma of phrase.lemmas) {
      if (typeof lemma === "string" && !allowedLemmas.has(normalizeLemma(lemma))) {
        violatingLemmas.push(lemma);
      }
    }
    if (violatingLemmas.length > 0) {
      violations.push({
        index: i,
        la: phrase.la,
        violations: violatingLemmas,
      });
    }
  }
  return violations;
}

// Tenses whose translation rules get an extra verification pass
const VERIFY_TENSE_RULES = ["imperfect", "presentPassive", "imperfectPassive", "futurePerfect"];

// Build a verification prompt to check generated phrases against the original rules
function buildVerificationPrompt(phrases, originalPrompt, violations, selectedTenses) {
  const phrasesJson = JSON.stringify(phrases, null, 2);

  const violationSection = violations.length === 0
    ? `=== AUTOMATED VOCABULARY CHECK ===
The vocabulary check passed: every lemma reported by the generator is in the allowed vocabulary. Still verify nothing was missed - e.g., a content word used in the Latin but not listed in "lemmas".

`
    : `=== AUTOMATED VOCABULARY CHECK ===
The following content words appear in the generated sentences but are not in the allowed vocabulary. You MUST rewrite each affected sentence to remove the disallowed words.
${violations.map((v) => `- Sentence ${v.index + 1} ("${v.la}"): disallowed words: ${v.violations.join(", ")}`).join("\n")}

Rewrite the whole sentence if needed - a single-word substitution often fails because the surrounding grammar depends on the word.

`;

  const tenseTask = VERIFY_TENSE_RULES.some((tense) => selectedTenses.includes(tense))
    ? `
4. Tense translation: re-check every English translation against the ASPECT, VOICE, and future perfect rules in the original rules above. These are the most commonly violated rules - rewrite any translation that uses a bare simple past for an imperfect ("walked" instead of "was walking"), a bare passive for a present/imperfect passive ("is praised" instead of "is being praised"), or a simple future for a future perfect ("will hear" instead of "will have heard").`
    : "";

  return `Review these AI-generated Latin sentences for a language learning app.

${violationSection}=== ORIGINAL RULES ===
${originalPrompt}

=== GENERATED SENTENCES ===
${phrasesJson}

Your task:
1. Vocabulary: Fix any vocabulary violations listed above. Use ONLY words from the allowed vocabulary.
2. Grammar: Check every Latin sentence for grammar errors and fix any you find. It is okay for Latin to be unidiomatic, but it must be grammatically correct.
3. Translation: Check that English translations are accurate and follow the translation rules (including gender/number annotations); fix any that fall short.${tenseTask}

Maintain the same number of sentences in the same order. Full rewrites of individual sentences are allowed when needed to fix vocabulary; when rewriting, keep the sentence coherent with the surrounding story. Whenever you change a sentence, update its "lemmas" to match. If a sentence already satisfies every rule, return it verbatim - do NOT reword correct sentences.

Return the complete corrected list of sentences.`;
}

// Verify and correct generated phrases using a second AI pass
async function verifyPhrases(generateResult, originalPrompt, violations, selectedTenses, onStatus) {
  if (onStatus) onStatus("Probans...");
  const prompt = buildVerificationPrompt(generateResult.phrases, originalPrompt, violations, selectedTenses);
  const verifyResult = await callAI(prompt, AI_VERIFY_EFFORT);
  return {
    phrases: verifyResult.phrases,
    generateSeconds: Math.round(generateResult.elapsed),
    verifySeconds: Math.round(verifyResult.elapsed),
  };
}

// Generate story phrases via API
async function generateAIPhrases(selectedDeclensions, selectedConjugations, selectedTenses, adjectivesEnabled, nounCount, verbCount, adjectiveCount, onStatus, onWords) {
  const nouns = sampleNouns(selectedDeclensions, nounCount);
  const verbs = sampleVerbs(selectedConjugations, verbCount);
  const adjectives = adjectivesEnabled ? sampleAdjectives(adjectiveCount) : [];

  if (nouns.length === 0) {
    throw new Error("No nouns available with selected declensions");
  }
  if (verbs.length === 0) {
    throw new Error("No verbs available with selected conjugations");
  }

  if (onWords) onWords({ nouns, verbs, adjectives });

  const vocabulary = { nouns, verbs, adjectives };
  const prompt = buildPrompt(vocabulary, selectedTenses, AI_PHRASE_COUNT);
  const result = await callAI(prompt, AI_GENERATE_EFFORT);

  const allowedLemmas = buildAllowedLemmas(vocabulary);
  const violations = validateVocabulary(result.phrases, allowedLemmas);
  if (violations.length > 0) {
    console.log(
      `=== Vocab violations: ${violations.length} sentences ===\n` +
      violations.map((v) => `Sentence ${v.index + 1} ("${v.la}"): ${v.violations.join(", ")}`).join("\n")
    );
  }

  return verifyPhrases(result, prompt, violations, selectedTenses, onStatus);
}

// Build prompt for agreement practice mode
function buildAgreementPrompt(nouns, adjectives, count) {
  return `Generate ${count} Latin agreement exercises for language learning.

Each exercise is an adjective-noun phrase in one of the five cases:

1. NOMINATIVE (nom.): subjects - "great city (nom.)" → "urbs magna"
2. GENITIVE (gen.): possession - "of strong men (gen.)" → "virōrum fortium"
3. DATIVE (dat.): indirect objects - "to/for good girl (dat.)" → "puellae bonae"
4. ACCUSATIVE (acc.): with acc. prepositions - "through deep water (acc.)" → "per aquam altam"
5. ABLATIVE (abl.): with abl. prepositions - "with good girl (abl.)" → "cum puellā bonā"

Rules:
- Use ONLY these nouns: ${nouns.join(", ")}.
- Use ONLY these adjectives: ${adjectives.join(", ")}.
- For acc., use prepositions that govern the accusative (ad, in, per, trāns, etc.); for abl., use prepositions that govern the ablative (ā/ab, cum, dē, ē/ex, in, sine, etc.).
- Distribute exercises roughly equally across all 5 cases.
- Vary the numbers: use both singular and plural forms.
- Vary the genders as far as the given nouns allow: use masculine, feminine, and neuter.
- The adjective must correctly agree with the noun in case, number, and gender.
- Use macrons on all long vowels.

Format rules:
- Each phrase's "lemmas" lists the dictionary forms of the noun and adjective used (nominative singular for the noun, masculine nominative singular for the adjective), including any that are not in the allowed vocabulary. Do not include the preposition.
- A validator will programmatically check every entry in "lemmas" against the allowed vocabulary, so list each word honestly and use the exact dictionary form.
- For nom./gen./dat.: English is "<adj> <noun> (case)" or "of/to/for <adj> <noun> (case)", Latin is "<noun> <adj>".
- For acc./abl.: English is "<prep meaning> <adj> <noun> (case)", Latin is "<prep> <noun> <adj>".`;
}

// Generate agreement practice phrases via API
async function generateAgreementPhrases(selectedDeclensions, nounCount, adjectiveCount, onStatus, onWords) {
  const nouns = sampleNouns(selectedDeclensions, nounCount);
  const adjectives = sampleAdjectives(adjectiveCount);

  if (nouns.length === 0) {
    throw new Error("No nouns available with selected declensions");
  }

  if (onWords) onWords({ nouns, adjectives });

  const vocabulary = { nouns, adjectives };
  const prompt = buildAgreementPrompt(nouns, adjectives, AI_PHRASE_COUNT);
  const result = await callAI(prompt, AI_GENERATE_EFFORT);

  const allowedLemmas = buildAllowedLemmas(vocabulary);
  const violations = validateVocabulary(result.phrases, allowedLemmas);
  if (violations.length > 0) {
    console.log(
      `=== Vocab violations: ${violations.length} sentences ===\n` +
      violations.map((v) => `Sentence ${v.index + 1} ("${v.la}"): ${v.violations.join(", ")}`).join("\n")
    );
  }

  return verifyPhrases(result, prompt, violations, [], onStatus);
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
