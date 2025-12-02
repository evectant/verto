// Template Engine for generating phrases from templates with noun substitution

/**
 * Parses a template string and extracts placeholder information
 * Example: "{noun.person.en} {verb.personLocation.en} from {noun.location.en}"
 * Returns: [{type: "noun", category: "person", lang: "en", ...}, {type: "verb", verbClass: "personLocation", lang: "en", ...}, ...]
 */
function parseTemplate(template) {
  const placeholderRegex = /\{([^}]+)\}/g;
  const placeholders = [];
  let match;

  while ((match = placeholderRegex.exec(template)) !== null) {
    const content = match[1];
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;

    // Check for verb placeholder: {verb.verbName.lang}, {verb.verbName.lang.number}, or {verb.inf.lang}
    // Format: {verb.take.en}, {verb.take.la.sg}, or {verb.inf.en}, {verb.inf.la}
    if (content.startsWith("verb.")) {
      const parts = content.split(".");
      if (parts.length < 3) {
        console.error(
          `Invalid verb format (expected {verb.verbName.lang}): ${match[0]}`
        );
        continue;
      }

      const verbName = parts[1];
      const lang = parts[2];
      const number = parts.length === 4 ? parts[3] : null; // Optional number (sg/pl)

      // Check if this is an infinitive placeholder
      if (verbName === "inf") {
        placeholders.push({
          fullMatch: match[0],
          startIndex: startIndex,
          endIndex: endIndex,
          type: "verb_infinitive",
          lang: lang,
        });
        continue;
      }

      // Check if it's a valid verb
      const isValidVerb = verbDatabase && verbDatabase[verbName];
      if (!isValidVerb) {
        console.error(`Unknown verb: ${verbName} in ${match[0]}`);
      }

      placeholders.push({
        fullMatch: match[0],
        startIndex: startIndex,
        endIndex: endIndex,
        type: "verb",
        verbName: verbName,
        lang: lang,
        number: number, // null for dynamic, 'sg'/'pl' for fixed
        tense: null, // Will be set during generation
        person: null, // Will be set during generation
      });
      continue;
    }

    // Check for "from" placeholders: {from.en} or {from.la}
    if (content === "from.en" || content === "from.la") {
      placeholders.push({
        fullMatch: match[0],
        startIndex: startIndex,
        endIndex: endIndex,
        type: "from",
        lang: content === "from.en" ? "en" : "la",
      });
      continue;
    }

    // Check for "a/ab" placeholders: {a.en} or {a.la}
    if (content === "a.en" || content === "a.la") {
      placeholders.push({
        fullMatch: match[0],
        startIndex: startIndex,
        endIndex: endIndex,
        type: "a",
        lang: content === "a.en" ? "en" : "la",
      });
      continue;
    }

    // Check for noun placeholder: {noun.category.lang.case.number}
    // All parts are now mandatory!
    // Format: {noun.person.en.nom.sg}, {noun.animate.la.acc.both}, {noun.pronoun.en.nom.pl}
    if (content.startsWith("noun.")) {
      const parts = content.split(".");

      // Validate format: noun.category.lang.case.number (5 parts total)
      if (parts.length !== 5) {
        console.error(
          `Invalid noun format (expected {noun.category.lang.case.number}): ${match[0]}`
        );
        console.error(
          `  Example: {noun.person.en.nom.sg} or {noun.animate.la.acc.both}`
        );
        continue;
      }

      const category = parts[1];
      const lang = parts[2];
      const caseValue = parts[3];
      const number = parts[4]; // 'sg', 'pl', or 'both'

      // Validate language
      if (lang !== "en" && lang !== "la") {
        console.error(`Invalid language in ${match[0]}: ${lang} (must be 'en' or 'la')`);
        continue;
      }

      // Validate case
      const validCases = ["nom", "gen", "gen_indep", "dat", "acc", "abl"];
      if (!validCases.includes(caseValue)) {
        console.error(`Invalid case in ${match[0]}: ${caseValue} (must be one of: ${validCases.join(", ")})`);
        continue;
      }

      // Validate number
      const validNumbers = ["sg", "pl", "both"];
      if (!validNumbers.includes(number)) {
        console.error(`Invalid number in ${match[0]}: ${number} (must be 'sg', 'pl', or 'both')`);
        continue;
      }

      // Determine placeholder type based on category
      const isPerson = category === "person";
      const isPronoun = category === "pronoun";
      const isAnimate = category === "animate";
      const canBePronoun = isAnimate || isPronoun; // "animate" and "pronoun" can use pronouns

      placeholders.push({
        fullMatch: match[0],
        startIndex: startIndex,
        endIndex: endIndex,
        type: "noun",
        category: category,
        lang: lang,
        case: caseValue,
        number: number === "both" ? null : number, // null means dynamic (both)
        isPerson: isPerson,
        isPronoun: isPronoun,
        isAnimate: isAnimate,
        canBePronoun: canBePronoun,
      });
      continue;
    }

    // Unknown placeholder format
    console.error(`Invalid placeholder format: ${match[0]}`);
  }

  return placeholders;
}

/**
 * Gets available nouns for a category filtered by selected declensions
 * @param {string} category - The noun category (person, location, thing, etc.)
 * @param {Array<string>} selectedDeclensions - Array of selected declension keys (e.g., ["declension1", "declension2"])
 * @param {boolean} enablePronouns - Whether pronouns are enabled
 * @returns {Array} Array of nouns from the selected declensions
 */
function getFilteredNouns(category, selectedDeclensions, enablePronouns) {
  if (!nounDatabase[category]) {
    console.error(`Unknown category: ${category}`);
    return [];
  }

  // If only pronouns enabled (no declensions), use Dc I for non-person categories
  let effectiveDeclensions = selectedDeclensions;
  if (
    enablePronouns &&
    selectedDeclensions.length === 0 &&
    category !== "person"
  ) {
    effectiveDeclensions = ["declension1"];
  }

  const nouns = [];
  effectiveDeclensions.forEach((declension) => {
    if (nounDatabase[category][declension]) {
      nouns.push(...nounDatabase[category][declension]);
    }
  });

  return nouns;
}

/**
 * Substitutes a placeholder with a specific noun's form or verb form
 * @param {object} placeholder - Placeholder object from parseTemplate
 * @param {object} noun - Noun object from nounDatabase (null for verb/pronoun placeholders)
 * @param {string} number - The number to use ('sg' or 'pl'), overrides placeholder.number if placeholder.number is null
 * @param {string} tense - The tense to use ('present' or 'perfect') for verbs
 * @param {string} lang - The language ('en' or 'la') (used by generatePhrase, not by verb substitution)
 * @param {string} person - The person to use ('1', '2', '3') for verbs and pronouns
 * @param {string} personMode - The mode for person category: 'noun' or 'pronoun'
 * @param {Array<string>} selectedConjugations - Array of selected conjugation keys to filter verbs
 * @param {object} possessiveContext - For Latin genitives, context about the possessed noun {noun, case, number}
 * @param {string} followingWord - The word that follows this placeholder (used for {from.la})
 * @param {string} fromVariant - The "from" variant to use: 'ex' for "out of"/"ex", 'a' for "from"/"a/ab"
 * @param {Array} selectedInfinitives - Array of selected verb names for infinitives (shared across languages)
 * @param {object} infinitiveCounters - Counter for current infinitive position per language {en: number, la: number}
 * @param {boolean} isSubjectNominative - Whether this is the subject nominative (only omit this one in Latin)
 * @param {string} thirdPersonGender - The gender to use for 3rd person pronouns ('m' or 'f')
 * @returns {string} The substituted text
 */
function substitutePlaceholder(
  placeholder,
  noun,
  number,
  tense,
  lang,
  person,
  personMode,
  selectedConjugations,
  possessiveContext,
  followingWord,
  fromVariant,
  selectedInfinitives,
  infinitiveCounters,
  isSubjectNominative = false,
  thirdPersonGender = "m"
) {
  // Helper function to check if a character is a vowel (including macrons)
  function isVowel(char) {
    const lowerChar = char.toLowerCase();
    return (
      lowerChar === "a" ||
      lowerChar === "ā" ||
      lowerChar === "e" ||
      lowerChar === "ē" ||
      lowerChar === "i" ||
      lowerChar === "ī" ||
      lowerChar === "o" ||
      lowerChar === "ō" ||
      lowerChar === "u" ||
      lowerChar === "ū" ||
      lowerChar === "h"
    );
  }

  // Handle "from" placeholder: {from.en} or {from.la}
  if (placeholder.type === "from") {
    if (placeholder.lang === "en") {
      // English: "out of" or "from"
      return fromVariant === "ex" ? "out of" : "from";
    } else if (placeholder.lang === "la") {
      // Latin: "ex" (+ abl) or "a/ab" (+ abl)
      if (fromVariant === "ex") {
        return "ex";
      } else {
        // Choose "ab" if following word starts with a vowel or h, otherwise "a"
        if (followingWord && followingWord.length > 0) {
          if (isVowel(followingWord.charAt(0))) {
            return "ab";
          }
        }
        return "a";
      }
    }
  }
  // Handle "a/ab" placeholder: {a.en} or {a.la}
  if (placeholder.type === "a") {
    if (placeholder.lang === "en") {
      // English: always "from"
      return "from";
    } else if (placeholder.lang === "la") {
      // Latin: "a" or "ab" based on following word
      // Choose "ab" if following word starts with a vowel or h, otherwise "a"
      if (followingWord && followingWord.length > 0) {
        if (isVowel(followingWord.charAt(0))) {
          return "ab";
        }
      }
      return "a";
    }
  }
  // Handle verb infinitive placeholders
  if (placeholder.type === "verb_infinitive") {
    const currentLang = placeholder.lang;
    const currentIndex = infinitiveCounters ? infinitiveCounters[currentLang] : 0;

    let verbName;

    // Check if this infinitive position already has a selected verb
    if (selectedInfinitives && selectedInfinitives[currentIndex]) {
      // Use the already-selected verb to ensure English and Latin match
      verbName = selectedInfinitives[currentIndex];
    } else {
      // This is the first language to process this infinitive position, select a new verb
      const availableVerbs = [];
      if (selectedConjugations && selectedConjugations.length > 0) {
        selectedConjugations.forEach((conj) => {
          if (verbsByConjugation[conj]) {
            availableVerbs.push(...verbsByConjugation[conj]);
          }
        });
      }

      if (availableVerbs.length === 0) {
        console.error("No verbs available for infinitive placeholder");
        return "[ERROR:no-verbs]";
      }

      // Filter out verbs already used for previous infinitives
      const unusedVerbs = availableVerbs.filter(
        (v) => !selectedInfinitives.includes(v)
      );

      // If all verbs have been used, allow reuse
      const verbPool = unusedVerbs.length > 0 ? unusedVerbs : availableVerbs;

      // Pick a random verb
      verbName = verbPool[Math.floor(Math.random() * verbPool.length)];

      // Store it for use by the other language
      if (selectedInfinitives) {
        selectedInfinitives[currentIndex] = verbName;
      }
    }

    // Increment the counter for this language
    if (infinitiveCounters) {
      infinitiveCounters[currentLang]++;
    }

    const verb = verbDatabase[verbName];
    if (!verb) {
      console.error(`Unknown verb: ${verbName}`);
      return `[ERROR:${verbName}]`;
    }

    // Return the infinitive form
    return verb[currentLang].infinitive;
  }

  // Handle verb placeholders
  if (placeholder.type === "verb") {
    // Use the specific verb name from the placeholder
    const verb = verbDatabase[placeholder.verbName];
    if (!verb) {
      console.error(`Unknown verb: ${placeholder.verbName}`);
      return `[ERROR:${placeholder.verbName}]`;
    }

    // Use the language specified in the placeholder, not the parameter
    const verbLang = placeholder.lang;
    const effectiveNumber =
      placeholder.number !== null ? placeholder.number : number;

    return verb[verbLang][tense][person][effectiveNumber];
  }

  // Handle pronoun placeholders
  if (placeholder.type === "pronoun") {
    const pronoun = pronounDatabase[person];
    if (!pronoun) {
      console.error(`Unknown person: ${person}`);
      return `[ERROR:person${person}]`;
    }

    // For 3rd person, use the consistent gender for this phrase
    let pronounData;
    if (person === "3") {
      pronounData = pronoun[number][thirdPersonGender];
    } else {
      pronounData = pronoun[number];
    }

    if (placeholder.lang === "en") {
      return pronounData.en;
    } else if (placeholder.lang === "la") {
      const caseForm = pronounData.la[placeholder.case];
      if (!caseForm) {
        console.error(
          `Pronoun person ${person} missing case: ${placeholder.case}`
        );
        return `[ERROR:${placeholder.case}]`;
      }
      return caseForm;
    }
  }

  // Handle noun placeholders
  // Special handling for "animate" category: can be either noun or pronoun
  // "person" category can only be nouns, "pronoun" type is only pronouns
  if (placeholder.canBePronoun && personMode === "pronoun") {
    // Treat as pronoun
    // Check if noun is a person marker (e.g., "PERSON:1", "PERSON:2", "PERSON:3")
    let effectivePerson = person;
    if (typeof noun === "string" && noun.startsWith("PERSON:")) {
      effectivePerson = noun.split(":")[1];
    }

    const pronoun = pronounDatabase[effectivePerson];
    if (!pronoun) {
      console.error(`Unknown person: ${effectivePerson}`);
      return `[ERROR:person${effectivePerson}]`;
    }

    // For 3rd person, use the consistent gender for this phrase
    let pronounData;
    if (effectivePerson === "3") {
      pronounData = pronoun[number][thirdPersonGender];
    } else {
      pronounData = pronoun[number];
    }

    if (placeholder.lang === "en") {
      // Handle genitive/possessive case
      if (placeholder.case === "gen") {
        return pronounData.en_poss;
      }
      // Handle independent genitive/possessive (predicative: "the book is mine")
      if (placeholder.case === "gen_indep") {
        return pronounData.en_poss_indep;
      }
      // Handle dative/objective case (dat, acc, and abl use objective form in English)
      if (placeholder.case === "dat" || placeholder.case === "acc" || placeholder.case === "abl") {
        return pronounData.en_obj;
      }
      const effectiveNumber =
        placeholder.number !== null ? placeholder.number : number;
      return effectiveNumber === "sg" ? pronounData.en : pronounData.en;
    } else if (placeholder.lang === "la") {
      // Omit subject nominative pronouns in Latin (verb endings indicate the subject)
      // But keep predicate nominatives (e.g., "ego tu sum" = "I am you")
      if (placeholder.case === "nom" && isSubjectNominative) {
        return "";
      }

      // Handle genitive case with possessive adjectives (1st and 2nd person only)
      // gen_indep is treated the same as gen in Latin
      if (
        (placeholder.case === "gen" || placeholder.case === "gen_indep") &&
        possessiveContext &&
        pronounData.la_poss
      ) {
        const possessedNoun = possessiveContext.noun;
        const gender = possessedNoun.gender || "m"; // Default to masculine if no gender
        const possCase = possessiveContext.case;
        const possNumber =
          possessiveContext.number !== null ? possessiveContext.number : number;

        const possAdj = pronounData.la_poss[gender][possCase][possNumber];
        return possAdj;
      }

      // Regular pronoun case (including 3rd person genitive which uses genitive pronoun, not possessive adjective)
      // Normalize gen_indep to gen for Latin lookup
      const effectiveCase = placeholder.case === "gen_indep" ? "gen" : placeholder.case;
      const caseForm = pronounData.la[effectiveCase];
      if (!caseForm) {
        console.error(
          `Pronoun person ${effectivePerson} missing case: ${placeholder.case}`
        );
        return `[ERROR:${placeholder.case}]`;
      }
      return caseForm;
    }
  }

  // Regular noun substitution
  const effectiveNumber =
    placeholder.number !== null ? placeholder.number : number;

  if (placeholder.lang === "en") {
    let baseForm;
    if (effectiveNumber === "pl") {
      baseForm = noun.en_pl || noun.en; // Fall back to singular if plural not available
    } else {
      baseForm = noun.en;
    }

    // Handle genitive/possessive case (gen_indep works the same for nouns)
    if (placeholder.case === "gen" || placeholder.case === "gen_indep") {
      // Add 's or ' for possessive
      if (baseForm.endsWith("s")) {
        return baseForm + "'";
      } else {
        return baseForm + "'s";
      }
    }

    return baseForm;
  } else if (placeholder.lang === "la") {
    // Normalize gen_indep to gen for Latin lookup
    const effectiveCase = placeholder.case === "gen_indep" ? "gen" : placeholder.case;
    const caseForm = noun[effectiveCase];
    if (!caseForm) {
      console.error(`Noun ${noun.en} missing case: ${placeholder.case}`);
      return `[ERROR:${noun.en}]`;
    }
    const form = caseForm[effectiveNumber];
    if (!form) {
      console.error(
        `Noun ${noun.en} missing number: ${effectiveNumber} for case: ${placeholder.case}`
      );
      return `[ERROR:${noun.en}]`;
    }
    return form;
  }

  return `[UNKNOWN:${placeholder.fullMatch}]`;
}

/**
 * Generates a single phrase from a template with specific noun choices and number
 * @param {string} enTemplate - English template
 * @param {string} laTemplate - Latin template
 * @param {object} placeholders - Parsed placeholders from both templates
 * @param {object} enNounChoices - Map of English placeholder index to chosen noun
 * @param {object} laNounChoices - Map of Latin placeholder index to chosen noun
 * @param {string} number - The number to use for verb agreement ('sg' or 'pl')
 * @param {string} tense - The tense to use ('present' or 'perfect')
 * @param {string} person - The person to use ('1', '2', '3') for verbs and pronouns
 * @param {object} enPersonModeMap - Maps English placeholder index to personMode ('noun' or 'pronoun')
 * @param {object} laPersonModeMap - Maps Latin placeholder index to personMode ('noun' or 'pronoun')
 * @param {Array<string>} selectedConjugations - Array of selected conjugation keys to filter verbs
 * @param {object} enNumberMap - Maps English placeholder index to number ('sg' or 'pl') for each noun
 * @param {object} laNumberMap - Maps Latin placeholder index to number ('sg' or 'pl') for each noun
 * @returns {object} Generated phrase {en: "...", la: "..."}
 */
function generatePhrase(
  enTemplate,
  laTemplate,
  placeholders,
  enNounChoices,
  laNounChoices,
  number,
  tense,
  person,
  enPersonModeMap,
  laPersonModeMap,
  selectedConjugations,
  enNumberMap = {},
  laNumberMap = {}
) {
  // Randomly choose "from" variant for this phrase: 'ex' = "out of"/"ex", 'a' = "from"/"a/ab"
  const fromVariant = Math.random() < 0.5 ? "ex" : "a";

  // Randomly choose gender for 3rd person pronouns (consistent across the entire phrase)
  const rand = Math.random();
  const thirdPersonGender = rand < 0.33 ? "m" : rand < 0.67 ? "f" : "n";

  // Track selected verbs for infinitives in this phrase (array maintains order)
  // Each infinitive placeholder (1st, 2nd, etc.) will use the same verb across languages
  const selectedInfinitives = [];
  const infinitiveCounters = { en: 0, la: 0 };

  // Determine subject person for verb agreement
  // English: first nominative animate/person noun placeholder (typically the subject)
  // Default to third person (for nouns), override if we find a pronoun
  let enSubjectPerson = "3";
  for (let i = 0; i < placeholders.en.length; i++) {
    const ph = placeholders.en[i];
    if (ph.type === "noun" && (ph.isPerson || ph.canBePronoun) && (ph.case === null || ph.case === "nom")) {
      if (enPersonModeMap[i] === "pronoun") {
        const subjectNoun = enNounChoices[i];
        if (
          typeof subjectNoun === "string" &&
          subjectNoun.startsWith("PERSON:")
        ) {
          enSubjectPerson = subjectNoun.split(":")[1];
        }
      }
      // Always break on first nominative person/animate placeholder (subject)
      break;
    }
  }

  // Latin: first nominative noun placeholder (the subject)
  // Default to third person (for nouns), override if we find a pronoun
  let laSubjectPerson = "3";
  for (let i = 0; i < placeholders.la.length; i++) {
    const ph = placeholders.la[i];
    if (ph.type === "noun" && (ph.isPerson || ph.canBePronoun) && ph.case === "nom") {
      if (laPersonModeMap[i] === "pronoun") {
        const subjectNoun = laNounChoices[i];
        if (
          typeof subjectNoun === "string" &&
          subjectNoun.startsWith("PERSON:")
        ) {
          laSubjectPerson = subjectNoun.split(":")[1];
        }
      }
      // Always break on first nominative person/animate placeholder (subject)
      break;
    }
  }

  // Build a map of possessive genitives to their possessed nouns (for Latin possessive adjectives)
  const laPossessiveContext = new Map();
  for (let i = 0; i < placeholders.la.length; i++) {
    const ph = placeholders.la[i];
    // If this is a genitive animate placeholder in pronoun mode, find the nearest non-animate/non-person noun
    if (
      ph.type === "noun" &&
      ph.canBePronoun &&
      (ph.case === "gen" || ph.case === "gen_indep") &&
      laPersonModeMap[i] === "pronoun"
    ) {
      // First try looking backward for the previous non-animate noun (or person noun in noun mode)
      let foundNoun = false;
      for (let j = i - 1; j >= 0; j--) {
        const prevPh = placeholders.la[j];
        if (prevPh.type === "noun" && !prevPh.canBePronoun) {
          laPossessiveContext.set(i, {
            noun: laNounChoices[j],
            case: prevPh.case,
            number: laNumberMap[j],
          });
          foundNoun = true;
          break;
        }
      }
      // If not found backward, look forward for the next non-animate noun (or person noun in noun mode)
      if (!foundNoun) {
        for (let j = i + 1; j < placeholders.la.length; j++) {
          const nextPh = placeholders.la[j];
          if (nextPh.type === "noun" && !nextPh.canBePronoun) {
            laPossessiveContext.set(i, {
              noun: laNounChoices[j],
              case: nextPh.case,
              number: laNumberMap[j],
            });
            break;
          }
        }
      }
    }
  }

  // Helper function to get the following word after a placeholder
  function getFollowingWord(
    template,
    placeholder,
    allPlaceholders,
    allReplacements
  ) {
    // Get text after this placeholder
    let textAfter = template.substring(placeholder.endIndex);

    // Find if there's another placeholder immediately after
    const nextPlaceholder = allPlaceholders.find(
      (p) =>
        p.startIndex === placeholder.endIndex ||
        (p.startIndex > placeholder.endIndex &&
          template.substring(placeholder.endIndex, p.startIndex).trim() === "")
    );

    if (nextPlaceholder) {
      // Find the replacement for this placeholder
      const replacement = allReplacements.find(
        (r) => r.startIndex === nextPlaceholder.startIndex
      );
      if (replacement) {
        textAfter = replacement.text;
      }
    }

    // Extract first word (trim and take until first space)
    textAfter = textAfter.trim();
    const spaceIndex = textAfter.indexOf(" ");
    return spaceIndex > 0 ? textAfter.substring(0, spaceIndex) : textAfter;
  }

  // Build replacement list for English (position, replacement text)
  const enReplacements = [];
  placeholders.en.forEach((ph, index) => {
    let substitution;
    if (ph.type === "from" || ph.type === "a") {
      // Skip from and a for now, we'll handle them in second pass
      return;
    } else if (ph.type === "verb" || ph.type === "pronoun" || ph.type === "verb_infinitive") {
      substitution = substitutePlaceholder(
        ph,
        null,
        number,
        tense,
        "en",
        enSubjectPerson,
        null,
        selectedConjugations,
        null,
        null,
        fromVariant,
        selectedInfinitives,
        infinitiveCounters,
        false, // Not relevant for English
        thirdPersonGender
      );
    } else {
      const noun = enNounChoices[index];
      const nounNumber =
        enNumberMap[index] !== undefined ? enNumberMap[index] : number;
      const personMode = enPersonModeMap[index];
      if (noun || (ph.canBePronoun && personMode === "pronoun")) {
        substitution = substitutePlaceholder(
          ph,
          noun,
          nounNumber,
          tense,
          "en",
          enSubjectPerson,
          personMode,
          selectedConjugations,
          null,
          null,
          fromVariant,
          selectedInfinitives,
          infinitiveCounters,
          false, // Not relevant for English
          thirdPersonGender
        );
      }
    }
    if (substitution !== undefined && substitution !== null) {
      enReplacements.push({
        startIndex: ph.startIndex,
        endIndex: ph.endIndex,
        text: substitution,
      });
    }
  });

  // Find the index of the subject nominative for Latin (to know which pronoun to omit)
  let laSubjectNominativeIndex = -1;
  for (let i = 0; i < placeholders.la.length; i++) {
    const ph = placeholders.la[i];
    if (ph.type === "noun" && (ph.isPerson || ph.canBePronoun) && ph.case === "nom") {
      laSubjectNominativeIndex = i;
      break;
    }
  }

  // Build replacement list for Latin
  const laReplacements = [];
  placeholders.la.forEach((ph, index) => {
    let substitution;
    if (ph.type === "from" || ph.type === "a") {
      // Skip from and a for now, we'll handle them in second pass
      return;
    } else if (ph.type === "verb" || ph.type === "pronoun" || ph.type === "verb_infinitive") {
      substitution = substitutePlaceholder(
        ph,
        null,
        number,
        tense,
        "la",
        laSubjectPerson,
        null,
        selectedConjugations,
        null,
        null,
        fromVariant,
        selectedInfinitives,
        infinitiveCounters,
        false, // Not a subject nominative
        thirdPersonGender
      );
    } else {
      const noun = laNounChoices[index];
      const nounNumber =
        laNumberMap[index] !== undefined ? laNumberMap[index] : number;
      const personMode = laPersonModeMap[index];
      const possCtx = laPossessiveContext.get(index);
      const isSubjectNominative = index === laSubjectNominativeIndex;
      if (noun || (ph.canBePronoun && personMode === "pronoun")) {
        substitution = substitutePlaceholder(
          ph,
          noun,
          nounNumber,
          tense,
          "la",
          laSubjectPerson,
          personMode,
          selectedConjugations,
          possCtx,
          null,
          fromVariant,
          selectedInfinitives,
          infinitiveCounters,
          isSubjectNominative,
          thirdPersonGender
        );
      }
    }
    if (substitution !== undefined && substitution !== null) {
      laReplacements.push({
        startIndex: ph.startIndex,
        endIndex: ph.endIndex,
        text: substitution,
      });
    }
  });

  // Second pass: Handle {from.en} and {a.en} placeholders for English
  placeholders.en.forEach((ph) => {
    if (ph.type === "from" || ph.type === "a") {
      const followingWord = getFollowingWord(
        enTemplate,
        ph,
        placeholders.en,
        enReplacements
      );
      const substitution = substitutePlaceholder(
        ph,
        null,
        number,
        tense,
        "en",
        enSubjectPerson,
        null,
        selectedConjugations,
        null,
        followingWord,
        fromVariant,
        selectedInfinitives,
        infinitiveCounters,
        false, // Not relevant for from/a placeholders
        thirdPersonGender
      );
      if (substitution !== undefined && substitution !== null) {
        enReplacements.push({
          startIndex: ph.startIndex,
          endIndex: ph.endIndex,
          text: substitution,
        });
      }
    }
  });

  // Second pass: Handle {from.la} and {a.la} placeholders for Latin now that we know other substitutions
  placeholders.la.forEach((ph) => {
    if (ph.type === "from" || ph.type === "a") {
      const followingWord = getFollowingWord(
        laTemplate,
        ph,
        placeholders.la,
        laReplacements
      );
      const substitution = substitutePlaceholder(
        ph,
        null,
        number,
        tense,
        "la",
        laSubjectPerson,
        null,
        selectedConjugations,
        null,
        followingWord,
        fromVariant,
        selectedInfinitives,
        infinitiveCounters,
        false, // Not relevant for from/a placeholders
        thirdPersonGender
      );
      if (substitution !== undefined && substitution !== null) {
        laReplacements.push({
          startIndex: ph.startIndex,
          endIndex: ph.endIndex,
          text: substitution,
        });
      }
    }
  });

  // Sort by position descending (replace from right to left to preserve positions)
  enReplacements.sort((a, b) => b.startIndex - a.startIndex);
  laReplacements.sort((a, b) => b.startIndex - a.startIndex);

  // Apply replacements
  let enResult = enTemplate;
  enReplacements.forEach((r) => {
    enResult =
      enResult.substring(0, r.startIndex) +
      r.text +
      enResult.substring(r.endIndex);
  });

  let laResult = laTemplate;
  laReplacements.forEach((r) => {
    laResult =
      laResult.substring(0, r.startIndex) +
      r.text +
      laResult.substring(r.endIndex);
  });

  return { en: enResult, la: laResult };
}

/**
 * Generates all combinations of phrases from a template
 * @param {string} enTemplate - English template
 * @param {string} laTemplate - Latin template
 * @param {number} maxCombinations - Maximum number of combinations to generate
 * @param {Array<string>} selectedDeclensions - Array of selected declension keys
 * @param {Array<string>} selectedTenses - Array of selected tenses ('present', 'perfect')
 * @param {Array<string>} selectedConjugations - Array of selected conjugation keys to filter verbs
 * @param {boolean} enablePronouns - Whether to generate pronoun variants for person category
 * @returns {Array<object>} Array of generated phrases
 */
function generatePhrasesFromTemplate(
  enTemplate,
  laTemplate,
  maxCombinations,
  selectedDeclensions,
  selectedTenses,
  selectedConjugations,
  enablePronouns
) {
  // Parse both templates
  const enPlaceholders = parseTemplate(enTemplate);
  const laPlaceholders = parseTemplate(laTemplate);

  // Check if this template's verbs match the selected conjugations
  const allPlaceholders = [...enPlaceholders, ...laPlaceholders];
  const verbPlaceholders = allPlaceholders.filter((ph) => ph.type === "verb");

  if (
    verbPlaceholders.length > 0 &&
    selectedConjugations &&
    selectedConjugations.length > 0
  ) {
    // Get all verb names used in this template
    const verbNames = [...new Set(verbPlaceholders.map((ph) => ph.verbName))];

    // Check if any of these verbs belong to the selected conjugations
    let hasMatchingVerb = false;
    for (const verbName of verbNames) {
      for (const conj of selectedConjugations) {
        if (
          verbsByConjugation[conj] &&
          verbsByConjugation[conj].includes(verbName)
        ) {
          hasMatchingVerb = true;
          break;
        }
      }
      if (hasMatchingVerb) break;
    }

    // If none of the verbs match the selected conjugations, return empty array
    if (!hasMatchingVerb) {
      return [];
    }
  }

  // Check if any placeholders have unspecified number (dynamic number generation)
  const hasDynamicNumber = allPlaceholders.some(
    (ph) =>
      (ph.type === "noun" && ph.number === null) ||
      ph.type === "verb" ||
      ph.type === "pronoun"
  );

  // Check if there are any verb placeholders (need tense generation)
  const hasVerbs = allPlaceholders.some((ph) => ph.type === "verb");

  // Check if there are any pronoun placeholders (need person generation)
  const hasPronouns = allPlaceholders.some((ph) => ph.type === "pronoun");

  // Check if there are any "animate" or "pronoun" category placeholders
  const hasAnimateCategory = allPlaceholders.some(
    (ph) => ph.type === "noun" && ph.canBePronoun
  );

  // Build list of noun placeholders that need choices (with their indices and categories)
  const enNounPlaceholders = enPlaceholders
    .map((ph, idx) => ({ ...ph, index: idx }))
    .filter((ph) => ph.type === "noun");
  const laNounPlaceholders = laPlaceholders
    .map((ph, idx) => ({ ...ph, index: idx }))
    .filter((ph) => ph.type === "noun");

  // Assign slots to placeholders - Nth occurrence of a category gets slot N
  // English and Latin occurrences are matched (first person in EN = first person in LA)
  const enOccurrence = {};
  const laOccurrence = {};
  const slotAssignment = {}; // Maps "category_N" to slot number
  const slotCategories = []; // Maps slot number to category

  let slotCounter = 0;

  enNounPlaceholders.forEach((ph) => {
    const category = ph.category;
    const occurrence = enOccurrence[category] || 0;
    enOccurrence[category] = occurrence + 1;

    const slotKey = `${category}_${occurrence}`;
    if (slotAssignment[slotKey] === undefined) {
      slotAssignment[slotKey] = slotCounter;
      slotCategories[slotCounter] = category;
      slotCounter++;
    }
    ph.slot = slotAssignment[slotKey];
  });

  laNounPlaceholders.forEach((ph) => {
    const category = ph.category;
    const occurrence = laOccurrence[category] || 0;
    laOccurrence[category] = occurrence + 1;

    const slotKey = `${category}_${occurrence}`;
    if (slotAssignment[slotKey] === undefined) {
      slotAssignment[slotKey] = slotCounter;
      slotCategories[slotCounter] = category;
      slotCounter++;
    }
    ph.slot = slotAssignment[slotKey];
  });

  // Determine fixed number requirements for each slot
  // If all placeholders using a slot have the same fixed number, that slot must use that number
  const slotFixedNumber = []; // Maps slot index to required number ('sg', 'pl', or null)
  for (let slotIndex = 0; slotIndex < slotCounter; slotIndex++) {
    const placeholdersInSlot = [
      ...enNounPlaceholders.filter((ph) => ph.slot === slotIndex),
      ...laNounPlaceholders.filter((ph) => ph.slot === slotIndex),
    ];

    // Check if all have the same fixed number
    const fixedNumbers = placeholdersInSlot
      .map((ph) => ph.number)
      .filter((n) => n !== null);

    if (fixedNumbers.length > 0) {
      // Check if all are the same
      const allSame = fixedNumbers.every((n) => n === fixedNumbers[0]);
      if (allSame) {
        slotFixedNumber[slotIndex] = fixedNumbers[0];
      } else {
        // Conflict: different placeholders in same slot require different numbers
        console.error(
          `Slot ${slotIndex} has conflicting number requirements:`,
          fixedNumbers
        );
        slotFixedNumber[slotIndex] = null;
      }
    } else {
      slotFixedNumber[slotIndex] = null;
    }
  }

  // Get filtered nouns for each category
  const nounsByCategory = {};
  const categories = new Set(slotCategories);
  categories.forEach((category) => {
    nounsByCategory[category] = getFilteredNouns(
      category,
      selectedDeclensions,
      enablePronouns
    );
    if (nounsByCategory[category].length === 0) {
      console.warn(
        `No nouns available for category: ${category} with selected declensions`
      );
    }
  });

  // Generate all combinations
  const generatedPhrases = [];

  // Determine which tenses to generate (only if there are new verb placeholders)
  const tensesToGenerate =
    hasVerbs && selectedTenses && selectedTenses.length > 0
      ? selectedTenses
      : ["present"];

  // Determine which persons to generate (if there are pronoun placeholders OR animate category)
  const personsToGenerate =
    hasPronouns || hasAnimateCategory ? ["1", "2", "3"] : ["3"];

  // Determine which personModes are available for "animate" category slots
  // If "animate" category exists:
  //   - If only pronouns enabled (no declensions): only 'pronoun' mode available
  //   - If only declensions enabled (no pronouns): only 'noun' mode available
  //   - If both enabled: both modes available (will be mixed per-slot)
  // Note: "person" category slots always use "noun" mode only
  const availablePersonModes = hasAnimateCategory
    ? selectedDeclensions.length > 0 && enablePronouns
      ? ["noun", "pronoun"]
      : selectedDeclensions.length > 0
      ? ["noun"]
      : enablePronouns
      ? ["pronoun"]
      : ["noun"]
    : ["noun"];

  // When pronouns/animate category are used, verb person is determined from the pronoun choice,
  // so we don't need to iterate through persons in the outer loop (avoids duplicate generation)
  const usesDynamicPerson = hasPronouns || hasAnimateCategory;
  const personsForLoop = usesDynamicPerson ? ["3"] : personsToGenerate;

  // Calculate combinations per variant
  const totalVariants = tensesToGenerate.length * personsForLoop.length;
  const combinationsPerVariant = Math.ceil(maxCombinations / totalVariants);

  // Helper function to randomly sample a value for a slot
  function sampleSlot(slotIndex, previousChoices) {
    const category = slotCategories[slotIndex];
    const availableNouns = nounsByCategory[category];
    const fixedNumber = slotFixedNumber[slotIndex];

    // Determine the number to use: fixed if specified, otherwise random
    function chooseNumber() {
      if (fixedNumber !== null) {
        return fixedNumber;
      }
      return hasDynamicNumber && Math.random() < 0.5 ? "pl" : "sg";
    }

    // For "pronoun" category, always use pronoun mode
    if (category === "pronoun") {
      const usedPersons = new Set();
      for (let i = 0; i < slotIndex; i++) {
        if (
          slotCategories[i] === "pronoun" &&
          previousChoices[i].personMode === "pronoun"
        ) {
          usedPersons.add(previousChoices[i].person);
        }
      }

      const availablePersons = personsToGenerate.filter(
        (p) => !usedPersons.has(p)
      );
      if (availablePersons.length === 0) {
        // No available persons
        return null;
      }

      const person =
        availablePersons[Math.floor(Math.random() * availablePersons.length)];
      const number = chooseNumber();

      return {
        noun: `PERSON:${person}`,
        number: number,
        personMode: "pronoun",
        person: person,
      };
    }

    // For "animate" category, randomly choose between noun and pronoun modes when both are available
    // Note: "person" category can only be nouns, so it won't enter this branch
    if (category === "animate" && availablePersonModes.includes("pronoun")) {
      // Randomly decide whether to use pronoun or noun mode
      const usePronouns =
        availablePersonModes.length === 1 || Math.random() < 0.5;

      if (usePronouns) {
        // For animate slots with pronouns, choose a random person that hasn't been used
        const usedPersons = new Set();
        for (let i = 0; i < slotIndex; i++) {
          if (
            slotCategories[i] === "animate" &&
            previousChoices[i].personMode === "pronoun"
          ) {
            usedPersons.add(previousChoices[i].person);
          }
        }

        const availablePersons = personsToGenerate.filter(
          (p) => !usedPersons.has(p)
        );
        if (availablePersons.length === 0) {
          // No available persons, fall back to noun mode if available
          if (availableNouns.length > 0) {
            const noun =
              availableNouns[Math.floor(Math.random() * availableNouns.length)];
            const number = chooseNumber();

            return {
              noun: noun,
              number: number,
              personMode: "noun",
              person: null,
            };
          }
          return null;
        }

        const person =
          availablePersons[Math.floor(Math.random() * availablePersons.length)];
        const number = chooseNumber();

        return {
          noun: `PERSON:${person}`,
          number: number,
          personMode: "pronoun",
          person: person,
        };
      }
    }

    if (availableNouns.length > 0) {
      // For other categories, or person category in noun mode, choose a random noun
      const noun =
        availableNouns[Math.floor(Math.random() * availableNouns.length)];
      const number = chooseNumber();

      return {
        noun: noun,
        number: number,
        personMode: "noun",
        person: null,
      };
    }

    return null;
  }

  // Generate phrases by random sampling
  function generateByRandomSampling(tense, person) {
    const attempts = combinationsPerVariant * 3; // Try 3x to account for duplicates
    const phrasesSet = new Set();

    for (
      let attempt = 0;
      attempt < attempts && phrasesSet.size < combinationsPerVariant;
      attempt++
    ) {
      // Sample each slot independently
      const slotChoices = [];
      let valid = true;

      for (let slotIndex = 0; slotIndex < slotCounter; slotIndex++) {
        const choice = sampleSlot(slotIndex, slotChoices);
        if (!choice) {
          valid = false;
          break;
        }
        slotChoices.push(choice);
      }

      if (!valid) continue;

      // Map slot choices to placeholder indices
      const enChoices = {};
      const laChoices = {};
      const enNumberMap = {};
      const laNumberMap = {};
      const enPersonModeMap = {};
      const laPersonModeMap = {};

      enNounPlaceholders.forEach((ph) => {
        const choice = slotChoices[ph.slot];
        enChoices[ph.index] = choice.noun;
        enNumberMap[ph.index] = choice.number;
        enPersonModeMap[ph.index] = choice.personMode;
      });

      laNounPlaceholders.forEach((ph) => {
        const choice = slotChoices[ph.slot];
        laChoices[ph.index] = choice.noun;
        laNumberMap[ph.index] = choice.number;
        laPersonModeMap[ph.index] = choice.personMode;
      });

      // Find the subject number for verb agreement
      let subjectNumber = "sg";
      for (let i = 0; i < laPlaceholders.length; i++) {
        const ph = laPlaceholders[i];
        if (ph.type === "noun" && ph.case === "nom") {
          // Use placeholder's fixed number if specified, otherwise use slot's number
          subjectNumber = ph.number !== null ? ph.number : (laNumberMap[i] || "sg");
          break;
        }
      }

      // Determine verb person from subject
      let verbPerson = person;
      for (let i = 0; i < enPlaceholders.length; i++) {
        const ph = enPlaceholders[i];
        if (ph.type === "noun" && (ph.category === "person" || ph.category === "animate")) {
          if (enPersonModeMap[i] === "pronoun") {
            const choice =
              slotChoices[enNounPlaceholders.find((p) => p.index === i).slot];
            verbPerson = choice.person;
          }
          break;
        }
      }

      const phrase = generatePhrase(
        enTemplate,
        laTemplate,
        { en: enPlaceholders, la: laPlaceholders },
        enChoices,
        laChoices,
        subjectNumber,
        tense,
        verbPerson,
        enPersonModeMap,
        laPersonModeMap,
        selectedConjugations,
        enNumberMap,
        laNumberMap
      );

      // Use a string representation to detect duplicates
      const key = `${phrase.en}|||${phrase.la}`;
      if (!phrasesSet.has(key)) {
        phrasesSet.add(key);
        generatedPhrases.push(phrase);
      }
    }
  }

  // Generate combinations for each tense and person variant
  // Use random sampling for better distribution
  tensesToGenerate.forEach((tense) => {
    personsForLoop.forEach((person) => {
      generateByRandomSampling(tense, person);
    });
  });

  return generatedPhrases;
}

/**
 * Expands template entries in a phrases array
 * Processes template objects and converts them to regular phrase objects
 * All template instantiations are pooled together and then sampled
 * @param {Array} phrasesArray - Array that may contain template objects
 * @param {Array<string>} selectedDeclensions - Array of selected declension keys
 * @param {Array<string>} selectedTenses - Array of selected tenses ('present', 'perfect')
 * @param {Array<string>} selectedConjugations - Array of selected conjugation keys to filter verbs
 * @param {boolean} enablePronouns - Whether to generate pronoun variants for person category
 * @returns {Array<object>} Array with templates expanded into regular phrases
 */
function expandTemplates(
  phrasesArray,
  selectedDeclensions,
  selectedTenses,
  selectedConjugations,
  enablePronouns
) {
  const regularPhrases = [];
  const allTemplateInstantiations = [];
  let totalCombinationsRequested = 0;

  // First pass: separate regular phrases from templates and generate all template instantiations
  phrasesArray.forEach((item) => {
    if (item.combinations !== undefined || (item.en && item.en.includes("{"))) {
      // This is a template - generate ALL possible instantiations (up to a reasonable limit)
      const combinations =
        item.combinations !== undefined ? item.combinations : 10;
      totalCombinationsRequested += combinations;

      // Generate all instantiations from this template (use a high limit to get all)
      const generated = generatePhrasesFromTemplate(
        item.en,
        item.la,
        100,
        selectedDeclensions,
        selectedTenses,
        selectedConjugations,
        enablePronouns
      );
      allTemplateInstantiations.push(...generated);
    } else {
      // Regular phrase, keep as-is
      regularPhrases.push(item);
    }
  });

  // Sample from the pool of all template instantiations
  let sampledTemplates = [];
  if (allTemplateInstantiations.length > 0) {
    if (totalCombinationsRequested >= allTemplateInstantiations.length) {
      // If we want more combinations than available, use all of them
      sampledTemplates = allTemplateInstantiations;
    } else {
      // Randomly sample the requested number of combinations from the pool
      const shuffled = [...allTemplateInstantiations];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      sampledTemplates = shuffled.slice(0, totalCombinationsRequested);
    }
  }

  return [...regularPhrases, ...sampledTemplates];
}
