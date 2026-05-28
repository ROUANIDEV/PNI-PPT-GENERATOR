import type {
  TemplateColumn,
  TemplateDefinition,
  TemplateRow,
} from "@/types/template";

const months: TemplateRow[] = [
  { key: "jan", label: "JAN" },
  { key: "fev", label: "FEV" },
  { key: "mars", label: "MARS" },
  { key: "avr", label: "AVR" },
  { key: "mai", label: "MAI" },
  { key: "juin", label: "JUIN" },
  { key: "juil", label: "JUIL" },
  { key: "aout", label: "AOUT" },
  { key: "sept", label: "SEPT" },
  { key: "oct", label: "OCT" },
  { key: "nov", label: "NOV" },
  { key: "dec", label: "DEC" },
];

const pniRows: TemplateRow[] = [
  { key: "bcg", label: "BCG" },
  { key: "vpo1", label: "VPO 1" },
  { key: "penta3", label: "PENTA 3" },
  { key: "vpi2", label: "VPI 2" },
  { key: "rota3", label: "ROTA 3" },
  { key: "rr9", label: "RR 9 MOIS" },
  {
    key: "pneumo",
    label: "PNEUMO 4/PNEUMO 3(prevenar)",
  },
  { key: "dtc18", label: "DTC 18 MOIS" },
  { key: "rr18", label: "RR 18MOIS" },
  { key: "dtc5", label: "DTC 5ANS" },
  { key: "hpv", label: "HPV" },
];

const stockRows: TemplateRow[] = [
  { key: "bcg", label: "BCG" },
  { key: "dtc", label: "DTC" },
  { key: "vpo", label: "VPO" },
  { key: "vpi", label: "VPI" },
  { key: "penta", label: "Penta" },
  { key: "hb", label: "H.B" },
  { key: "rr", label: "RR" },
  { key: "pneumo", label: "Pneumo" },
  { key: "rota", label: "Rota" },
  { key: "td", label: "Td" },
  { key: "hpv", label: "HPV" },
];

const coverageColumns: TemplateRow[] = [
  { key: "bcg", label: "BCG" },
  { key: "hb1n24h", label: "HB1N (24 h)" },
  { key: "penta1", label: "Penta1" },
  { key: "vpi", label: "VPI" },
  { key: "penta3", label: "Penta3" },
  { key: "rota1", label: "Rota1" },
  { key: "rota3", label: "Rota3" },
  { key: "pneumo1", label: "Pneumo1" },
  { key: "pneumo3", label: "Pneumo3" },
  { key: "rr9", label: "RR 9" },
  { key: "rr18", label: "RR 18" },
  { key: "dtc2", label: "DTC2" },
];

const bilanColumns: TemplateColumn[] = [
  {
    key: "objectif",
    label: "OBJECTIF",
    inputType: "number",
  },
  {
    key: "realisation",
    label: "REALISATION",
    inputType: "number",
  },
  {
    key: "taux",
    label: "TAUX",
    inputType: "number",
    readonly: true,
  },
];

export const pniTemplate: TemplateDefinition = {
  id: "pni-template",
  name: "Modèle PNI réunion provinciale",
  language: "fr",

  sections: [
    {
      key: "centerInfo",
      type: "form",
      order: 1,
      title: "Informations du centre",
      description: "Informations utilisées dans la première diapositive.",
      pptx: {
        slideIndex: 0,
      },
      fields: [
        {
          key: "centerName",
          label: "Centre de santé",
          inputType: "text",
          required: true,
        },
        {
          key: "reportDate",
          label: "Date de la réunion",
          inputType: "date",
          required: true,
        },
        {
          key: "reportYear",
          label: "Année",
          inputType: "number",
          required: true,
          defaultValue: 2025,
        },
      ],
    },

    {
      key: "demographics",
      type: "table",
      order: 2,
      title: "Données démographiques",
      rowHeader: "C/S",
      allowCustomRows: false,
      pptx: {
        slideIndex: 1,
        tableIndex: 0,
      },
      rows: [{ key: "main", label: "Centre de santé" }],
      columns: [
        { key: "centerName", label: "C/S", inputType: "text" },
        {
          key: "populationGenerale",
          label: "Population générale",
          inputType: "number",
        },
        {
          key: "naissancesAttendues",
          label: "Naissances attendues",
          inputType: "number",
        },
        {
          key: "enfantsMoinsUnAn",
          label: "Enfants de moins d’un an",
          inputType: "number",
        },
        {
          key: "moyenneBcg",
          label: "Moyenne des BCG",
          inputType: "number",
        },
        {
          key: "enfants12Mois",
          label: "Enfants de 12 mois",
          inputType: "number",
        },
        {
          key: "enfants18Mois",
          label: "Enfants de 18 mois",
          inputType: "number",
        },
        {
          key: "enfants5Ans",
          label: "Enfants de 5 ans",
          inputType: "number",
        },
      ],
    },

    {
      key: "coldChain",
      type: "table",
      order: 3,
      title: "Équipements de la chaîne de froid du PNI",
      rowHeader: "Centre de santé",
      allowCustomRows: false,
      pptx: {
        slideIndex: 2,
        tableIndex: 0,
      },
      rows: [{ key: "main", label: "Centre de santé" }],
      columns: [
        {
          key: "centerName",
          label: "Centre de santé",
          inputType: "text",
        },
        {
          key: "refrigerateurs",
          label: "Réfrigérateurs",
          inputType: "number",
        },
        {
          key: "caissesIsothermes",
          label: "Caisses isothermes",
          inputType: "number",
        },
        {
          key: "portesVaccins",
          label: "Portes vaccins",
          inputType: "number",
        },
      ],
    },

    {
      key: "smi2025",
      type: "table",
      order: 4,
      title: "Bilan 2025 SMI",
      rowHeader: "C/S",
      allowCustomRows: false,
      pptx: {
        slideIndex: 3,
        tableIndex: 0,
      },
      rows: [{ key: "main", label: "Centre de santé" }],
      columns: [
        { key: "centerName", label: "C/S", inputType: "text" },
        {
          key: "femmesSuiviCpn",
          label: "Nombre femme suivi en CPN",
          inputType: "number",
        },
        {
          key: "femmesSuiviCpon",
          label: "Nombre femme suivi en CPON",
          inputType: "number",
        },
        {
          key: "enfantsVaccinesBcg",
          label: "Nombre des enfant vacciné par BCG",
          inputType: "number",
        },
        {
          key: "femmesSuiviPf",
          label: "Nombre des Femme suivi en PF",
          inputType: "number",
        },
      ],
    },

    {
      key: "bilanPni2025",
      type: "table",
      order: 5,
      title: "Bilan PNI 2025",
      rowHeader: "Antigène",
      allowCustomRows: true,
      autoCalculateRate: true,
      pptx: {
        slideIndex: 4,
        tableIndex: 0,
      },
      rows: pniRows,
      columns: bilanColumns,
    },

    {
      key: "bilanPni2026T1",
      type: "table",
      order: 6,
      title: "Bilan PNI 2026 (1er trim)",
      rowHeader: "Antigène",
      allowCustomRows: true,
      autoCalculateRate: true,
      pptx: {
        slideIndex: 5,
        tableIndex: 0,
      },
      rows: pniRows,
      columns: bilanColumns,
    },

    {
      key: "coverageByYear",
      type: "matrix",
      order: 7,
      title: "Couverture vaccinale par antigène",
      description: "Entre 2023 et 2025.",
      pptx: {
        slideIndex: 6,
        chartIndex: 0,
      },
      rows: [
        { key: "year2025", label: "2025" },
        { key: "year2024", label: "2024" },
        { key: "year2023", label: "2023" },
      ],
      columns: coverageColumns,
    },

    {
  key: "coverageChart",
  type: "chart",
  order: 8,
  title: "Graphique couverture vaccinale",
  chartType: "bar",
  sourceSectionKey: "coverageByYear",
  pptx: {
    slideIndex: 6,
    chartIndex: 0,
  },
},

    {
      key: "monthlyPenta",
      type: "matrix",
      order: 9,
      title: "Suivi de la vaccination PENTA 1 et PENTA 3",
      pptx: {
        slideIndex: 7,
        chartIndex: 0,
      },
      rows: [
        { key: "objectif", label: "objectif" },
        { key: "penta1", label: "PENTA 1" },
        { key: "penta3", label: "PENTA 3" },
      ],
      columns: months,
    },

    {
      key: "monthlyPentaChart",
      type: "chart",
      order: 10,
      title: "Graphique PENTA 1 / PENTA 3",
      chartType: "line",
      sourceSectionKey: "monthlyPenta",
      pptx: {
        slideIndex: 7,
        chartIndex: 0,
      },
    },

    {
      key: "monthlyBcgRr",
      type: "matrix",
      order: 11,
      title: "Suivi de la vaccination RR et BCG",
      pptx: {
        slideIndex: 8,
        chartIndex: 0,
      },
      rows: [
        { key: "bcg", label: "BCG" },
        { key: "rr", label: "RR" },
      ],
      columns: months,
    },

    {
      key: "monthlyBcgRrChart",
      type: "chart",
      order: 12,
      title: "Graphique BCG / RR",
      chartType: "line",
      sourceSectionKey: "monthlyBcgRr",
      pptx: {
        slideIndex: 8,
        chartIndex: 0,
      },
    },

    {
      key: "vaccineStock",
      type: "table",
      order: 13,
      title: "Gestion des vaccins",
      rowHeader: "Vaccin",
      allowCustomRows: true,
      pptx: {
        slideIndex: 9,
        tableIndex: 0,
      },
      rows: stockRows,
      columns: [
        {
          key: "stockDebut",
          label: "Etat du stock au début de la période",
          inputType: "number",
        },
        {
          key: "dosesRecues",
          label: "Total des doses reçu durant l’année",
          inputType: "number",
        },
        {
          key: "dosesExpirees",
          label: "Dépassement de la date d’expiration",
          inputType: "number",
        },
        {
          key: "pastilleTemperature",
          label: "Virage de la pastille de control de la température",
          inputType: "number",
        },
        {
          key: "dosesPerdues",
          label: "Nombre total des doses perdus",
          inputType: "number",
        },
        {
          key: "dosesAdministrees",
          label: "Total des doses administrées durant l’année",
          inputType: "number",
        },
        {
          key: "stockFin",
          label: "Etat du stock à la fin de la période",
          inputType: "number",
        },
      ],
    },

    {
      key: "problems",
      type: "list",
      order: 14,
      title: "Problèmes identifiés",
      itemLabel: "Problème",
      aiGenerated: true,
      pptx: {
        slideIndex: 10,
        tableIndex: 0,
        columnIndex: 0,
      },
    },

    {
      key: "activities",
      type: "list",
      order: 15,
      title: "Activités planifiées",
      itemLabel: "Activité",
      aiGenerated: true,
      pptx: {
        slideIndex: 10,
        tableIndex: 0,
        columnIndex: 1,
      },
    },
  ],
};