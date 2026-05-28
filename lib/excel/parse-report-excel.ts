import * as XLSX from "xlsx";

import type {
  FormSection,
  MatrixSection,
  ReportData,
  TableSection,
  TemplateDefinition,
  TemplateSection,
} from "@/types/template";

import {
  findSheetName,
  getCellValue,
  normalizeExcelText,
  toNumber,
} from "@/lib/excel/excel-utils";

type ExcelRow = Record<string, unknown>;

function readSheetRows(workbook: XLSX.WorkBook, sheetName: string) {
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json<ExcelRow>(sheet, {
    defval: "",
  });
}

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

function parseFormSection(
  workbook: XLSX.WorkBook,
  section: FormSection,
  currentValue: unknown
) {
  const sheetName = findSheetName(workbook.SheetNames, getSheetAliases(section));

  if (!sheetName) {
    return currentValue;
  }

  const rows = readSheetRows(workbook, sheetName);
  const firstRow = rows[0];

  if (!firstRow) {
    return currentValue;
  }

  const value: Record<string, string | number> = {};

  for (const field of section.fields) {
    const rawValue = getCellValue(firstRow, [field.label, field.key]);

    if (field.inputType === "number") {
      value[field.key] = toNumber(rawValue);
    } else {
      value[field.key] = String(rawValue ?? "");
    }
  }

  return value;
}
function findMatchingExcelRow(
  rows: ExcelRow[],
  label: string,
  possibleHeaderLabels: string[]
) {
  const normalizedLabel = normalizeExcelText(label);

  return rows.find((row) => {
    const rowLabel = getCellValue(row, possibleHeaderLabels);

    return normalizeExcelText(rowLabel) === normalizedLabel;
  });
}
function parseTableSection(
  workbook: XLSX.WorkBook,
  section: TableSection,
  currentValue: unknown
) {
  const sheetName = findSheetName(workbook.SheetNames, getSheetAliases(section));

  if (!sheetName) {
    return currentValue;
  }

  const rows = readSheetRows(workbook, sheetName);

  if (rows.length === 0) {
    return currentValue;
  }

  return {
    rows: section.rows.map((templateRow, rowIndex) => {
      const excelRow =
  findMatchingExcelRow(rows, templateRow.label, [
    section.rowHeader,
    "Antigène",
    "Vaccin",
    "C/S",
    "Centre de santé",
  ]) ??
  rows[rowIndex] ??
  {};
      const values: Record<string, string | number> = {};

      for (const column of section.columns) {
        const rawValue = getCellValue(excelRow, [column.label, column.key]);

        if (column.inputType === "number") {
          values[column.key] = toNumber(rawValue);
        } else {
          values[column.key] = String(rawValue ?? "");
        }
      }

      if (section.autoCalculateRate) {
        const objectif = Number(values.objectif ?? 0);
        const realisation = Number(values.realisation ?? 0);

        values.taux = objectif > 0
  ? Math.round((realisation / objectif) * 100)
  : 0;
      }

      return {
        rowKey: templateRow.key,
        rowLabel: templateRow.label,
        values,
      };
    }),
  };
}

function parseMatrixSection(
  workbook: XLSX.WorkBook,
  section: MatrixSection,
  currentValue: unknown
) {
  const sheetName = findSheetName(workbook.SheetNames, getSheetAliases(section));

  if (!sheetName) {
    return currentValue;
  }

  const rows = readSheetRows(workbook, sheetName);

  if (rows.length === 0) {
    return currentValue;
  }

  return {
    rows: section.rows.map((templateRow, rowIndex) => {
      const excelRow =
  findMatchingExcelRow(rows, templateRow.label, [
    "Ligne",
    "Année",
    "Mois",
    section.title,
  ]) ??
  rows[rowIndex] ??
  {};
      const values: Record<string, number> = {};

      for (const column of section.columns) {
        const rawValue = getCellValue(excelRow, [column.label, column.key]);
        values[column.key] = toNumber(rawValue);
      }

      return {
        rowKey: templateRow.key,
        rowLabel: templateRow.label,
        values,
      };
    }),
  };
}

function parseListSection(
  workbook: XLSX.WorkBook,
  section: Extract<TemplateSection, { type: "list" }>,
  currentValue: unknown
) {
  const sheetName = findSheetName(workbook.SheetNames, getSheetAliases(section));

  if (!sheetName) {
    return currentValue;
  }

  const rows = readSheetRows(workbook, sheetName);

  const items = rows
    .map((row) => {
      return String(
        getCellValue(row, [section.itemLabel, "Texte", "Description", "Item"])
      ).trim();
    })
    .filter(Boolean);

  return {
    items: items.length > 0 ? items : [""],
  };
}

function parseSection(
  workbook: XLSX.WorkBook,
  section: TemplateSection,
  currentValue: unknown
) {
  if (section.type === "form") {
    return parseFormSection(workbook, section, currentValue);
  }

  if (section.type === "table") {
    return parseTableSection(workbook, section, currentValue);
  }

  if (section.type === "matrix") {
    return parseMatrixSection(workbook, section, currentValue);
  }

  if (section.type === "list") {
    return parseListSection(workbook, section, currentValue);
  }

  return currentValue;
}

export async function parseReportExcel({
  file,
  template,
  currentReport,
}: {
  file: File;
  template: TemplateDefinition;
  currentReport: ReportData;
}) {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const nextValues = {
    ...currentReport.values,
  };

  for (const section of template.sections) {
    nextValues[section.key] = parseSection(
      workbook,
      section,
      currentReport.values[section.key]
    );
  }

  return {
    ...currentReport,
    values: nextValues,
  };
}