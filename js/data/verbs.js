// Verb database with present and perfect indicative active forms
// Structure: verb -> language -> tense -> person -> number

// Verb classification by conjugation
const verbsByConjugation = {
  conj1: ["give", "praise", "call", "forbid"],
  conj2: ["warn", "move", "obey", "see", "have"],
  conj3: ["lead", "tell", "show", "do"],
  conj3io: ["make", "flee", "take"],
  conj4: ["hear", "serve", "come", "know"],
  irregular: ["want", "be", "be_able", "carry", "go"],
};

const verbDatabase = {
  // 1st Conjugation: dō, dare (give)
  give: {
    en: {
      infinitive: "to give",
      present: {
        1: { sg: "give", pl: "give" },
        2: { sg: "give", pl: "give" },
        3: { sg: "gives", pl: "give" },
      },
      perfect: {
        1: { sg: "gave", pl: "gave" },
        2: { sg: "gave", pl: "gave" },
        3: { sg: "gave", pl: "gave" },
      },
    },
    la: {
      infinitive: "dare",
      present: {
        1: { sg: "dō", pl: "damus" },
        2: { sg: "dās", pl: "datis" },
        3: { sg: "dat", pl: "dant" },
      },
      perfect: {
        1: { sg: "dedī", pl: "dedimus" },
        2: { sg: "dedistī", pl: "dedistis" },
        3: { sg: "dedit", pl: "dedērunt" },
      },
    },
  },

  // 1st Conjugation: laudō, laudāre (praise)
  praise: {
    en: {
      infinitive: "to praise",
      present: {
        1: { sg: "praise", pl: "praise" },
        2: { sg: "praise", pl: "praise" },
        3: { sg: "praises", pl: "praise" },
      },
      perfect: {
        1: { sg: "praised", pl: "praised" },
        2: { sg: "praised", pl: "praised" },
        3: { sg: "praised", pl: "praised" },
      },
    },
    la: {
      infinitive: "laudāre",
      present: {
        1: { sg: "laudō", pl: "laudāmus" },
        2: { sg: "laudās", pl: "laudātis" },
        3: { sg: "laudat", pl: "laudant" },
      },
      perfect: {
        1: { sg: "laudāvī", pl: "laudāvimus" },
        2: { sg: "laudāvistī", pl: "laudāvistis" },
        3: { sg: "laudāvit", pl: "laudāvērunt" },
      },
    },
  },

  // 1st Conjugation: vocō, vocāre (call)
  call: {
    en: {
      infinitive: "to call",
      present: {
        1: { sg: "call", pl: "call" },
        2: { sg: "call", pl: "call" },
        3: { sg: "calls", pl: "call" },
      },
      perfect: {
        1: { sg: "called", pl: "called" },
        2: { sg: "called", pl: "called" },
        3: { sg: "called", pl: "called" },
      },
    },
    la: {
      infinitive: "vocāre",
      present: {
        1: { sg: "vocō", pl: "vocāmus" },
        2: { sg: "vocās", pl: "vocātis" },
        3: { sg: "vocat", pl: "vocant" },
      },
      perfect: {
        1: { sg: "vocāvī", pl: "vocāvimus" },
        2: { sg: "vocāvistī", pl: "vocāvistis" },
        3: { sg: "vocāvit", pl: "vocāvērunt" },
      },
    },
  },

  // 2nd Conjugation: moneō, monēre (warn)
  warn: {
    en: {
      infinitive: "to warn",
      present: {
        1: { sg: "warn", pl: "warn" },
        2: { sg: "warn", pl: "warn" },
        3: { sg: "warns", pl: "warn" },
      },
      perfect: {
        1: { sg: "warned", pl: "warned" },
        2: { sg: "warned", pl: "warned" },
        3: { sg: "warned", pl: "warned" },
      },
    },
    la: {
      infinitive: "monēre",
      present: {
        1: { sg: "moneō", pl: "monēmus" },
        2: { sg: "monēs", pl: "monētis" },
        3: { sg: "monet", pl: "monent" },
      },
      perfect: {
        1: { sg: "monuī", pl: "monuimus" },
        2: { sg: "monuistī", pl: "monuistis" },
        3: { sg: "monuit", pl: "monuērunt" },
      },
    },
  },

  // 2nd Conjugation: moveō, movēre (move)
  move: {
    en: {
      infinitive: "to move",
      present: {
        1: { sg: "move", pl: "move" },
        2: { sg: "move", pl: "move" },
        3: { sg: "moves", pl: "move" },
      },
      perfect: {
        1: { sg: "moved", pl: "moved" },
        2: { sg: "moved", pl: "moved" },
        3: { sg: "moved", pl: "moved" },
      },
    },
    la: {
      infinitive: "movēre",
      present: {
        1: { sg: "moveō", pl: "movēmus" },
        2: { sg: "movēs", pl: "movētis" },
        3: { sg: "movet", pl: "movent" },
      },
      perfect: {
        1: { sg: "mōvī", pl: "mōvimus" },
        2: { sg: "mōvistī", pl: "mōvistis" },
        3: { sg: "mōvit", pl: "mōvērunt" },
      },
    },
  },

  // 2nd Conjugation: pāreō, pārēre (obey)
  obey: {
    construction: "dat",
    en: {
      infinitive: "to obey",
      present: {
        1: { sg: "obey", pl: "obey" },
        2: { sg: "obey", pl: "obey" },
        3: { sg: "obeys", pl: "obey" },
      },
      perfect: {
        1: { sg: "obeyed", pl: "obeyed" },
        2: { sg: "obeyed", pl: "obeyed" },
        3: { sg: "obeyed", pl: "obeyed" },
      },
    },
    la: {
      infinitive: "pārēre",
      present: {
        1: { sg: "pāreō", pl: "pārēmus" },
        2: { sg: "pārēs", pl: "pārētis" },
        3: { sg: "pāret", pl: "pārent" },
      },
      perfect: {
        1: { sg: "pāruī", pl: "pāruimus" },
        2: { sg: "pāruistī", pl: "pāruistis" },
        3: { sg: "pāruit", pl: "pāruērunt" },
      },
    },
  },

  // 3rd Conjugation: dūcō, dūcere (lead)
  lead: {
    en: {
      infinitive: "to lead",
      present: {
        1: { sg: "lead", pl: "lead" },
        2: { sg: "lead", pl: "lead" },
        3: { sg: "leads", pl: "lead" },
      },
      perfect: {
        1: { sg: "led", pl: "led" },
        2: { sg: "led", pl: "led" },
        3: { sg: "led", pl: "led" },
      },
    },
    la: {
      infinitive: "dūcere",
      present: {
        1: { sg: "dūcō", pl: "dūcimus" },
        2: { sg: "dūcis", pl: "dūcitis" },
        3: { sg: "dūcit", pl: "dūcunt" },
      },
      perfect: {
        1: { sg: "dūxī", pl: "dūximus" },
        2: { sg: "dūxistī", pl: "dūxistis" },
        3: { sg: "dūxit", pl: "dūxērunt" },
      },
    },
  },

  // 3rd Conjugation: dīcō, dīcere (tell)
  tell: {
    en: {
      infinitive: "to tell",
      present: {
        1: { sg: "tell", pl: "tell" },
        2: { sg: "tell", pl: "tell" },
        3: { sg: "tells", pl: "tell" },
      },
      perfect: {
        1: { sg: "told", pl: "told" },
        2: { sg: "told", pl: "told" },
        3: { sg: "told", pl: "told" },
      },
    },
    la: {
      infinitive: "dīcere",
      present: {
        1: { sg: "dīcō", pl: "dīcimus" },
        2: { sg: "dīcis", pl: "dīcitis" },
        3: { sg: "dīcit", pl: "dīcunt" },
      },
      perfect: {
        1: { sg: "dīxī", pl: "dīximus" },
        2: { sg: "dīxistī", pl: "dīxistis" },
        3: { sg: "dīxit", pl: "dīxērunt" },
      },
    },
  },

  // 3rd Conjugation: ostendō, ostendere (show)
  show: {
    en: {
      infinitive: "to show",
      present: {
        1: { sg: "show", pl: "show" },
        2: { sg: "show", pl: "show" },
        3: { sg: "shows", pl: "show" },
      },
      perfect: {
        1: { sg: "showed", pl: "showed" },
        2: { sg: "showed", pl: "showed" },
        3: { sg: "showed", pl: "showed" },
      },
    },
    la: {
      infinitive: "ostendere",
      present: {
        1: { sg: "ostendō", pl: "ostendimus" },
        2: { sg: "ostendis", pl: "ostenditis" },
        3: { sg: "ostendit", pl: "ostendunt" },
      },
      perfect: {
        1: { sg: "ostendī", pl: "ostendimus" },
        2: { sg: "ostendistī", pl: "ostendistis" },
        3: { sg: "ostendit", pl: "ostendērunt" },
      },
    },
  },

  // 3rd -io Conjugation: faciō, facere (make)
  make: {
    en: {
      infinitive: "to make",
      present: {
        1: { sg: "make", pl: "make" },
        2: { sg: "make", pl: "make" },
        3: { sg: "makes", pl: "make" },
      },
      perfect: {
        1: { sg: "made", pl: "made" },
        2: { sg: "made", pl: "made" },
        3: { sg: "made", pl: "made" },
      },
    },
    la: {
      infinitive: "facere",
      present: {
        1: { sg: "faciō", pl: "facimus" },
        2: { sg: "facis", pl: "facitis" },
        3: { sg: "facit", pl: "faciunt" },
      },
      perfect: {
        1: { sg: "fēcī", pl: "fēcimus" },
        2: { sg: "fēcistī", pl: "fēcistis" },
        3: { sg: "fēcit", pl: "fēcērunt" },
      },
    },
  },

  // 3rd -io Conjugation: fugiō, fugere (flee)
  flee: {
    en: {
      infinitive: "to flee",
      present: {
        1: { sg: "flee", pl: "flee" },
        2: { sg: "flee", pl: "flee" },
        3: { sg: "flees", pl: "flee" },
      },
      perfect: {
        1: { sg: "fled", pl: "fled" },
        2: { sg: "fled", pl: "fled" },
        3: { sg: "fled", pl: "fled" },
      },
    },
    la: {
      infinitive: "fugere",
      present: {
        1: { sg: "fugiō", pl: "fugimus" },
        2: { sg: "fugis", pl: "fugitis" },
        3: { sg: "fugit", pl: "fugiunt" },
      },
      perfect: {
        1: { sg: "fūgī", pl: "fūgimus" },
        2: { sg: "fūgistī", pl: "fūgistis" },
        3: { sg: "fūgit", pl: "fūgērunt" },
      },
    },
  },

  // 3rd -io Conjugation: capiō, capere (take)
  take: {
    en: {
      infinitive: "to take",
      present: {
        1: { sg: "take", pl: "take" },
        2: { sg: "take", pl: "take" },
        3: { sg: "takes", pl: "take" },
      },
      perfect: {
        1: { sg: "took", pl: "took" },
        2: { sg: "took", pl: "took" },
        3: { sg: "took", pl: "took" },
      },
    },
    la: {
      infinitive: "capere",
      present: {
        1: { sg: "capiō", pl: "capimus" },
        2: { sg: "capis", pl: "capitis" },
        3: { sg: "capit", pl: "capiunt" },
      },
      perfect: {
        1: { sg: "cēpī", pl: "cēpimus" },
        2: { sg: "cēpistī", pl: "cēpistis" },
        3: { sg: "cēpit", pl: "cēpērunt" },
      },
    },
  },

  // 4th Conjugation: audiō, audīre (hear)
  hear: {
    en: {
      infinitive: "to hear",
      present: {
        1: { sg: "hear", pl: "hear" },
        2: { sg: "hear", pl: "hear" },
        3: { sg: "hears", pl: "hear" },
      },
      perfect: {
        1: { sg: "heard", pl: "heard" },
        2: { sg: "heard", pl: "heard" },
        3: { sg: "heard", pl: "heard" },
      },
    },
    la: {
      infinitive: "audīre",
      present: {
        1: { sg: "audiō", pl: "audīmus" },
        2: { sg: "audīs", pl: "audītis" },
        3: { sg: "audit", pl: "audiunt" },
      },
      perfect: {
        1: { sg: "audīvī", pl: "audīvimus" },
        2: { sg: "audīvistī", pl: "audīvistis" },
        3: { sg: "audīvit", pl: "audīvērunt" },
      },
    },
  },

  // 4th Conjugation: serviō, servīre (serve)
  serve: {
    construction: "dat",
    en: {
      infinitive: "to serve",
      present: {
        1: { sg: "serve", pl: "serve" },
        2: { sg: "serve", pl: "serve" },
        3: { sg: "serves", pl: "serve" },
      },
      perfect: {
        1: { sg: "served", pl: "served" },
        2: { sg: "served", pl: "served" },
        3: { sg: "served", pl: "served" },
      },
    },
    la: {
      infinitive: "servīre",
      present: {
        1: { sg: "serviō", pl: "servīmus" },
        2: { sg: "servīs", pl: "servītis" },
        3: { sg: "servit", pl: "serviunt" },
      },
      perfect: {
        1: { sg: "servīvī", pl: "servīvimus" },
        2: { sg: "servīvistī", pl: "servīvistis" },
        3: { sg: "servīvit", pl: "servīvērunt" },
      },
    },
  },

  // 4th Conjugation: veniō, venīre (come)
  come: {
    en: {
      infinitive: "to come",
      present: {
        1: { sg: "come", pl: "come" },
        2: { sg: "come", pl: "come" },
        3: { sg: "comes", pl: "come" },
      },
      perfect: {
        1: { sg: "came", pl: "came" },
        2: { sg: "came", pl: "came" },
        3: { sg: "came", pl: "came" },
      },
    },
    la: {
      infinitive: "venīre",
      present: {
        1: { sg: "veniō", pl: "venīmus" },
        2: { sg: "venīs", pl: "venītis" },
        3: { sg: "venit", pl: "veniunt" },
      },
      perfect: {
        1: { sg: "vēnī", pl: "vēnimus" },
        2: { sg: "vēnistī", pl: "vēnistis" },
        3: { sg: "vēnit", pl: "vēnērunt" },
      },
    },
  },

  // Irregular: volō, velle (want)
  want: {
    en: {
      infinitive: "to want",
      present: {
        1: { sg: "want", pl: "want" },
        2: { sg: "want", pl: "want" },
        3: { sg: "wants", pl: "want" },
      },
      perfect: {
        1: { sg: "wanted", pl: "wanted" },
        2: { sg: "wanted", pl: "wanted" },
        3: { sg: "wanted", pl: "wanted" },
      },
    },
    la: {
      infinitive: "velle",
      present: {
        1: { sg: "volō", pl: "volumus" },
        2: { sg: "vīs", pl: "vultis" },
        3: { sg: "vult", pl: "volunt" },
      },
      perfect: {
        1: { sg: "voluī", pl: "voluimus" },
        2: { sg: "voluistī", pl: "voluistis" },
        3: { sg: "voluit", pl: "voluērunt" },
      },
    },
  },

  // Irregular: sum, esse (be)
  be: {
    en: {
      infinitive: "to be",
      present: {
        1: { sg: "am", pl: "are" },
        2: { sg: "are", pl: "are" },
        3: { sg: "is", pl: "are" },
      },
      perfect: {
        1: { sg: "was", pl: "were" },
        2: { sg: "were", pl: "were" },
        3: { sg: "was", pl: "were" },
      },
    },
    la: {
      infinitive: "esse",
      present: {
        1: { sg: "sum", pl: "sumus" },
        2: { sg: "es", pl: "estis" },
        3: { sg: "est", pl: "sunt" },
      },
      perfect: {
        1: { sg: "fuī", pl: "fuimus" },
        2: { sg: "fuistī", pl: "fuistis" },
        3: { sg: "fuit", pl: "fuērunt" },
      },
    },
  },

  // Irregular: possum, posse (be able)
  be_able: {
    en: {
      infinitive: "to be able",
      present: {
        1: { sg: "can", pl: "can" },
        2: { sg: "can", pl: "can" },
        3: { sg: "can", pl: "can" },
      },
      perfect: {
        1: { sg: "could", pl: "could" },
        2: { sg: "could", pl: "could" },
        3: { sg: "could", pl: "could" },
      },
    },
    la: {
      infinitive: "posse",
      present: {
        1: { sg: "possum", pl: "possumus" },
        2: { sg: "potes", pl: "potestis" },
        3: { sg: "potest", pl: "possunt" },
      },
      perfect: {
        1: { sg: "potuī", pl: "potuimus" },
        2: { sg: "potuistī", pl: "potuistis" },
        3: { sg: "potuit", pl: "potuērunt" },
      },
    },
  },

  // Irregular: ferō, ferre (carry)
  carry: {
    en: {
      infinitive: "to carry",
      present: {
        1: { sg: "carry", pl: "carry" },
        2: { sg: "carry", pl: "carry" },
        3: { sg: "carries", pl: "carry" },
      },
      perfect: {
        1: { sg: "carried", pl: "carried" },
        2: { sg: "carried", pl: "carried" },
        3: { sg: "carried", pl: "carried" },
      },
    },
    la: {
      infinitive: "ferre",
      present: {
        1: { sg: "ferō", pl: "ferimus" },
        2: { sg: "fers", pl: "fertis" },
        3: { sg: "fert", pl: "ferunt" },
      },
      perfect: {
        1: { sg: "tulī", pl: "tulimus" },
        2: { sg: "tulistī", pl: "tulistis" },
        3: { sg: "tulit", pl: "tulērunt" },
      },
    },
  },

  // Irregular: eō, īre (go)
  go: {
    en: {
      infinitive: "to go",
      present: {
        1: { sg: "go", pl: "go" },
        2: { sg: "go", pl: "go" },
        3: { sg: "goes", pl: "go" },
      },
      perfect: {
        1: { sg: "went", pl: "went" },
        2: { sg: "went", pl: "went" },
        3: { sg: "went", pl: "went" },
      },
    },
    la: {
      infinitive: "īre",
      present: {
        1: { sg: "eō", pl: "īmus" },
        2: { sg: "īs", pl: "ītis" },
        3: { sg: "it", pl: "eunt" },
      },
      perfect: {
        1: { sg: "iī", pl: "iimus" },
        2: { sg: "iistī", pl: "iistis" },
        3: { sg: "iit", pl: "iērunt" },
      },
    },
  },

  // 1st Conjugation: vetō, vetāre (forbid)
  forbid: {
    en: {
      infinitive: "to forbid",
      present: {
        1: { sg: "forbid", pl: "forbid" },
        2: { sg: "forbid", pl: "forbid" },
        3: { sg: "forbids", pl: "forbid" },
      },
      perfect: {
        1: { sg: "forbade", pl: "forbade" },
        2: { sg: "forbade", pl: "forbade" },
        3: { sg: "forbade", pl: "forbade" },
      },
    },
    la: {
      infinitive: "vetāre",
      present: {
        1: { sg: "vetō", pl: "vetāmus" },
        2: { sg: "vetās", pl: "vetātis" },
        3: { sg: "vetat", pl: "vetant" },
      },
      perfect: {
        1: { sg: "vetuī", pl: "vetuimus" },
        2: { sg: "vetuistī", pl: "vetuistis" },
        3: { sg: "vetuit", pl: "vetuērunt" },
      },
    },
  },

  // 2nd Conjugation: videō, vidēre (see)
  see: {
    en: {
      infinitive: "to see",
      present: {
        1: { sg: "see", pl: "see" },
        2: { sg: "see", pl: "see" },
        3: { sg: "sees", pl: "see" },
      },
      perfect: {
        1: { sg: "saw", pl: "saw" },
        2: { sg: "saw", pl: "saw" },
        3: { sg: "saw", pl: "saw" },
      },
    },
    la: {
      infinitive: "vidēre",
      present: {
        1: { sg: "videō", pl: "vidēmus" },
        2: { sg: "vidēs", pl: "vidētis" },
        3: { sg: "videt", pl: "vident" },
      },
      perfect: {
        1: { sg: "vīdī", pl: "vīdimus" },
        2: { sg: "vīdistī", pl: "vīdistis" },
        3: { sg: "vīdit", pl: "vīdērunt" },
      },
    },
  },

  // 2nd Conjugation: habeō, habēre (have)
  have: {
    en: {
      infinitive: "to have",
      present: {
        1: { sg: "have", pl: "have" },
        2: { sg: "have", pl: "have" },
        3: { sg: "has", pl: "have" },
      },
      perfect: {
        1: { sg: "had", pl: "had" },
        2: { sg: "had", pl: "had" },
        3: { sg: "had", pl: "had" },
      },
    },
    la: {
      infinitive: "habēre",
      present: {
        1: { sg: "habeō", pl: "habēmus" },
        2: { sg: "habēs", pl: "habētis" },
        3: { sg: "habet", pl: "habent" },
      },
      perfect: {
        1: { sg: "habuī", pl: "habuimus" },
        2: { sg: "habuistī", pl: "habuistis" },
        3: { sg: "habuit", pl: "habuērunt" },
      },
    },
  },

  // 3rd Conjugation: agō, agere (do, act)
  do: {
    en: {
      infinitive: "to do",
      present: {
        1: { sg: "do", pl: "do" },
        2: { sg: "do", pl: "do" },
        3: { sg: "does", pl: "do" },
      },
      perfect: {
        1: { sg: "did", pl: "did" },
        2: { sg: "did", pl: "did" },
        3: { sg: "did", pl: "did" },
      },
    },
    la: {
      infinitive: "agere",
      present: {
        1: { sg: "agō", pl: "agimus" },
        2: { sg: "agis", pl: "agitis" },
        3: { sg: "agit", pl: "agunt" },
      },
      perfect: {
        1: { sg: "ēgī", pl: "ēgimus" },
        2: { sg: "ēgistī", pl: "ēgistis" },
        3: { sg: "ēgit", pl: "ēgērunt" },
      },
    },
  },

  // 4th Conjugation: sciō, scīre (know)
  know: {
    en: {
      infinitive: "to know",
      present: {
        1: { sg: "know", pl: "know" },
        2: { sg: "know", pl: "know" },
        3: { sg: "knows", pl: "know" },
      },
      perfect: {
        1: { sg: "knew", pl: "knew" },
        2: { sg: "knew", pl: "knew" },
        3: { sg: "knew", pl: "knew" },
      },
    },
    la: {
      infinitive: "scīre",
      present: {
        1: { sg: "sciō", pl: "scīmus" },
        2: { sg: "scīs", pl: "scītis" },
        3: { sg: "scit", pl: "sciunt" },
      },
      perfect: {
        1: { sg: "scīvī", pl: "scīvimus" },
        2: { sg: "scīvistī", pl: "scīvistis" },
        3: { sg: "scīvit", pl: "scīvērunt" },
      },
    },
  },
};
