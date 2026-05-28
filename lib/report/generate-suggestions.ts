import type { ReportData } from "@/types/template";

type SuggestionResult = {
  problems: string[];
  activities: string[];
};

type TableValue = {
  rows: {
    rowKey: string;
    rowLabel: string;
    values: Record<string, unknown>;
  }[];
};

function isTableValue(value: unknown): value is TableValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Array.isArray((value as TableValue).rows);
}

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

function addUnique(items: string[], item: string) {
  if (!items.includes(item)) {
    items.push(item);
  }
}

function analyzeBilan(
  report: ReportData,
  sectionKey: string,
  sectionTitle: string,
  problems: string[],
  activities: string[]
) {
  const sectionValue = report.values[sectionKey];

  if (!isTableValue(sectionValue)) {
    return;
  }

  for (const row of sectionValue.rows) {
    const objectif = toNumber(row.values.objectif);
    const realisation = toNumber(row.values.realisation);
    const taux = toNumber(row.values.taux);

    if (objectif <= 0) {
      continue;
    }

    if (realisation === 0) {
      addUnique(
        problems,
        `${row.rowLabel} : aucune réalisation enregistrée dans ${sectionTitle}.`
      );

      addUnique(
        activities,
        `Vérifier les données et programmer une action urgente pour ${row.rowLabel}.`
      );

      continue;
    }

    if (taux < 50) {
      addUnique(
        problems,
        `${row.rowLabel} : taux très faible (${taux} %) dans ${sectionTitle}.`
      );

      addUnique(
        activities,
        `Organiser des séances de rattrapage pour ${row.rowLabel}.`
      );
    }

    if (taux >= 50 && taux < 75) {
      addUnique(
        problems,
        `${row.rowLabel} : couverture moyenne (${taux} %) nécessitant un renforcement.`
      );

      addUnique(
        activities,
        `Renforcer la sensibilisation et le suivi des enfants non vaccinés pour ${row.rowLabel}.`
      );
    }
  }
}

function analyzeStock(
  report: ReportData,
  problems: string[],
  activities: string[]
) {
  const sectionValue = report.values.vaccineStock;

  if (!isTableValue(sectionValue)) {
    return;
  }

  for (const row of sectionValue.rows) {
    const stockFin = toNumber(row.values.stockFin);
    const dosesExpirees = toNumber(row.values.dosesExpirees);
    const pastilleTemperature = toNumber(row.values.pastilleTemperature);
    const dosesPerdues = toNumber(row.values.dosesPerdues);

    if (stockFin <= 2) {
      addUnique(
        problems,
        `${row.rowLabel} : stock final très faible (${stockFin} doses).`
      );

      addUnique(
        activities,
        `Assurer le réapprovisionnement rapide du vaccin ${row.rowLabel}.`
      );
    }

    if (dosesExpirees > 0) {
      addUnique(
        problems,
        `${row.rowLabel} : ${dosesExpirees} dose(s) dépassant la date d’expiration.`
      );

      addUnique(
        activities,
        `Renforcer le suivi des dates d’expiration pour le vaccin ${row.rowLabel}.`
      );
    }

    if (pastilleTemperature > 0) {
      addUnique(
        problems,
        `${row.rowLabel} : virage de la pastille de contrôle de température.`
      );

      addUnique(
        activities,
        `Renforcer la surveillance de la chaîne de froid pour le vaccin ${row.rowLabel}.`
      );
    }

    if (dosesPerdues > 0) {
      addUnique(
        problems,
        `${row.rowLabel} : ${dosesPerdues} dose(s) perdues durant la période.`
      );

      addUnique(
        activities,
        `Analyser les causes de perte et améliorer la gestion du vaccin ${row.rowLabel}.`
      );
    }
  }
}

export function generateSuggestions(report: ReportData): SuggestionResult {
  const problems: string[] = [];
  const activities: string[] = [];

  analyzeBilan(
    report,
    "bilanPni2025",
    "Bilan PNI 2025",
    problems,
    activities
  );

  analyzeBilan(
    report,
    "bilanPni2026T1",
    "Bilan PNI 2026 (1er trim)",
    problems,
    activities
  );

  analyzeStock(report, problems, activities);

  if (problems.length === 0) {
    problems.push(
      "Aucun problème majeur détecté automatiquement à partir des données saisies."
    );
  }

  if (activities.length === 0) {
    activities.push(
      "Maintenir le suivi régulier des activités de vaccination et renforcer la supervision."
    );
  }

  addUnique(
    activities,
    "Renforcer la sensibilisation communautaire autour de la vaccination de routine."
  );

  addUnique(
    activities,
    "Assurer un suivi mensuel des indicateurs PNI et des enfants non ou insuffisamment vaccinés."
  );

  return {
    problems,
    activities,
  };
}