// AI Mode for generating Latin phrases via Anthropic API

// Configuration
const AI_MODEL = "claude-fable-5-1";

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

// Split `count` as evenly as possible across `n` pools. The remainder goes to
// randomly chosen pools so the total is exact and no pool is always favored.
function distributeCount(count, n) {
  if (!Number.isFinite(count)) return Array(n).fill(count);
  const quotas = Array(n).fill(Math.floor(count / n));
  for (const i of sampleArray([...quotas.keys()], count % n)) quotas[i]++;
  return quotas;
}

// Pick one random survivor per synonym group and return the set of excluded
// lemmas, so a sampling pass never offers two easily-confused words together.
function buildSynonymExclusions() {
  const excluded = new Set();
  for (const group of SYNONYM_GROUPS) {
    const survivor = Math.floor(Math.random() * group.length);
    group.forEach((lemma, i) => {
      if (i !== survivor) excluded.add(lemma);
    });
  }
  return excluded;
}

// Sample noun entries from selected declensions. Counts are separate for
// declensions 1-3 and 4-5, distributed equally within each group.
function sampleNounEntries(selectedDeclensions, nounCount123, nounCount45, excluded = null) {
  const groups = [
    { members: ["declension1", "declension2", "declension3"], count: nounCount123 },
    { members: ["declension4", "declension5"], count: nounCount45 },
  ];
  const entries = [];
  for (const { members, count } of groups) {
    const declensions = selectedDeclensions.filter((d) => members.includes(d));
    if (declensions.length === 0 || count <= 0) continue;
    const quotas = distributeCount(count, declensions.length);
    declensions.forEach((declension, i) => {
      const pool = excluded
        ? nounDatabase[declension].filter((noun) => !excluded.has(noun.la))
        : nounDatabase[declension];
      for (const noun of sampleArray(pool, quotas[i])) {
        entries.push({ declension, noun });
      }
    });
  }
  return entries;
}

// Sample nouns from selected declensions, formatted for AI prompts
function sampleNouns(selectedDeclensions, nounCount123, nounCount45, excluded = null) {
  return sampleNounEntries(selectedDeclensions, nounCount123, nounCount45, excluded)
    .map(({ noun }) => `${noun.la} (${noun.en})`)
    .sort((a, b) => normalizeLemma(a).localeCompare(normalizeLemma(b)));
}

// Sample verbs from selected conjugations, distributed equally
function sampleVerbs(selectedConjugations, verbCount, excluded = null) {
  const verbs = [];
  for (const verb of ALWAYS_AVAILABLE_VERBS) {
    verbs.push(`${verb.la} (${verb.en})`);
  }
  const remaining = Math.max(0, verbCount - verbs.length);
  if (remaining > 0 && selectedConjugations.length > 0) {
    const quotas = distributeCount(remaining, selectedConjugations.length);
    selectedConjugations.forEach((conjugation, i) => {
      let conjVerbs = verbDatabase[conjugation];
      if (conjVerbs && excluded) {
        conjVerbs = conjVerbs.filter((verb) => !excluded.has(verb.la));
      }
      if (conjVerbs) {
        const sampled = sampleArray(conjVerbs, quotas[i]);
        for (const verb of sampled) {
          const formatted = `${verb.la} (${verb.en}${verb.construction ? `, + ${verb.construction}.` : ""})`;
          if (!verbs.includes(formatted)) {
            verbs.push(formatted);
          }
        }
      }
    });
  }
  return verbs.sort((a, b) => normalizeLemma(a).localeCompare(normalizeLemma(b)));
}

// Sample adjectives from both declension groups, distributed equally
function sampleAdjectives(adjectiveCount, excluded = null) {
  const quotas = distributeCount(adjectiveCount, 2);
  const pools = [adjectiveDatabase.declension12, adjectiveDatabase.declension3].map(
    (pool) => (excluded ? pool.filter((adj) => !excluded.has(adj.la)) : pool)
  );
  return [
    ...sampleArray(pools[0], quotas[0]),
    ...sampleArray(pools[1], quotas[1]),
  ]
    .map((adj) => `${adj.la} (${adj.en})`)
    .sort((a, b) => normalizeLemma(a).localeCompare(normalizeLemma(b)));
}

// Sentence-complexity rules for the story prompt, keyed by the difficulty selector
const DIFFICULTY_RULES = {
  easy: `- Keep sentences short and simple: one clause each, about 4-7 Latin words, with a single finite verb (a short quoted clause in direct speech is fine). Do not use relative or subordinate clauses, and do not join clauses with conjunctions; "et" may join two nouns or adjectives.`,
  medium: `- Keep most sentences to a single clause of about 6-10 Latin words. Roughly one sentence in three may have two clauses - joined by a coordinating conjunction, a relative clause (quī, quae, quod), or a subordinate clause with an indicative conjunction (quod, ubi, dum, sī, postquam) - but never more than two clauses, and never a clause nested inside another. Direct speech may add a short quoted clause.`,
  hard: `- Favor complex sentences of two or three clauses, up to about 15 Latin words: link clauses with coordinating conjunctions, and use relative clauses (quī, quae, quod) and subordinate clauses with indicative conjunctions (quod, ubi, dum, sī, postquam, quamquam); a clause may be nested inside another.`,
};

// Build the prompt for the AI
function buildPrompt(vocabulary, selectedTenses, count, difficulty) {
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
${DIFFICULTY_RULES[difficulty] || DIFFICULTY_RULES.medium}
- Avoid conjunctions that require the subjunctive.
- Exercise all of the given tenses in roughly equal proportion.
- Exercise all five noun cases (nominative, genitive, dative, accusative, ablative) in roughly equal proportion; do not use the vocative.
- Include direct speech to exercise 1st and 2nd person grammar.
- Use "suus", etc. only when the possessor is the grammatical subject; use "eius", etc. otherwise.

English translation rules:
- Translate literally, even if the English reads stiffly: every content word in the English must correspond to a word in the Latin, and every Latin content word must appear in the English. Do not add words for smoothness or clarity.
- When English grammar genuinely requires a word with no Latin counterpart, put it in square brackets so the learner knows not to translate it - for example: "pars gemmam cupit, pars mortem cupit" = "[one] part desires the gem, [another] part desires death". Articles ("the", "a") never need brackets.
- Keep the Latin's part of speech and structure: a noun stays a noun, a repeated verb stays repeated, a genitive stays "of ...", and clauses stay in the Latin's order.
- When an English word is ambiguous in gender or number, annotate it in parentheses - for example: "friend (f.)", "you (pl.)".${selectedTenses.includes("imperfect") ? `
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
    `=== AI Log (${elapsed}s, ${data.model}) ===\n\n` +
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
3. Translation: Check that English translations are accurate, literal, and follow the translation rules: every English content word must correspond to a Latin word or be in square brackets, every Latin content word must appear in the English, and gender/number annotations must be present. Fix any that fall short - in particular, remove or bracket words added for smoothness.${tenseTask}

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
async function generateAIPhrases(selectedDeclensions, selectedConjugations, selectedTenses, difficulty, adjectivesEnabled, nounCount123, nounCount45, verbCount, adjectiveCount, onStatus, onWords) {
  const excluded = buildSynonymExclusions();
  const nouns = sampleNouns(selectedDeclensions, nounCount123, nounCount45, excluded);
  const verbs = sampleVerbs(selectedConjugations, verbCount, excluded);
  const adjectives = adjectivesEnabled ? sampleAdjectives(adjectiveCount, excluded) : [];

  if (nouns.length === 0) {
    throw new Error("No nouns available with selected declensions");
  }
  if (verbs.length === 0) {
    throw new Error("No verbs available with selected conjugations");
  }

  if (onWords) onWords({ nouns, verbs, adjectives });

  const vocabulary = { nouns, verbs, adjectives };
  const prompt = buildPrompt(vocabulary, selectedTenses, AI_PHRASE_COUNT, difficulty);
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
async function generateAgreementPhrases(selectedDeclensions, nounCount123, nounCount45, adjectiveCount, onStatus, onWords) {
  const excluded = buildSynonymExclusions();
  const nouns = sampleNouns(selectedDeclensions, nounCount123, nounCount45, excluded);
  const adjectives = sampleAdjectives(adjectiveCount, excluded);

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
function generateVocabularyPhrases(selectedDeclensions, selectedConjugations, adjectivesEnabled, nounCount123, nounCount45, verbCount, adjectiveCount) {
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
  for (const { declension, noun } of sampleNounEntries(selectedDeclensions, nounCount123, nounCount45)) {
    phrases.push({
      en: `${noun.en} (noun)`,
      la: `${noun.la} ${declensionNumbers[declension]}${noun.gender}`,
    });
  }

  // Add verbs (infinitive form), distributed across conjugations
  if (selectedConjugations.length > 0) {
    const quotas = distributeCount(verbCount, selectedConjugations.length);
    selectedConjugations.forEach((conjugation, i) => {
      const conjVerbs = verbDatabase[conjugation];
      if (conjVerbs) {
        const conjNum = conjugationNumbers[conjugation];
        const sampled = sampleArray(conjVerbs, quotas[i]);
        for (const verb of sampled) {
          phrases.push({
            en: `${verb.en} (verb)`,
            la: `${verb.la} ${conjNum}`,
          });
        }
      }
    });
  }

  // Add adjectives (nominative masculine singular), distributed across groups
  if (adjectivesEnabled) {
    const [quota12, quota3] = distributeCount(adjectiveCount, 2);
    const sampled12 = sampleArray(adjectiveDatabase.declension12, quota12);
    const sampled3 = sampleArray(adjectiveDatabase.declension3, quota3);
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
