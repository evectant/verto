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
    en: "{noun.animate.en.nom.both} {verb.give.en} {noun.thing.en.nom.both} to {noun.animate.en.dat.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.dat.both} {verb.give.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.praise.en} {noun.animate.en.gen.both} {noun.thing.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.gen.both} {verb.praise.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.call.en} {noun.animate.en.acc.both} {from.en} {noun.location.en.nom.both} to {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.acc.both} {from.la} {noun.location.la.abl.both} ad {noun.location.la.acc.both} {verb.call.la}",
  },

  // 2nd conjugation.
  //
  // moneo, monere, monui, monitus (II) - warn
  // moveo, movere, movi, motus (II) - move
  // pareo, parere, parui, n/a (II) - obey (intr., takes dative)
  {
    en: "{noun.animate.en.nom.both} {verb.warn.en} {noun.animate.en.acc.both} about {noun.animate.en.acc.both}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.acc.both} de {noun.animate.la.abl.both} {verb.warn.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.move.en} {noun.thing.en.acc.both} into {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} in {noun.location.la.acc.both} {verb.move.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.obey.en} {noun.animate.en.dat.both} with {noun.emotion.en.nom.sg}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.dat.both} {verb.obey.la} cum {noun.emotion.la.abl.sg}",
  },

  // 3rd conjugation.
  //
  // dīcō, dīcere, dīxī, dictus (III) - tell
  // dūcō, dūcere, dūxī, ductus (III) - lead
  // ostendō, ostendere, ostendī, ostensus (III) - show
  {
    en: "{noun.animate.en.nom.both} {verb.lead.en} {noun.animate.en.acc.both} without {noun.emotion.en.nom.sg}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.acc.both} sine {noun.emotion.la.abl.sg} {verb.lead.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.tell.en} {noun.animate.en.acc.both} about {noun.thing.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.dat.both} de {noun.thing.la.abl.both} {verb.tell.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.show.en} {noun.thing.en.nom.both} to {noun.animate.en.acc.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.dat.both} {verb.show.la}",
  },

  // 3rd-io conjugation.
  //
  // capiō, capere, cēpī, captus (III-io) - take
  // faciō, facere, fēcī, factus (III-io) - make
  // fugiō, fugere, fūgī, fugitus (III-io) - flee
  {
    en: "{noun.animate.en.nom.both} {verb.make.en} {noun.thing.en.nom.both} for {noun.animate.en.acc.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.dat.both} {verb.make.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.flee.en} into {noun.animate.en.gen.both} {noun.location.en.acc.both}",
    la: "{noun.animate.la.nom.both} in {noun.location.la.acc.both} {noun.animate.la.gen.both} {verb.flee.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.flee.en} with {noun.animate.en.acc.both} {from.en} {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} cum {noun.animate.la.abl.both} {from.la} {noun.location.la.abl.both} {verb.flee.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.take.en} {noun.thing.en.nom.both} from {noun.animate.en.acc.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {a.la} {noun.animate.la.abl.both} {verb.take.la}",
  },

  // 4th conjugation.
  //
  // audiō, audīre, audīvī, audītus (IV) - hear
  // serviō, servīre, servīvī, n/a (IV) - serve (intr., takes dative)
  // veniō, venīre, vēnī, n/a (IV) - come (intr.)
  {
    en: "{noun.animate.en.nom.both} {verb.hear.en} about {noun.thing.en.nom.both} in {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} de {noun.thing.la.abl.both} in {noun.location.la.abl.both} {verb.hear.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.serve.en} {noun.animate.en.acc.both} out of {noun.emotion.en.nom.sg}",
    la: "{noun.animate.la.nom.both} {noun.animate.la.dat.both} {noun.emotion.la.abl.sg} {verb.serve.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.come.en} {from.en} {noun.animate.en.gen.both} {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} {from.la} {noun.location.la.abl.both} {noun.animate.la.gen.both} {verb.come.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.come.en} with {noun.animate.en.acc.both} to {noun.location.en.nom.both}",
    la: "{noun.animate.la.nom.both} cum {noun.animate.la.abl.both} ad {noun.location.la.acc.both} {verb.come.la}",
  },

  // Irregular.
  //
  // sum, esse, fuī, futūrus (irr.) - be
  // volō, velle, voluī, n/a (irr.) - want
  {
    en: "{noun.animate.en.nom.sg} {verb.be.en} also {noun.animate.en.nom.sg}",
    la: "{noun.animate.la.nom.sg} {noun.animate.la.nom.sg} quoque {verb.be.la}",
  },
  {
    en: "{noun.animate.en.nom.pl} {verb.be.en} also {noun.animate.en.nom.pl}",
    la: "{noun.animate.la.nom.pl} {noun.animate.la.nom.pl} quoque {verb.be.la}",
  },
  {
    en: "{noun.thing.en.nom.both} {verb.be.en} {noun.animate.en.gen.both}",
    la: "{noun.thing.la.nom.both} {verb.be.la} {noun.animate.la.gen.both}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.want.en} {verb.inf.en} and {verb.inf.en}",
    la: "{noun.animate.la.nom.both} {verb.want.la} {verb.inf.la} et {verb.inf.la}",
  },
  {
    en: "{noun.animate.en.nom.both} {verb.want.en} {noun.animate.en.gen.both} {noun.thing.en.nom.both}",
    la: "{noun.animate.la.nom.both} {noun.thing.la.acc.both} {noun.animate.la.gen.both} {verb.want.la}",
  }
);
