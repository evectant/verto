// Pronoun database with 1st, 2nd, and 3rd person forms
// Structure: person -> number -> language -> form/case

const pronounDatabase = {
  1: {
    // 1st person
    sg: {
      en: "I", // Subject form
      en_obj: "me", // Object form
      en_poss: "my", // Possessive form (dependent: "my book")
      en_poss_indep: "mine", // Independent possessive ("the book is mine")
      la: {
        nom: "ego",
        gen: "meī",
        dat: "mihi",
        acc: "mē",
        abl: "mē",
      },
      la_cum: "mēcum", // Postpositive cum: "with me"
      la_poss: {
        // Possessive adjective: meus, mea, meum
        m: {
          nom: { sg: "meus", pl: "meī" },
          gen: { sg: "meī", pl: "meōrum" },
          dat: { sg: "meō", pl: "meīs" },
          acc: { sg: "meum", pl: "meōs" },
          abl: { sg: "meō", pl: "meīs" },
        },
        f: {
          nom: { sg: "mea", pl: "meae" },
          gen: { sg: "meae", pl: "meārum" },
          dat: { sg: "meae", pl: "meīs" },
          acc: { sg: "meam", pl: "meās" },
          abl: { sg: "meā", pl: "meīs" },
        },
        n: {
          nom: { sg: "meum", pl: "mea" },
          gen: { sg: "meī", pl: "meōrum" },
          dat: { sg: "meō", pl: "meīs" },
          acc: { sg: "meum", pl: "mea" },
          abl: { sg: "meō", pl: "meīs" },
        },
      },
    },
    pl: {
      en: "we",
      en_obj: "us",
      en_poss: "our",
      en_poss_indep: "ours",
      la: {
        nom: "nōs",
        gen: "nostrum",
        dat: "nōbīs",
        acc: "nōs",
        abl: "nōbīs",
      },
      la_cum: "nōbīscum", // Postpositive cum: "with us"
      la_poss: {
        // Possessive adjective: noster, nostra, nostrum
        m: {
          nom: { sg: "noster", pl: "nostrī" },
          gen: { sg: "nostrī", pl: "nostrōrum" },
          dat: { sg: "nostrō", pl: "nostrīs" },
          acc: { sg: "nostrum", pl: "nostrōs" },
          abl: { sg: "nostrō", pl: "nostrīs" },
        },
        f: {
          nom: { sg: "nostra", pl: "nostrae" },
          gen: { sg: "nostrae", pl: "nostrārum" },
          dat: { sg: "nostrae", pl: "nostrīs" },
          acc: { sg: "nostram", pl: "nostrās" },
          abl: { sg: "nostrā", pl: "nostrīs" },
        },
        n: {
          nom: { sg: "nostrum", pl: "nostra" },
          gen: { sg: "nostrī", pl: "nostrōrum" },
          dat: { sg: "nostrō", pl: "nostrīs" },
          acc: { sg: "nostrum", pl: "nostra" },
          abl: { sg: "nostrō", pl: "nostrīs" },
        },
      },
    },
  },
  2: {
    // 2nd person
    sg: {
      en: "you (sg.)",
      en_obj: "you (sg.)",
      en_poss: "your (sg.)",
      en_poss_indep: "yours (sg.)",
      la: {
        nom: "tū",
        gen: "tuī",
        dat: "tibi",
        acc: "tē",
        abl: "tē",
      },
      la_cum: "tēcum", // Postpositive cum: "with you (sg.)"
      la_poss: {
        // Possessive adjective: tuus, tua, tuum
        m: {
          nom: { sg: "tuus", pl: "tuī" },
          gen: { sg: "tuī", pl: "tuōrum" },
          dat: { sg: "tuō", pl: "tuīs" },
          acc: { sg: "tuum", pl: "tuōs" },
          abl: { sg: "tuō", pl: "tuīs" },
        },
        f: {
          nom: { sg: "tua", pl: "tuae" },
          gen: { sg: "tuae", pl: "tuārum" },
          dat: { sg: "tuae", pl: "tuīs" },
          acc: { sg: "tuam", pl: "tuās" },
          abl: { sg: "tuā", pl: "tuīs" },
        },
        n: {
          nom: { sg: "tuum", pl: "tua" },
          gen: { sg: "tuī", pl: "tuōrum" },
          dat: { sg: "tuō", pl: "tuīs" },
          acc: { sg: "tuum", pl: "tua" },
          abl: { sg: "tuō", pl: "tuīs" },
        },
      },
    },
    pl: {
      en: "you (pl.)",
      en_obj: "you (pl.)",
      en_poss: "your (pl.)",
      en_poss_indep: "yours (pl.)",
      la: {
        nom: "vōs",
        gen: "vestrum",
        dat: "vōbīs",
        acc: "vōs",
        abl: "vōbīs",
      },
      la_cum: "vōbīscum", // Postpositive cum: "with you (pl.)"
      la_poss: {
        // Possessive adjective: vester, vestra, vestrum
        m: {
          nom: { sg: "vester", pl: "vestrī" },
          gen: { sg: "vestrī", pl: "vestrōrum" },
          dat: { sg: "vestrō", pl: "vestrīs" },
          acc: { sg: "vestrum", pl: "vestrōs" },
          abl: { sg: "vestrō", pl: "vestrīs" },
        },
        f: {
          nom: { sg: "vestra", pl: "vestrae" },
          gen: { sg: "vestrae", pl: "vestrārum" },
          dat: { sg: "vestrae", pl: "vestrīs" },
          acc: { sg: "vestram", pl: "vestrās" },
          abl: { sg: "vestrā", pl: "vestrīs" },
        },
        n: {
          nom: { sg: "vestrum", pl: "vestra" },
          gen: { sg: "vestrī", pl: "vestrōrum" },
          dat: { sg: "vestrō", pl: "vestrīs" },
          acc: { sg: "vestrum", pl: "vestra" },
          abl: { sg: "vestrō", pl: "vestrīs" },
        },
      },
    },
  },
  3: {
    // 3rd person (using is/ea/id)
    sg: {
      m: {
        // Masculine
        en: "he",
        en_obj: "him",
        en_poss: "his",
        en_poss_indep: "his",
        la: {
          nom: "is",
          gen: "eius",
          dat: "eī",
          acc: "eum",
          abl: "eō",
        },
      },
      f: {
        // Feminine
        en: "she",
        en_obj: "her",
        en_poss: "her",
        en_poss_indep: "hers",
        la: {
          nom: "ea",
          gen: "eius",
          dat: "eī",
          acc: "eam",
          abl: "eā",
        },
      },
      n: {
        // Neuter
        en: "it",
        en_obj: "it",
        en_poss: "its",
        en_poss_indep: "its",
        la: {
          nom: "id",
          gen: "eius",
          dat: "eī",
          acc: "id",
          abl: "eō",
        },
      },
      // For 3rd person, use genitive of is/ea/id (eius) instead of possessive adjective
    },
    pl: {
      m: {
        // Masculine
        en: "they (m.)",
        en_obj: "them (m.)",
        en_poss: "their (m.)",
        en_poss_indep: "theirs (m.)",
        la: {
          nom: "eī",
          gen: "eōrum",
          dat: "eīs",
          acc: "eōs",
          abl: "eīs",
        },
      },
      f: {
        // Feminine
        en: "they (f.)",
        en_obj: "them (f.)",
        en_poss: "their (f.)",
        en_poss_indep: "theirs (f.)",
        la: {
          nom: "eae",
          gen: "eārum",
          dat: "eīs",
          acc: "eās",
          abl: "eīs",
        },
      },
      n: {
        // Neuter
        en: "they (n.)",
        en_obj: "them (n.)",
        en_poss: "their (n.)",
        en_poss_indep: "theirs (n.)",
        la: {
          nom: "ea",
          gen: "eōrum",
          dat: "eīs",
          acc: "ea",
          abl: "eīs",
        },
      },
      // For 3rd person plural, use genitive of is/ea/id (eōrum/eārum) instead of possessive adjective
    },
  },
};
