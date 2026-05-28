import * as XLSX from "xlsx";

import type { TemplateDefinition, TemplateSection } from "@/types/template";

import { findSheetName } from "@/lib/excel/excel-utils";

function getSheetAliases(section: TemplateSection) {
  const aliases: Record<string, string[]> = {
    centerInfo: ["Informations du centre", "Centre", "Info centre"],
    demographics: ["Données démographiques", "Demographie", "Démographie"],
    coldChain: ["Chaîne de froid", "Chaine de froid", "Equipements"],
    smi2025: ["Bilan SMI", "SMI", "Bilan 2025 SMI"],
    bilanPni2025: ["Bilan PNI 2025", "PNI 2025"],
    bilanPni2026T1: ["Bilan PNI 2026 T1", "PNI 2026 T1", "PNI 2026"],
    coverageByYear: ["Couverture", "Couverture vaccinale"],
    monthlyPenta: ["PENTA", "Suivi PENTA"],
    monthlyBcgRr: ["BCG RR", "Suivi BCG RR", "RR BCG"],
    vaccineStock: ["Stock vaccins", "Gestion des vaccins", "Stock"],
    problems: ["Problèmes", "Problemes"],
    activities: ["Activités", "Activites"],
  };

  return aliases[section.key] ?? [section.title, section.key];
}

export async function validateReportExcel({
  file,
  template,
}: {
  file: File;
  template: TemplateDefinition;
}) {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const warnings: string[] = [];

  for (const section of template.sections) {
    if (section.type === "chart") {
      continue;
    }

    const sheetName = findSheetName(
      workbook.SheetNames,
      getSheetAliases(section)
    );

    if (!sheetName) {
      warnings.push(`Feuille manquante : ${section.title}`);
    }
  }

  return warnings;
}