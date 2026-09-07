// De sancto Macario - Jacobus de Voragine, Legenda aurea
// See js/data/texts.js for the format. "ref" is the paragraph number on the Wikisource page.
//
// Corrections to the Wikisource transcription (OCR slips), applied to the Latin below:
// - "exrraxit" -> "extraxit"
// - "humens suis" -> "humeris suis"
// - "illuc ivit ei fratrem" -> "illuc ivit et fratrem"
// - "evenerti occurrit senex" -> "Revertenti occurrit senex" (RECONSTRUCTION: the page is garbled
//   here; "revertenti" fits the letters and the grammar, but check against a printed edition)
// - "coelo.Cui" -> "coelo. Cui" and 'pendunt. "' -> 'pendunt."' (spacing)
// - closing quote added after "parietes istius cellae custodio."
// - "!" -> "?" at the end of the eight questions ("Quo vadis!", "Quid fecisti!", ...)

registerText({
  id: "voragine-macario",
  title: "De sancto Macario",
  author: "Jacobus de Voragine",
  source: "https://la.wikisource.org/wiki/Legenda_aurea/De_sancto_Macario",
  sentences: [
    {
      ref: "1",
      la: "Macarius abbas descendit per vastitatem deserti",
      en: "Macarius the abbot went down through the vastness of the desert",
    },
    {
      ref: "1",
      la: "et intravit dormire in monumentum, ubi sepulta erant corpora paganorum,",
      en: "and entered into a tomb to sleep, where the bodies of pagans had been buried,",
    },
    {
      ref: "1",
      la: "et extraxit unum corpus sub caput suum tamquam pulvinarium.",
      en: "and drew out one body under his own head as a pillow.",
    },
    {
      ref: "1",
      la: "Daemones autem volentes eum terrere vocabant quasi unam mulierem dicentes:",
      en: "But the demons, wanting to frighten him, were calling as if [to] one woman, saying:",
    },
    {
      ref: "1",
      la: "\"Surge et veni nobiscum ad balneum.\"",
      en: "\"Rise and come with us to the bath.\"",
    },
    {
      ref: "1",
      la: "Et alter daemon sub ipso tamquam ex mortuo illo dicebat:",
      en: "And another demon under [him] himself, as if from that dead [man], was saying:",
    },
    {
      ref: "1",
      la: "\"Peregrinum quendam habeo super me, non possum venire.\"",
      en: "\"I have a certain stranger upon me, I cannot come.\"",
    },
    {
      ref: "1",
      la: "Ille autem non expavit, sed respondebat corpori illi dicens: \"Surge et vade, si potes.\"",
      en: "But he did not become frightened, but was answering that body, saying: \"Rise and go, if you can.\"",
    },
    {
      ref: "1",
      la: "Et audientes daemones fugerunt voce magna clamantes: \"Vicisti nos, domine.\"",
      en: "And the demons, hearing [this], fled, shouting [with] a great voice: \"You have conquered us, master.\"",
    },
    {
      ref: "2",
      la: "Dum aliquando abbas Macarius in palude ad cellam suam praeteriret,",
      en: "While once the abbot Macarius was passing by in the marsh to his own cell,",
    },
    {
      ref: "2",
      la: "occurrit ei diabolus cum falce messoria et volens eum cum falce percutere non potuit.",
      en: "the devil met him with a reaping sickle and, wanting to strike him with the sickle, could not.",
    },
    {
      ref: "2",
      la: "Et dixit ei: \"Multam violentiam patior a te, Macari, quia non possum praevalere adversum te.",
      en: "And he said [to] him: \"I suffer much violence from you, Macarius, because I cannot prevail against you.",
    },
    {
      ref: "2",
      la: "Ecce enim quidquid tu facis, et ego facio.",
      en: "For behold, whatever you do, I also do.",
    },
    {
      ref: "2",
      la: "Ieiunas tu, et ego penitus non comedo, vigilas tu, et ego modo non dormio.",
      en: "You fast, and I do not eat at all, you keep watch, and I simply do not sleep.",
    },
    {
      ref: "2",
      la: "Unum est solummodo, in quo me superas.\"",
      en: "There is only one [thing], in which you surpass me.\"",
    },
    {
      ref: "2",
      la: "Et dixit abbas: \"Quid est illud?\"",
      en: "And the abbot said: \"What is that?\"",
    },
    {
      ref: "2",
      la: "Cui ille: \"Humilitas tua, per quam non praevaleo adversum te.\"",
      en: "[To] whom he [said]: \"Your humility, through which I do not prevail against you.\"",
    },
    {
      ref: "3",
      la: "Dum tentationes ipsum iuvenem molestarent,",
      en: "While temptations were troubling the young man himself,",
    },
    {
      ref: "3",
      la: "surgens et magnum saccum arenae humeris suis imponens diebus multis sic per desertum ibat.",
      en: "rising and placing a great sack of sand [on] his own shoulders he was going thus through the desert [for] many days.",
    },
    {
      ref: "3",
      la: "Quem Theosebius inveniens dixit: \"Abba, cur tantum onus portas?\" Et ille: \"Vexo vexantem me.\"",
      en: "Theosebius, finding whom, said: \"Abba, why do you carry so great a burden?\" And he [said]: \"I vex the [one] vexing me.\"",
    },
    {
      ref: "4",
      la: "Abbas Macarius vidit Satanam transeuntem in habitu hominis et habentem vestimentum lineum laceratum,",
      en: "The abbot Macarius saw Satan passing by in the dress of a human and having a torn linen garment,",
    },
    {
      ref: "4",
      la: "et per omnia foramina dependebant ampullae et dixit ei: \"Quo vadis?\"",
      en: "and through all the holes flasks were hanging down and he said [to] him: \"Where are you going?\"",
    },
    {
      ref: "4",
      la: "Et ille: \"Vado potionare fratres.\" Cui Macarius: \"Quare tot ampullas portas?\"",
      en: "And he [said]: \"I go to give the brothers drink.\" [To] whom Macarius [said]: \"Why do you carry so many flasks?\"",
    },
    {
      ref: "4",
      la: "Respondit: \"Gustum fratribus porto, et si unum alicui non placebit, offeram aliud vel tertium,",
      en: "He answered: \"I carry a taste [for] the brothers, and if one will not please someone, I will offer another or a third,",
    },
    {
      ref: "4",
      la: "et sic per ordinem, ut aliquid placeat.\"",
      en: "and thus in order, so that something may please.\"",
    },
    {
      ref: "4",
      la: "Et cum rediret, dixit ei Macarius: \"Quid fecisti?\"",
      en: "And when he was returning, Macarius said [to] him: \"What have you done?\"",
    },
    {
      ref: "4",
      la: "Respondit: \"Omnes sanctificati sunt et nemo mihi acquievit, nisi unus, qui vocatur Theotistus.\"",
      en: "He answered: \"All have been sanctified and no one has yielded [to] me, except one, who is called Theotistus.\"",
    },
    {
      ref: "4",
      la: "Surgens autem Macarius illuc ivit et fratrem tentatum inveniens sua eum exhortatione convertit.",
      en: "But Macarius, rising, went there and, finding the tempted brother, converted him [by] his own exhortation.",
    },
    {
      ref: "4",
      la: "Post haec iterum eum Macarius inveniens dixit: \"Quo vadis?\" Cui ille: \"Ad fratres vado.\"",
      en: "After these [things] Macarius, finding him again, said: \"Where are you going?\" [To] whom he [said]: \"I am going to the brothers.\"",
    },
    {
      ref: "4",
      la: "Revertenti occurrit senex et dixit: \"Quid faciunt fratres illi?\" Cui diabolus: \"Male.\" Et dixit: \"quare?\"",
      en: "The old man met [him] returning and said: \"What are those brothers doing?\" [To] whom the devil [said]: \"Badly.\" And he said: \"why?\"",
    },
    {
      ref: "4",
      la: "\"Quia omnes sancti sunt et, quod est maius malum, unum, quem habebam, amisi",
      en: "\"Because all are holy and, what is a greater evil, the one whom I used to have, I have lost",
    },
    {
      ref: "4",
      la: "et omnibus sanctior factus est.\"",
      en: "and he has become holier [than] all.\"",
    },
    {
      ref: "4",
      la: "Audiens hoc senex gratias egit Deo.",
      en: "Hearing this, the old man gave thanks [to] God.",
    },
    {
      ref: "5",
      la: "Quodam die sanctus Macarius caput defuncti reperit et, dum orasset, interrogavit illud, cuius caput fuerit.",
      en: "[On] a certain day Saint Macarius discovered the head of a deceased [man] and, when he had prayed, asked it whose head it had been.",
    },
    {
      ref: "5",
      la: "Et respondit se fuisse paganum.",
      en: "And it answered [that] it had been a pagan.",
    },
    {
      ref: "5",
      la: "Et dixit ei Macarius: \"Ubi est anima tua?\" Respondit: \"In inferno.\"",
      en: "And Macarius said [to] it: \"Where is your soul?\" It answered: \"In hell.\"",
    },
    {
      ref: "5",
      la: "Cumque requireret, si multum in profundo esset,",
      en: "And when he was inquiring whether it was much in the deep,",
    },
    {
      ref: "5",
      la: "respondit, quod tantum in profundo esset, quantum distaret terra a coelo.",
      en: "it answered that it was as much in the deep as the earth was distant from heaven.",
    },
    {
      ref: "5",
      la: "Cui Macarius: \"Suntne aliqui te profundiores?\" Respondit: \"Etiam, Iudaei.\"",
      en: "[To] whom Macarius [said]: \"Are there any deeper [than] you?\" It answered: \"Yes, the Jews.\"",
    },
    {
      ref: "5",
      la: "Cui iterum ille: \"Et ultra Iudaeos suntne aliqui profundiores?\"",
      en: "[To] whom he again [said]: \"And beyond the Jews are there any deeper?\"",
    },
    {
      ref: "5",
      la: "Cui ille: \"Profundiores omnibus sunt falsi Christiani, qui Christi sanguine redempti tantum pretium parvi pendunt.\"",
      en: "[To] whom it [said]: \"Deeper [than] all are the false Christians, who, redeemed [by] the blood of Christ, value so great a price [at] little.\"",
    },
    {
      ref: "6",
      la: "Dum per quandam solitudinem profundissimam pergeret, ad milliare harundinem figebat, ut postmodum redire sciret.",
      en: "While he was proceeding through a certain very deep wilderness, he was fixing a reed at [each] mile, so that afterwards he might know [how] to return.",
    },
    {
      ref: "6",
      la: "Sed dum iam novem diaetas fecisset et in quodam loco quiesceret,",
      en: "But when he had already made nine days' journeys and was resting in a certain place,",
    },
    {
      ref: "6",
      la: "diabolus omnes harundines collegit et ad caput eius posuit, unde ad redeundum plurimum laborabat.",
      en: "the devil collected all the reeds and placed [them] at his head, whence he was laboring very much at returning.",
    },
    {
      ref: "7",
      la: "Frater quidam plurimum cogitationibus suis molestabatur, quod scilicet in cella sua inutiliter esset,",
      en: "A certain brother was being troubled very much [by] his own thoughts, namely that he was uselessly in his own cell,",
    },
    {
      ref: "7",
      la: "sed si inter homines habitaret, multis prodesse posset.",
      en: "but if he were living among humans, he could benefit many.",
    },
    {
      ref: "7",
      la: "Qui cum cogitationes suas Macario retulisset,",
      en: "Who, when he had reported his own thoughts [to] Macarius,",
    },
    {
      ref: "7",
      la: "ille ait: \"Fili, sic illis responde:",
      en: "that [man] said: \"Son, answer those [thoughts] thus:",
    },
    {
      ref: "7",
      la: "Hoc saltem facio, quia propter Christum parietes istius cellae custodio.\"",
      en: "This at least I do, because on account of Christ I guard the walls of this cell.\"",
    },
    {
      ref: "8",
      la: "Dum quendam pulicem se pungentem manu occidisset et multum de illo sanguinis emanasset,",
      en: "When he had killed [with his] hand a certain flea stinging him and much of blood had flowed out from that [one],",
    },
    {
      ref: "8",
      la: "reprehendens se, quod propriam vindicasset iniuriam,",
      en: "blaming himself, because he had avenged a personal injury,",
    },
    {
      ref: "8",
      la: "nudus sex mensibus in deserto mansit et inde a scabronibus totus laceratus exivit.",
      en: "he remained naked [for] six months in the desert and went out from there wholly torn by hornets.",
    },
    {
      ref: "8",
      la: "Post hoc multis clarus virtutibus in pace quievit.",
      en: "After this, famous [for] many virtues, he rested in peace.",
    },
  ],
});
