// ============================================
// PHRASE TEMPLATES
// Using specific verb names in templates (e.g., {verb.take.en}, {verb.hear.la})
// ============================================

phrases.push(
  // 1st conjugation.
  //
  // do, dare, dedi, datus (I) - give
  // laudo, laudare, laudavi, laudatus (I) - praise
  // voco, vocare, vocavi, vocatus (I) - call

  // Ex: farmer gives gift to soldier / agricola donum militi dat
  {
    en: "{noun.animate.en.nom.both} {verb.give.en} {noun.thing.en.acc.both} to {noun.animate.en.dat.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.dat.both} {verb.give.la}",
  },

  // Ex: I give your book to him in the city / librum tuum ei in urbe do
  {
    en: "{noun.animate.en.nom.both} {verb.give.en} {noun.animate.en.gen.both} {noun.thing.en.acc.both} to {noun.animate.en.dat.both} in {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.gen.both} {noun.animate.la.dat.both} in {noun.location.la.abl.both} {verb.give.la}",
  },

  // Ex: poet praises queen's wisdom / poeta sapientiam reginae laudat
  {
    en: "{noun.animate.en.nom.both} {verb.praise.en} {noun.animate.en.gen.both} {noun.thing.en.acc.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.gen.both} {verb.praise.la}",
  },

  // Ex: general calls soldiers from camp to forum / imperator milites e castris ad forum vocat
  {
    en: "{noun.animate.en.nom.both} {verb.call.en} {noun.animate.en.acc.both} {from.en} {noun.location.en.nom.both} to {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.acc.both} {from.la} {noun.location.la.abl.both} ad {noun.location.la.acc.both} {verb.call.la}",
  },

  // 2nd conjugation.
  //
  // moneo, monere, monui, monitus (II) - warn
  // moveo, movere, movi, motus (II) - move
  // pareo, parere, parui, n/a (II) - obey (intr., takes dative)

  // Ex: teacher warns student about enemy / magister discipulum de hoste monet
  {
    en: "{noun.animate.en.nom.both} {verb.warn.en} {noun.animate.en.acc.both} about {noun.animate.en.acc.both}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.acc.both} de {noun.animate.la.abl.both} {verb.warn.la}",
  },

  // Ex: farmer moves table into house / agricola mensam in villam movet
  {
    en: "{noun.animate.en.nom.both} {verb.move.en} {noun.thing.en.acc.both} into {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} in {noun.location.la.acc.both} {verb.move.la}",
  },

  // Ex: child obeys father with joy / puer patri paret cum gaudio
  {
    en: "{noun.animate.en.nom.both} {verb.obey.en} {noun.animate.en.dat.both} with {noun.emotion.en.nom.sg}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.dat.both} {verb.obey.la} cum {noun.emotion.la.abl.sg}",
  },

  // 3rd conjugation.
  //
  // dīcō, dīcere, dīxī, dictus (III) - tell
  // dūcō, dūcere, dūxī, ductus (III) - lead
  // ostendō, ostendere, ostendī, ostensus (III) - show

  // Ex: captain leads sailors without fear / navarchus nautas sine timore ducit
  {
    en: "{noun.animate.en.nom.both} {verb.lead.en} {noun.animate.en.acc.both} without {noun.emotion.en.nom.sg}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.acc.both} sine {noun.emotion.la.abl.sg} {verb.lead.la}",
  },

  // Ex: messenger tells king about our victory / nuntius regi de victoria nostra dicit
  {
    en: "{noun.animate.en.nom.both} {verb.tell.en} {noun.animate.en.dat.both} about {noun.pronoun.en.gen.both} {noun.thing.en.acc.both}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.dat.both} de {noun.thing.la.abl.both} {noun.pronoun.la.gen.both} {verb.tell.la}",
  },

  // Ex: guide shows temple to our travelers / ...
  {
    en: "{noun.animate.en.nom.both} {verb.show.en} {noun.location.en.acc.both} to {noun.pronoun.en.gen.both} {noun.person.en.dat.both}",
    la: "{noun.animate.la.nom.both} {noun.location.la.acc.both} {noun.person.la.dat.both} {noun.pronoun.la.gen.both} {verb.show.la}",
  },

  // 3rd-io conjugation.
  //
  // capiō, capere, cēpī, captus (III-io) - take
  // faciō, facere, fēcī, factus (III-io) - make
  // fugiō, fugere, fūgī, fugitus (III-io) - flee

  // Ex: craftsman makes sword for warrior / faber gladium militi facit
  {
    en: "{noun.animate.en.nom.both} {verb.make.en} {noun.thing.en.acc.both} for {noun.animate.en.dat.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.dat.both} {verb.make.la}",
  },

  // Ex: thief flees into merchant's shop / fur in tabernam mercatoris fugit
  {
    en: "{noun.animate.en.nom.both} {verb.flee.en} into {noun.animate.en.gen.both} {noun.location.en.acc.both}",
    la: "{noun.animate.la.nom.both} in {noun.location.la.acc.both} {noun.animate.la.gen.both} {verb.flee.la}",
  },

  // Ex: shepherd flees with goat from field / pastor cum capra e agro fugit
  {
    en: "{noun.animate.en.nom.both} {verb.flee.en} with {noun.animate.en.acc.both} {from.en} {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} cum {noun.animate.la.abl.both} {from.la} {noun.location.la.abl.both} {verb.flee.la}",
  },

  // Ex: pirate takes treasure from sailor / pirata thesaurum a nauta capit
  {
    en: "{noun.animate.en.nom.both} {verb.take.en} {noun.thing.en.acc.both} from {noun.animate.en.abl.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {a.la} {noun.animate.la.abl.both} {verb.take.la}",
  },

  // 4th conjugation.
  //
  // audiō, audīre, audīvī, audītus (IV) - hear
  // serviō, servīre, servīvī, n/a (IV) - serve (intr., takes dative)
  // veniō, venīre, vēnī, n/a (IV) - come (intr.)

  // Ex: senator hears about battle in forum / senator de proelio in foro audit
  {
    en: "{noun.animate.en.nom.both} {verb.hear.en} about {noun.thing.en.nom.both} in {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} de {noun.thing.la.abl.both} in {noun.location.la.abl.both} {verb.hear.la}",
  },

  // Ex: knight serves queen out of love / miles reginae amore servit
  {
    en: "{noun.animate.en.nom.both} {verb.serve.en} {noun.animate.en.dat.both} out of {noun.emotion.en.nom.sg}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.dat.both} {noun.emotion.la.abl.sg} {verb.serve.la}",
  },

  // Ex: priest comes from citizen's temple / sacerdos e templo civis venit
  {
    en: "{noun.animate.en.nom.both} {verb.come.en} {from.en} {noun.animate.en.gen.both} {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} {from.la} {noun.location.la.abl.both} {noun.animate.la.gen.both} {verb.come.la}",
  },

  // Ex: merchant comes with friend to market / mercator cum amico ad forum venit
  {
    en: "{noun.animate.en.nom.both} {verb.come.en} with {noun.animate.en.acc.both} to {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} cum {noun.animate.la.abl.both} ad {noun.location.la.acc.both} {verb.come.la}",
  },

  // Irregular.
  //
  // sum, esse, fuī, futūrus (irr.) - be
  // volō, velle, voluī, n/a (irr.) - want

  // Ex: his poet is also teacher / poeta eius magister quoque est
  {
    en: "{noun.pronoun.en.gen.both} {noun.person.en.nom.sg} {verb.be.en} also {noun.person.en.nom.sg}",
    la: "{noun.pronoun.la.gen.both} {noun.person.la.nom.sg} {noun.person.la.nom.sg} quoque {verb.be.la}",
  },

  // Ex: her soldiers are also sailors / milites eius nautae quoque sunt
  {
    en: "{noun.pronoun.en.gen.both} {noun.person.en.nom.pl} {verb.be.en} also {noun.person.en.nom.pl}",
    la: "{noun.pronoun.la.gen.both} {noun.person.la.nom.pl} {noun.person.la.nom.pl} quoque {verb.be.la}",
  },

  // Ex: she is also teacher / ea magistra quoque est
  {
    en: "{noun.pronoun.en.nom.sg} {verb.be.en} also {noun.person.en.nom.sg}",
    la: "{noun.pronoun.la.nom.sg} {noun.person.la.nom.sg} quoque {verb.be.la}",
  },

  // Ex: they are also teachers / eī magistrī quoque sunt
  {
    en: "{noun.pronoun.en.nom.pl} {verb.be.en} also {noun.person.en.nom.pl}",
    la: "{noun.pronoun.la.nom.pl} {noun.person.la.nom.pl} quoque {verb.be.la}",
  },

  // Ex: sword is not warrior's but farmer's / gladius non est militis sed agricolae
  {
    en: "{noun.thing.en.nom.both} {verb.be.en} not {noun.animate.en.gen.both} but {noun.animate.en.gen.both}",
    la: "{noun.thing.la.nom.both} non {verb.be.la} {noun.animate.la.gen.both} sed {noun.animate.la.gen.both}",
  },

  // Ex: our king wants to lead and to conquer / rex noster ducere et vincere vult
  {
    en: "{noun.pronoun.en.gen.both} {noun.person.en.nom.both} {verb.want.en} {verb.inf.en} and {verb.inf.en}",
    la: "{noun.pronoun.la.gen.both} {noun.person.la.nom.both} {verb.inf.la} et {verb.inf.la} {verb.want.la}",
  },

  // Ex: daughter wants mother's book / filia librum matris vult
  {
    en: "{noun.animate.en.nom.both} {verb.want.en} {noun.animate.en.gen.both} {noun.thing.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.gen.both} {verb.want.la}",
  },

  // Genitive possessive adjectives.
  // These templates generate Latin possessive adjectives in genitive case
  // by placing a genitive pronoun next to a genitive non-animate noun.

  // Ex: soldier wants wisdom of my teacher / miles sapientiam magistri mei vult
  {
    en: "{noun.animate.en.nom.both} {verb.want.en} {noun.thing.en.acc.both} of {noun.pronoun.en.gen.both} {noun.person.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.person.la.gen.both} {noun.pronoun.la.gen.both} {verb.want.la}",
  }
);
