import type {
  FormSection,
  MatrixSection,
  ReportData,
  TableSection,
  TemplateDefinition,
  TemplateField,
  TemplateSection,
} from "@/types/template";

function getDefaultFieldValue(field: TemplateField) {
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  if (field.inputType === "number") {
    return 0;
  }

  if (field.inputType === "date") {
    return new Date().toISOString().slice(0, 10);
  }

  return "";
}

function createFormValue(section: FormSection) {
  const value: Record<string, string | number> = {};

  for (const field of section.fields) {
    value[field.key] = getDefaultFieldValue(field);
  }

  return value;
}

function createTableValue(section: TableSection) {
  return {
    rows: section.rows.map((row) => {
      const values: Record<string, string | number> = {};

      for (const column of section.columns) {
        values[column.key] = column.inputType === "number" ? 0 : "";
      }

      return {
        rowKey: row.key,
        rowLabel: row.label,
        values,
      };
    }),
  };
}

function createMatrixValue(section: MatrixSection) {
  return {
    rows: section.rows.map((row) => {
      const values: Record<string, number> = {};

      for (const column of section.columns) {
        values[column.key] = 0;
      }

      return {
        rowKey: row.key,
        rowLabel: row.label,
        values,
      };
    }),
  };
}

function createSectionValue(section: TemplateSection) {
  if (section.type === "form") {
    return createFormValue(section);
  }

  if (section.type === "table") {
    return createTableValue(section);
  }

  if (section.type === "matrix") {
    return createMatrixValue(section);
  }

  if (section.type === "list") {
    return {
      items: [""],
    };
  }

  if (section.type === "chart") {
    return {
      enabled: true,
    };
  }

  return {};
}

export function createEmptyReport(template: TemplateDefinition): ReportData {
  const values: ReportData["values"] = {};

  for (const section of template.sections) {
    values[section.key] = createSectionValue(section);
  }

  return {
    templateId: template.id,
    values,
  };
}