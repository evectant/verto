const romanNumerals = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRoman(num) {
  if (num === 0) {
    return "";
  }

  for (let i = 0; i < romanNumerals.length; i++) {
    if (num >= romanNumerals[i][0]) {
      return romanNumerals[i][1] + toRoman(num - romanNumerals[i][0]);
    }
  }
}

// Prepositions: used for grading (all treated as equivalent) and in AI prompt
const PREPOSITIONS = ["a", "ab", "ad", "cum", "de", "e", "ex", "in", "sine"];
const PREPOSITION_REGEX = new RegExp(`\\b(${PREPOSITIONS.join("|")})\\b`, "g");

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // Drop macrons.
    .replace(/[.,:\-—!?'()]/g, "") // Drop punctuation.
    .replace(/\s{2,}/g, " ") // Drop double spaces.
    .trim()
    .toLowerCase()
    .replace(/(\w)que\b/g, "$1 CONJ") // Convert -que suffix to word + CONJ.
    .replace(/\bet\b/g, "CONJ") // Convert et to CONJ.
    .replace(PREPOSITION_REGEX, "PREP"); // Treat all prepositions as equivalent.
}

function haveSameWords(phrase1, phrase2) {
  function toSortedWords(text) {
    return text.split(/\s+/).filter((w) => w).sort();
  }

  const words1 = toSortedWords(normalize(phrase1));
  const words2 = toSortedWords(normalize(phrase2));

  // Latin subject pronouns that can be omitted (nominative case)
  // ego (I), tu (you sg.), nos (we), vos (you pl.),
  // is/ea/id (he/she/it), ei/eae/ea (they)
  const OPTIONAL_SUBJECT_PRONOUNS = ["ego", "tu", "nos", "vos", "is", "ea", "id", "ei", "eae"];

  // Reflexive possessive adjective "suus, sua, suum" - all forms
  // Often omitted in Latin when context makes possession clear
  const OPTIONAL_REFLEXIVE_POSSESSIVES = [
    "suus", "sua", "suum",           // nom sg
    "sui", "suae",                   // gen sg (m/n, f)
    "suo", "suae",                   // dat sg (m/n, f)
    "suum", "suam",                  // acc sg (m, f)
    "suo", "sua",                    // abl sg (m/n, f)
    "sui", "suae", "sua",            // nom pl
    "suorum", "suarum",              // gen pl
    "suis",                          // dat/abl pl
    "suos", "suas",                  // acc pl
  ];

  const OPTIONAL_WORDS = [...OPTIONAL_SUBJECT_PRONOUNS, ...OPTIONAL_REFLEXIVE_POSSESSIVES];

  // Try exact match first
  if (words1.length === words2.length) {
    let allMatch = true;
    for (let i = 0; i < words1.length; i++) {
      if (words1[i] !== words2[i]) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) {
      return true;
    }
  }

  // If lengths differ, check if the difference is only optional subject pronouns
  // This allows either the user or the correct answer to omit subject pronouns
  const longer = words1.length > words2.length ? words1 : words2;
  const shorter = words1.length > words2.length ? words2 : words1;

  // Find words that are in the longer phrase but not in the shorter
  const longerCopy = [...longer];
  const shorterCopy = [...shorter];

  // Remove all matching words
  for (let i = longerCopy.length - 1; i >= 0; i--) {
    const matchIndex = shorterCopy.indexOf(longerCopy[i]);
    if (matchIndex !== -1) {
      longerCopy.splice(i, 1);
      shorterCopy.splice(matchIndex, 1);
    }
  }

  // Check if all remaining words in the longer phrase are optional words
  // (subject pronouns or reflexive possessives) and there are no remaining words in the shorter phrase
  if (shorterCopy.length === 0 && longerCopy.every((w) => OPTIONAL_WORDS.includes(w))) {
    return true;
  }

  return false;
}

function shuffle(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getColoredFeedback(userInput, correctPhrase) {
  const originalUserWords = userInput.split(/\s+/).filter((w) => w);
  const userWordsUsed = originalUserWords.map(() => false);
  const correctWords = correctPhrase.split(/\s+/);

  // Count occurrences of each normalized user word (with indices for tracking).
  const userWordCounts = {};
  for (let i = 0; i < originalUserWords.length; i++) {
    const normalized = normalize(originalUserWords[i]);
    if (!userWordCounts[normalized]) {
      userWordCounts[normalized] = [];
    }
    userWordCounts[normalized].push(i);
  }

  // Build colored output for correct phrase.
  const coloredCorrect = correctWords
    .map((word) => {
      const normalizedWord = normalize(word);
      if (userWordCounts[normalizedWord]?.length > 0) {
        const idx = userWordCounts[normalizedWord].shift();
        userWordsUsed[idx] = true;
        return `<span style="color: #66BB6A">${word}</span>`;
      } else {
        return `<span style="color: #EF5350">${word}</span>`;
      }
    })
    .join(" ");

  // Collect extra words the user typed that weren't in the correct answer.
  const extraWords = originalUserWords.filter((_, i) => !userWordsUsed[i]);

  if (extraWords.length > 0) {
    const coloredExtra = extraWords
      .map((word) => `<span style="color: #FFA726">${word}</span>`)
      .join(" ");
    return coloredCorrect + " (" + coloredExtra + ")";
  }

  return coloredCorrect;
}
