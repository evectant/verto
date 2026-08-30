// Near-synonym groups: words whose English renderings are easily confused,
// leaving the learner guessing which one the AI used (e.g. "seized" could be
// capere or rapere). Story and agreement sampling keeps at most one word from
// each group - a random member survives per generation, so all words still
// appear over time, just never together. Vocabulary mode ignores these groups
// (the exact gloss shown there identifies the word unambiguously).
// Entries must match the "la" spelling in the databases exactly, macrons included.
const SYNONYM_GROUPS = [
  // Verbs
  // NOTE: facere, habēre, dīcere (ALWAYS_AVAILABLE_VERBS) bypass sampling, so
  // grouping their near-synonyms (agere/creāre, tenēre) here would not help -
  // that collision can only be handled in the generation prompt.
  ["capere", "rapere"], // take / seize
  ["quaerere", "petere"], // ask / seek
  ["edere", "cōnsūmere"], // eat / consume
  ["convenīre", "congregāre"], // assemble / gather
  ["vidēre", "aspicere"], // see / look at
  ["regere", "imperāre"], // rule / command
  ["damnāre", "pūnīre"], // condemn / punish
  ["timēre", "terrēre"], // fear / terrify ("was frightened" fits both)
  ["putāre", "crēdere"], // think / believe
  ["iacēre", "latēre"], // lie / lie hidden

  // Nouns
  ["urbs", "oppidum"], // city / town
  ["vir", "homō"], // man / human
  ["dux", "prīnceps"], // commander / chief
  ["servus", "ancilla"], // servant / maid-slave
  ["glōria", "fāma"], // glory / fame
  ["casa", "domus", "domicilium"], // cottage / house / dwelling
  ["statua", "imāgō", "effigiēs"], // statue / image / effigy
  ["genus", "speciēs"], // kind / species
  ["īra", "rabiēs"], // anger / rage
  ["populus", "gēns", "plēbs"], // people / nation / plebeians
  ["animus", "mēns"], // spirit / mind
  ["puella", "virgō"], // girl / maiden
  ["poena", "supplicium"], // penalty / punishment
  ["iniūria", "damnum"], // injury / harm
  ["imperium", "potestās"], // command / power
  ["ignis", "flamma"], // fire / flame
  ["umbra", "tenebrae"], // shadow / darkness
  ["terra", "solum"], // land / ground
  ["rīpa", "lītus"], // bank / shore
  ["porta", "iānua"], // gate / door
  ["comes", "socius", "amīcus"], // companion / ally / friend
  ["lēx", "iūs"], // law / right
  ["dōnum", "praemium"], // gift / prize-reward
  ["pecūnia", "nummus"], // money / coin
  ["dīvitiae", "thēsaurus"], // wealth / treasure
  ["cēna", "convīvium"], // dinner / feast
  ["fātum", "fortūna"], // fate / fortune
  ["signum", "vexillum"], // sign-standard / banner
  ["locus", "regiō"], // place / region
  ["cor", "pectus"], // heart / breast ("in his heart" fits both)
  ["scientia", "studium"], // science / knowledge
  ["ars", "artificium"], // art / craft
  ["hasta", "pīlum"], // spear / javelin
  ["faciēs", "fōrma"], // face-appearance / form
  ["ōrdō", "seriēs"], // order-row / series-row

  // Adjectives
  ["māgnus", "grandis", "ingēns"], // great / large / huge
  ["vacuus", "inānis"], // empty-vacant / empty-vain
  ["laetus", "fēlīx"], // joyful / fortunate
  ["miser", "maestus", "tristis"], // wretched / gloomy / sad
  ["ferus", "ferōx", "atrōx", "crūdēlis"], // untamed / fierce / savage / cruel
  ["fortis", "audāx"], // brave / bold
  ["antīquus", "vetus"], // ancient / old
  ["aeternus", "immortālis"], // eternal / immortal
  ["mītis", "clēmēns"], // gentle / kind-merciful
  ["clārus", "nōbilis"], // famous / noble
  ["omnis", "tōtus"], // all-every / whole ("all the city" / "the whole city")
];
