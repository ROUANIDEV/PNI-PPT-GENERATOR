import * as XLSX from "xlsx";

import type {
  FormSection,
  MatrixSection,
  TableSection,
  TemplateDefinition,
  TemplateSection,
} from "@/types/template";

function getSheetName(section: TemplateSection) {
  const names: Record<string, string> = {
    centerInfo: "Informations du centre",
    demographics: "Données démographiques",
    coldChain: "Chaîne de froid",
    smi2025: "Bilan SMI",
    bilanPni2025: "Bilan PNI 2025",
    bilanPni2026T1: "Bilan PNI 2026 T1",
    coverageByYear: "Couverture",
    monthlyPenta: "PENTA",
    monthlyBcgRr: "BCG RR",
    vaccineStock: "Stock vaccins",
    problems: "Problèmes",
    activities: "Activités",
  };

  return names[section.key] ?? section.title.slice(0, 31);
}

function createFormRows(section: FormSection) {
  const row: Record<string, string | number> = {};

  for (const field of section.fields) {
    row[field.label] =
      typeof field.defaultValue === "number" ? field.defaultValue : "";
  }

  return [row];
}

function createTableRows(section: TableSection) {
  return section.rows.map((row) => {
    const item: Record<string, string | number> = {
      [section.rowHeader]: row.label,
    };

    for (const column of section.columns) {
      item[column.label] = column.readonly ? "" : 0;
    }

    return item;
  });
}

function createMatrixRows(section: MatrixSection) {
  return section.rows.map((row) => {
    const item: Record<string, string | number> = {
      Ligne: row.label,
    };

    for (const column of section.columns) {
      item[column.label] = 0;
    }

    return item;
  });
}

function createListRows(section: Extract<TemplateSection, { type: "list" }>) {
  return [
    {
      [section.itemLabel]: "",
    },
  ];
}

function createRows(section: TemplateSection) {
  if (section.type === "form") {
    return createFormRows(section);
  }

  if (section.type === "table") {
    return createTableRows(section);
  }

  if (section.type === "matrix") {
    return createMatrixRows(section);
  }

  if (section.type === "list") {
    return createListRows(section);
  }

  return [];
}

export function createExcelTemplate(template: TemplateDefinition) {
  const workbook = XLSX.utils.book_new();

  for (const section of template.sections) {
    if (section.type === "chart") {
      continue;
    }

    const rows = createRows(section);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const sheetName = getSheetName(section);

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  const output = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  return new Blob([output], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}