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
  {
    en: "{noun.person.en} {verb.give.en} {noun.thing.en} to {noun.person.en.dat}",
    la: "{noun.person.la.nom} {noun.thing.la.acc} {noun.person.la.dat} {verb.give.la}",
  },
  {
    en: "{noun.person.en} {verb.praise.en} {noun.person.en.gen} {noun.thing.en}",
    la: "{noun.person.la.nom} {noun.thing.la.acc} {noun.person.la.gen} {verb.praise.la}",
  },
  {
    en: "{noun.person.en} {verb.call.en} {noun.person.en.acc} {from.en} {noun.location.en} to {noun.location.en}",
    la: "{noun.person.la.nom} {noun.person.la.acc} {from.la} {noun.location.la.abl} ad {noun.location.la.acc} {verb.call.la}",
  },

  // 2nd conjugation.
  //
  // moneo, monere, monui, monitus (II) - warn
  // moveo, movere, movi, motus (II) - move
  // pareo, parere, parui, n/a (II) - obey (intr., takes dative)
  {
    en: "{noun.person.en} {verb.warn.en} {noun.person.en.acc} about {noun.person.en.acc}",
    la: "{noun.person.la.nom} {noun.person.la.acc} de {noun.person.la.abl} {verb.warn.la}",
  },
  {
    en: "{noun.person.en} {verb.move.en} {noun.thing.en.acc} into {noun.location.en}",
    la: "{noun.person.la.nom} {noun.thing.la.acc} in {noun.location.la.acc} {verb.move.la}",
  },
  {
    en: "{noun.person.en} {verb.obey.en} {noun.person.en.dat} with {noun.emotion.en.sg}",
    la: "{noun.person.la.nom} {noun.person.la.dat} {verb.obey.la} cum {noun.emotion.la.abl.sg}",
  },

  // 3rd conjugation.
  //
  // dīcō, dīcere, dīxī, dictus (III) - tell
  // dūcō, dūcere, dūxī, ductus (III) - lead
  // ostendō, ostendere, ostendī, ostensus (III) - show
  {
    en: "{noun.person.en} {verb.lead.en} {noun.person.en.acc} without {noun.emotion.en.sg}",
    la: "{noun.person.la.nom} {noun.person.la.acc} sine {noun.emotion.la.abl.sg} {verb.lead.la}",
  },
  {
    en: "{noun.person.en} {verb.tell.en} {noun.person.en.acc} about {noun.thing.en}",
    la: "{noun.person.la.nom} {noun.person.la.dat} de {noun.thing.la.abl} {verb.tell.la}",
  },
  {
    en: "{noun.person.en} {verb.show.en} {noun.thing.en} to {noun.person.en.acc}",
    la: "{noun.person.la.nom} {noun.thing.la.acc} {noun.person.la.dat} {verb.show.la}",
  },

  // 3rd-io conjugation.
  //
  // capiō, capere, cēpī, captus (III-io) - take
  // faciō, facere, fēcī, factus (III-io) - make
  // fugiō, fugere, fūgī, fugitus (III-io) - flee
  {
    en: "{noun.person.en} {verb.make.en} {noun.thing.en} for {noun.person.en.acc}",
    la: "{noun.person.la.nom} {noun.thing.la.acc} {noun.person.la.dat} {verb.make.la}",
  },
  {
    en: "{noun.person.en} {verb.flee.en} into {noun.person.en.gen} {noun.location.en.acc}",
    la: "{noun.person.la.nom} in {noun.location.la.acc} {noun.person.la.gen} {verb.flee.la}",
  },
  {
    en: "{noun.person.en} {verb.flee.en} with {noun.person.en.acc} {from.en} {noun.location.en}",
    la: "{noun.person.la.nom} cum {noun.person.la.abl} {from.la} {noun.location.la.abl} {verb.flee.la}",
  },
  {
    en: "{noun.person.en} {verb.take.en} {noun.thing.en} from {noun.person.en.acc}",
    la: "{noun.person.la.nom} {noun.thing.la.acc} {a.la} {noun.person.la.abl} {verb.take.la}",
  },

  // 4th conjugation.
  //
  // audiō, audīre, audīvī, audītus (IV) - hear
  // serviō, servīre, servīvī, n/a (IV) - serve (intr., takes dative)
  // veniō, venīre, vēnī, n/a (IV) - come (intr.)
  {
    en: "{noun.person.en} {verb.hear.en} about {noun.thing.en} in {noun.location.en}",
    la: "{noun.person.la.nom} de {noun.thing.la.abl} in {noun.location.la.abl} {verb.hear.la}",
  },
  {
    en: "{noun.person.en} {verb.serve.en} {noun.person.en.acc} out of {noun.emotion.en.sg}",
    la: "{noun.person.la.nom} {noun.person.la.dat} {noun.emotion.la.abl.sg} {verb.serve.la}",
  },
  {
    en: "{noun.person.en} {verb.come.en} {from.en} {noun.person.en.gen} {noun.location.en}",
    la: "{noun.person.la.nom} {from.la} {noun.location.la.abl} {noun.person.la.gen} {verb.come.la}",
  },
  {
    en: "{noun.person.en} {verb.come.en} with {noun.person.en.acc} to {noun.location.en}",
    la: "{noun.person.la.nom} cum {noun.person.la.abl} ad {noun.location.la.acc} {verb.come.la}",
  },

  // Irregular.
  //
  // sum, esse, fuī, futūrus (irr.) - be
  // volō, velle, voluī, n/a (irr.) - want
  {
    en: "{noun.person.en.sg} {verb.be.en} also {noun.person.en.sg}",
    la: "{noun.person.la.nom.sg} {noun.person.la.nom.sg} quoque {verb.be.la}",
  },
  {
    en: "{noun.person.en.pl} {verb.be.en} also {noun.person.en.pl}",
    la: "{noun.person.la.nom.pl} {noun.person.la.nom.pl} quoque {verb.be.la}",
  },
  {
    en: "{noun.thing.en} {verb.be.en} {noun.person.en.gen}",
    la: "{noun.thing.la.nom} {verb.be.la} {noun.person.la.gen}",
  },
  {
    en: "{noun.person.en} {verb.want.en} {verb.inf.en} and {verb.inf.en}",
    la: "{noun.person.la.nom} {verb.want.la} {verb.inf.la} et {verb.inf.la}",
  },
  {
    en: "{noun.person.en} {verb.want.en} {noun.person.en.gen} {noun.thing.en}",
    la: "{noun.person.la.nom} {noun.thing.la.acc} {noun.person.la.gen} {verb.want.la}",
  }
);
