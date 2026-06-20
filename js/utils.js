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

// Prepositions: used for grading (all treated as equivalent) and in AI prompt.
// All prepositions collapse to a single token, so the learner is never penalized for choosing
// a different (but plausible) preposition - only the noun's case still distinguishes answers.
// NOTE: words that are also content-word forms are deliberately excluded, e.g. "secundum"
// (acc. of secundus, "second") - adding it would mis-grade that adjective.
const PREPOSITIONS = [
  "a", "ab", "ad", "adversus", "ante", "apud", "circa", "circum", "citra", "contra",
  "coram", "cum", "de", "e", "erga", "ex", "extra", "in", "infra", "inter", "intra",
  "iuxta", "ob", "per", "post", "prae", "praeter", "pro", "prope", "propter", "sine",
  "sub", "super", "supra", "trans", "ultra",
];

const PREPOSITION_REGEX = new RegExp(`\\b(${PREPOSITIONS.join("|")})\\b`, "g");

// Conjunctions grouped by meaning - within each group, all forms are treated as equivalent for grading.
const CONJUNCTION_REGEX = /\b(et|atque|ac)\b/g;                    // "and"
const NEGATIVE_CONJUNCTION_REGEX = /\b(nec|neque)\b/g;             // "nor"

// Particles grouped by meaning - within each group, all forms are treated as equivalent for grading.
const DISJUNCTIVE_REGEX = /\b(aut|vel|sive|seu|an)\b/g;            // "or"
const CAUSAL_REGEX = /\b(nam|enim|namque|etenim)\b/g;              // "for"
const CONCLUSIVE_REGEX = /\b(ergo|igitur|itaque|ideo|idcirco|quare|quapropter|quamobrem|proinde|quocirca)\b/g; // "therefore"
const ADVERSATIVE_REGEX = /\b(sed|autem|atqui|attamen|veruntamen|verumtamen|tamen|at)\b/g; // "but" (verum/vero/ceterum excluded - they collide with vērus/cēterus)
const ADDITIVE_REGEX = /\b(quoque|etiam|item|itidem|insuper|praeterea)\b/g; // "also"

// Subordinators grouped by meaning - within each group, all forms are treated as equivalent for grading.
// "ut/uti" are folded into "as": grading is word-set based, so a purpose/result "ut" will also be
// accepted where the answer expects "as" (and vice versa). This is intentional leniency - the
// learner still sees the correct word and should not be penalized for a near-synonym.
const COMPARISON_REGEX = /\b(sicut|sicuti|velut|veluti|ut|uti|quemadmodum|prout|quasi|tamquam|tanquam|ceu)\b/g; // "as, as if"
const BECAUSE_REGEX = /\b(quod|quia|quoniam)\b/g;                  // "because"
const CONCESSIVE_REGEX = /\b(quamquam|quamvis|etsi|etiamsi|tametsi|licet)\b/g; // "although"
const BEFORE_REGEX = /\b(antequam|priusquam)\b/g;                 // "before" (kept distinct from "after")
const AFTER_REGEX = /\b(postquam|posteaquam)\b/g;                 // "after"
const WHILE_REGEX = /\b(dum|donec|quoad)\b/g;                     // "while, until"

// Adverbial particles grouped by meaning - within each group, all forms are treated as equivalent.
const THEN_REGEX = /\b(tum|tunc|deinde|dein|exinde|exin|inde)\b/g; // "then, next"
const AGAIN_REGEX = /\b(rursus|rursum|iterum|denuo)\b/g;           // "again"
const THUS_REGEX = /\b(sic|ita)\b/g;                              // "thus, so"
const PERHAPS_REGEX = /\b(fortasse|fortassis|forsan|forsitan)\b/g; // "perhaps" (forte excluded - collides with fortis)

// Forms of "volo" that contract with a preceding "non" to form the corresponding nolo form.
// 2sg/3sg/2pl of the present indicative (non vis, non vult, non vultis) don't contract and are left as-is.
// Imperatives (noli, nolite) have no "non + X" equivalent.
const NOLO_CONTRACTIONS = {
  // Present indicative (only 1sg/1pl/3pl contract)
  volo: "nolo", volumus: "nolumus", volunt: "nolunt",
  // Imperfect indicative
  volebam: "nolebam", volebas: "nolebas", volebat: "nolebat",
  volebamus: "nolebamus", volebatis: "nolebatis", volebant: "nolebant",
  // Future indicative
  volam: "nolam", voles: "noles", volet: "nolet",
  volemus: "nolemus", voletis: "noletis", volent: "nolent",
  // Perfect indicative (voluere is the alternative 3pl)
  volui: "nolui", voluisti: "noluisti", voluit: "noluit",
  voluimus: "noluimus", voluistis: "noluistis",
  voluerunt: "noluerunt", voluere: "noluere",
  // Pluperfect indicative
  volueram: "nolueram", volueras: "nolueras", voluerat: "noluerat",
  volueramus: "nolueramus", volueratis: "nolueratis", voluerant: "noluerant",
  // Future perfect indicative (2sg/1pl/2pl/3pl are spelled identically to perfect subjunctive)
  voluero: "noluero", volueris: "nolueris", voluerit: "noluerit",
  voluerimus: "noluerimus", volueritis: "nolueritis", voluerint: "noluerint",
  // Perfect subjunctive 1sg (others already covered above)
  voluerim: "noluerim",
  // Present subjunctive
  velim: "nolim", velis: "nolis", velit: "nolit",
  velimus: "nolimus", velitis: "nolitis", velint: "nolint",
  // Imperfect subjunctive
  vellem: "nollem", velles: "nolles", vellet: "nollet",
  vellemus: "nollemus", velletis: "nolletis", vellent: "nollent",
  // Pluperfect subjunctive
  voluissem: "noluissem", voluisses: "noluisses", voluisset: "noluisset",
  voluissemus: "noluissemus", voluissetis: "noluissetis", voluissent: "noluissent",
  // Infinitives
  velle: "nolle", voluisse: "noluisse",
  // Present participle (used adjectivally, declines like a 3rd-decl. adjective)
  volens: "nolens", volentis: "nolentis", volenti: "nolenti",
  volentem: "nolentem", volente: "nolente",
  volentes: "nolentes", volentia: "nolentia",
  volentium: "nolentium", volentibus: "nolentibus",
};

const NOLO_REGEX = new RegExp(`\\bnon\\s+(${Object.keys(NOLO_CONTRACTIONS).join("|")})\\b`, "g");

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // Drop macrons.
    .replace(/—/g, " ") // Replace em-dashes with spaces (before dropping punctuation).
    .replace(/[.,;:\-!?"'()«»]/g, "") // Drop punctuation.
    .replace(/\s{2,}/g, " ") // Drop double spaces.
    .trim()
    .toLowerCase()
    // These groups must run BEFORE -que stripping: words like "itaque", "quoque", "namque",
    // "atque", "neque" end in -que but are not enclitic forms - they must be matched whole first.
    .replace(CONJUNCTION_REGEX, "CONJ") // Treat "and" forms (et/atque/ac) as equivalent.
    .replace(NEGATIVE_CONJUNCTION_REGEX, "NEC") // Treat "nor" forms (nec/neque) as equivalent.
    .replace(DISJUNCTIVE_REGEX, "DISJ") // Treat "or" particles (aut/vel/sive/seu/an) as equivalent.
    .replace(CAUSAL_REGEX, "CAUSAL") // Treat causal particles (nam/enim/etc.) as equivalent.
    .replace(CONCLUSIVE_REGEX, "CONCL") // Treat conclusive particles (ergo/igitur/etc.) as equivalent.
    .replace(ADVERSATIVE_REGEX, "ADVERS") // Treat adversative particles (sed/autem/etc.) as equivalent.
    .replace(ADDITIVE_REGEX, "ADDIT") // Treat additive particles (quoque/etiam/etc.) as equivalent.
    .replace(COMPARISON_REGEX, "AS") // Treat "as/as if" forms (sicut/ut/velut/quasi/etc.) as equivalent.
    .replace(BECAUSE_REGEX, "BECAUSE") // Treat causal subordinators (quod/quia/quoniam) as equivalent.
    .replace(CONCESSIVE_REGEX, "ALTHOUGH") // Treat concessive subordinators (quamquam/etsi/etc.) as equivalent.
    .replace(BEFORE_REGEX, "BEFORE") // Treat "before" subordinators (antequam/priusquam) as equivalent.
    .replace(AFTER_REGEX, "AFTER") // Treat "after" subordinators (postquam/posteaquam) as equivalent.
    .replace(WHILE_REGEX, "WHILE") // Treat "while/until" subordinators (dum/donec/quoad) as equivalent.
    .replace(THEN_REGEX, "THEN") // Treat "then/next" adverbs (tum/tunc/deinde/etc.) as equivalent.
    .replace(AGAIN_REGEX, "AGAIN") // Treat "again" adverbs (rursus/iterum/denuo) as equivalent.
    .replace(THUS_REGEX, "THUS") // Treat "thus/so" adverbs (sic/ita) as equivalent.
    .replace(PERHAPS_REGEX, "PERHAPS") // Treat "perhaps" adverbs (fortasse/forsan/etc.) as equivalent.
    .replace(/(\w)que\b/g, "$1 CONJ") // Convert -que suffix to word + CONJ.
    .replace(PREPOSITION_REGEX, "PREP") // Treat all prepositions as equivalent.
    .replace(/\b(dei|di|dii)\b/g, "DEI") // Treat nominative plural of "deus" as equivalent.
    .replace(/\b(deis|dis|diis)\b/g, "DEIS") // Treat dative/ablative plural of "deus" as equivalent.
    .replace(/\bmecum\b/g, "PREP me") // Normalize cum + pronoun enclitics.
    .replace(/\btecum\b/g, "PREP te")
    .replace(/\bsecum\b/g, "PREP se")
    .replace(/\bnobiscum\b/g, "PREP nobis")
    .replace(/\bvobiscum\b/g, "PREP vobis")
    // Normalize uncontracted "non + volo form" to the contracted nolo form (e.g. "non volo" -> "nolo").
    .replace(NOLO_REGEX, (_, word) => NOLO_CONTRACTIONS[word])
    // Normalize contracted/uncontracted perfect forms of eo, ire (to go).
    .replace(/\bivit\b/g, "iit")
    .replace(/\bivisti\b/g, "iisti")
    .replace(/\biverunt\b/g, "ierunt")
    .replace(/\bivimus\b/g, "iimus")
    .replace(/\bivistis\b/g, "iistis")
    .replace(/\biveram\b/g, "ieram")
    .replace(/\biveras\b/g, "ieras")
    .replace(/\biverat\b/g, "ierat")
    .replace(/\biveramus\b/g, "ieramus")
    .replace(/\biveratis\b/g, "ieratis")
    .replace(/\biverant\b/g, "ierant");
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
  const OPTIONAL_SUBJECT_PRONOUNS = [
    "ego", "tu", "nos", "vos",
    "is", "ea", "id", "ei", "eae",           // is, ea, id
    "ille", "illa", "illud", "illi", "illae",  // ille, illa, illud
  ];

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

  // Check if all remaining words on both sides are optional words
  // (subject pronouns or reflexive possessives)
  if (longerCopy.every((w) => OPTIONAL_WORDS.includes(w)) && shorterCopy.every((w) => OPTIONAL_WORDS.includes(w))) {
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
