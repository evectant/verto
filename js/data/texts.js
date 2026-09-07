// Library of authentic Latin texts, translated into English unit by unit for the Textus mode.
//
// ===== 1. Files and loading =====
// - Each text lives in its own file under js/data/texts/ and registers itself by calling
//   registerText({...}). index.html loads this file first and then one <script> per text, in the
//   order the dropdown should list them: reading order within a work, works in chronological
//   order (Nepos before Jacobus de Voragine).
// - registerText validates the shape and throws, so a malformed or half-translated file fails
//   loudly in the console instead of showing empty prompts.
// - Each file opens with a comment naming the work and author, saying what "ref" counts, and
//   listing any corrections made to the source page (see 3).
// - Texts are prepared by hand from a source page (The Latin Library, Wikisource): split the Latin
//   into units, translate each unit, write js/data/texts/<id>.js, add the <script> tag. The pages
//   themselves are not kept in the repo; "source" records where the Latin came from.
//
// ===== 2. Shape =====
//   registerText({
//     id: "nepos-praefatio",         // stable "author-title" key; remembers the dropdown selection
//     title: "Praefatio",            // Latin title, as shown in the dropdown
//     author: "Cornelius Nepos",     // dropdown shows "title (author)"; optional
//     source: "https://...",         // where the Latin came from; optional
//     sentences: [
//       { ref: "2", la: "...", en: "..." },
//     ],
//   });
// - "en" is the prompt shown to the learner and "la" is the expected answer, exactly like the
//   phrases in every other mode, so grading and the end-of-text display work unchanged.
// - "ref" locates the unit in the source (optional): "chapter.section" where the page has [N]
//   chapters with numbered sections, the bare section number where it has only sections, the
//   paragraph number where it has no numbering at all. A unit that straddles a boundary takes the
//   section it starts in.
//
// ===== 3. The Latin =====
// - Copy the source verbatim: spelling (coelo, harundinem), punctuation, numerals ("annos LX", not
//   sexaginta). No macrons - the sources have none, and grading ignores them anyway.
// - The only edits are typographic: drop the [N] chapter and section numbers, and lowercase words
//   the page sets in capitals for emphasis (REGES -> reges).
// - Correct obvious transcription errors in the page - OCR slips (exrraxit -> extraxit), a lost or
//   stray space, "!" scanned for "?", a missing closing quote - and list every correction in the
//   file's header comment. A correction that is not self-evident is a reconstruction: mark it as
//   such there so it can be checked against a printed edition.
// - Check the result against the page while it is at hand: joining all units with single spaces
//   must reproduce its text, minus the markers and with the listed corrections applied, character
//   for character.
//
// ===== 4. Splitting into units =====
// - Aim for units of up to about 15 Latin words. Avoid splits that leave very small units;
//   it is better to go over 15 than to leave a scrap.
// - Prefer splitting at semicolons and colons. Otherwise split before the word that opens the next
//   clause: a conjunction (et, neque, sed, at, or -que on that word), a relative (qui, quae, quod,
//   quorum ...), or a subordinator (cum, ut, dum, si, quod, quoniam, nisi ...). The comma stays
//   with the unit it closes.
// - Never tear a main clause around an embedded clause ("Philippus ..., cum spectatum ludos iret,
//   ... occisus est" stays whole): the leftovers would be verbless scraps.
// - Never separate a verb from its own subject or object. A unit is a clause, a coordinated group
//   of clauses, or a self-contained phrase such as an appositive list after a colon.
// - Keep a subordinate clause with two coordinated verbs together when the second would lose its
//   trigger ("dum iam novem diaetas fecisset et in quodam loco quiesceret"): a unit read on its
//   own must still show why its verb is subjunctive.
// - Short sentences, typically turns of dialogue, ride together in one unit ('Et ille: "Vexo
//   vexantem me."' joins the question it answers) as long as the unit stays within the limit.
// - A quotation may run across several units; a unit then opens a quotation mark that a later
//   unit closes. Never add or drop quotation marks to balance a unit on its own.
// - Units are contiguous spans in source order. Each keeps its own trailing punctuation and starts
//   lowercase when it continues a sentence; the English mirrors both, so the units read in order
//   and the end-of-text display reassembles the original text. The Textus mode never shuffles.
//
// ===== 5. The English =====
// General:
// - Translate literally, even if the English is stiff: every content word in the English
//   corresponds to a word in the Latin, and every Latin content word appears in the English. Keep
//   the Latin's part of speech and clause order where English allows - a noun stays a noun, a
//   repeated verb stays repeated, a genitive stays "of ..." ("much of blood" - multum sanguinis).
// - Use the vocabulary glosses in js/data/ (nouns.js, verbs.js, adjectives.js) when they fit the
//   sense - mos "custom", convivium "feast", genus "kind", terrere "frighten", onus "burden" - so
//   the Textus and Vocabula modes agree. Depart when the text means something else: turpis is
//   "shameful" in Nepos, not "ugly"; his imperatores are "generals", not "emperor"; caelum is
//   "heaven" when hell is the other pole, and arena in a sack is "sand". Keep one gloss per Latin
//   word within a text (mos is "custom" throughout the Praefatio), and give two Latin words that
//   share a natural gloss different English so the learner can tell them apart: reperire
//   "discover" beside invenire "find", defunctus "deceased" beside mortuus "dead", requirere
//   "inquire" beside interrogare "ask".
// - Proper names take their standard English forms (Cimon, Epaminondas, Satan); Greek loanwords
//   and forms of address stay as the author wrote them (gynaeconitis, Abba).
// - Fixed idioms get their standard English equivalent rather than word for word: "cum ... tum" is
//   "not only ... but also", "laudi ducitur" is "is reckoned as praise", "gratias egit" is "gave
//   thanks". The learner meets the idiom in the feedback.
//
// Brackets:
// - Words that English needs but the Latin lacks go in square brackets: an implied object ("met
//   [him] returning", "placed [them] at his head"), an implied verb ("And he [said]:", "[To] whom
//   Macarius [said]:"), an implied possessive ("[his] wife"), a connective ("held [as] a sin",
//   "[that it] is mentioned"), the noun a substantive adjective or pronoun needs ("the [one] vexing
//   me", "only one [thing]", "the same [things]" - eadem, "After these [things]" - haec). Articles
//   never need brackets, and neither do subject pronouns (see Pronouns below).
// - Indirect statement: bracket the "that" of an accusative and infinitive ("answered [that] it had
//   been a pagan" - se fuisse), but not a "that" the Latin supplies ("answered that it was" - quod
//   esset).
// - Every English preposition that stands in for a bare Latin case is bracketed - ablative of
//   means, cause, manner, respect, comparison, time, or place, and the dative: "shouting [with] a
//   great voice" (voce magna), "converted him [by] his own exhortation" (sua exhortatione), "[for]
//   six months" (sex mensibus), "holier [than] all" (omnibus), "[at] Lacedaemon" (Lacedaemoni),
//   "said [to] him" (ei), "shameful [for] Cimon" (Cimoni). A preposition the Latin actually has
//   stays plain: "in the desert" (in deserto), "by hornets" (a scabronibus), "with us" (nobiscum).
// - The exception is "of" for a genitive, which stays plain like the articles. A bracketed "[of]"
//   therefore signals some other case: "worthy [of] the characters" (personis), "deprived [of]
//   life" (vita).
// - Prefer a one-word gloss over a phrase containing a preposition the Latin lacks: "finally"
//   rather than "in short" for denique, "lacking" rather than "in need of" for indigens. Verb
//   particles ("passing by" for transeuntem) and adverbial phrases ("at all" for penitus, "at
//   least" for saltem) are fine.
//
// Tense, voice, mood:
// - Mirror the Latin tense even where English would prefer another: "when they will read"
//   (legent), "if these will have learned" (didicerint), "will have ..." for every future perfect.
// - The imperfect is progressive or habitual ("were using" - uterentur, "used to have" -
//   habebam), the perfect is simple past or "has ..." ("fled" - fugerunt, "You have conquered" -
//   vicisti), the pluperfect is "had ..." ("had prayed" - orasset).
// - The present passive is "is ..." ("is called" - vocatur), the perfect passive "was ..." or "has
//   been ..." ("have been sanctified" - sanctificati sunt), the pluperfect passive "had been ..."
//   ("had been buried" - sepulta erant). Use "is being ..." or "was being ..." only for an action
//   in progress ("was being troubled" - molestabatur).
// - English has no marker for the subjunctive. Render the clause's sense - "when", "since",
//   "although" for cum, "so that ... may" for ut, "who would" for a relative clause of
//   characteristic - and let the learner supply the mood. This is why a unit must keep its
//   trigger (see 4).
// - Participles stay participles ("rising and placing" - surgens et imponens, "redeemed [by] the
//   blood of Christ" - sanguine redempti); an ablative absolute is "[with] ..." plus the participle
//   ("[with their] alliance dissolved" - societate dissoluta).
//
// Pronouns and annotations:
// - suus is "his own" / "her own" / "their own" ("his own cell" - cellam suam); eius and eorum are
//   "his" and "their" ("at his head" - ad caput eius). Otherwise hic and ille keep their
//   demonstrative force ("that body" - corpori illi, "from that [one]" - de illo, "among those
//   [men]" - apud illos), except as a bare subject, where ille is "he" or "it" - or "that [man]"
//   when the reference would otherwise be unclear ("that [man] said" - ille ait).
// - Subject pronouns implied by the verb are written without brackets ("he said", "it is
//   reckoned", "she is admitted"); grading treats them as optional either way.
// - When an English word is ambiguous in gender or number, annotate it in parentheses:
//   "friend (f.)", "you (pl.)".
//
// ===== 6. Why so literal: how grading works =====
// - The learner's Latin is compared to "la" as a set of normalized words (see utils.js): word
//   order is free, macrons and punctuation are ignored, all prepositions count as one token,
//   synonymous conjunctions and particles are interchangeable, and subject pronouns and forms of
//   suus are optional. Everything else must match word for word: one word wrong, extra, or missing
//   is "almost" (half credit), anything more is wrong.
// - So the English must make every other content word recoverable, and a bracketed preposition
//   matters: an unbracketed "by" invites an "a/ab" the source does not have, which turns a correct
//   answer into an "almost".
//
// ===== 7. Checks before adding the <script> tag =====
// - The file loads without registerText throwing: every unit has both "la" and "en".
// - The joined units reproduce the source page with the listed corrections applied (see 3), and
//   the quotation marks in the reassembled text balance.
// - Each unit's English ends with the same punctuation as its Latin and starts in the same case,
//   quotation marks and brackets aside.
// - Every plain English preposition corresponds to a preposition in the Latin of the same unit.
// - No unit is far over the length limit, and none is a 4-5 word scrap, unless a single clause
//   forced it (see 4).

const textLibrary = [];

// Validate a text and add it to the library. Throws on malformed input so a broken or
// half-translated file fails loudly in the console instead of showing empty prompts.
function registerText(text) {
  if (!text || typeof text.id !== "string" || !text.id.trim()) {
    throw new Error("registerText: text is missing an id");
  }
  if (textLibrary.some((t) => t.id === text.id)) {
    throw new Error(`registerText: duplicate text id "${text.id}"`);
  }
  if (typeof text.title !== "string" || !text.title.trim()) {
    throw new Error(`registerText("${text.id}"): text is missing a title`);
  }
  if (!Array.isArray(text.sentences) || text.sentences.length === 0) {
    throw new Error(`registerText("${text.id}"): text has no sentences`);
  }
  text.sentences.forEach((sentence, i) => {
    const hasLatin = typeof sentence.la === "string" && sentence.la.trim();
    const hasEnglish = typeof sentence.en === "string" && sentence.en.trim();
    if (!hasLatin || !hasEnglish) {
      throw new Error(`registerText("${text.id}"): sentence ${i + 1} is missing "la" or "en"`);
    }
  });
  textLibrary.push(text);
}
