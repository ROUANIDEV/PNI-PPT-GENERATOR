import type { TemplateColumn, TemplateField } from "@/types/template";

export type PrimitiveValue = string | number;
export type FormValue = Record<string, PrimitiveValue>;

export type TableRowValue = {
  rowKey: string;
  rowLabel: string;
  values: Record<string, PrimitiveValue>;
};

export type MatrixRowValue = {
  rowKey: string;
  rowLabel: string;
  values: Record<string, number>;
};

export type TableValue = { rows: TableRowValue[] };
export type MatrixValue = { rows: MatrixRowValue[] };
export type ListValue = { items: string[] };
export type InputField = TemplateField | TemplateColumn;

type RateLikeField = { key?: string; label?: string };

export function toNumber(value: string) {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatRate(objectif: number, realisation: number) {
  if (!objectif || objectif <= 0) return 0;
  return Math.round((realisation / objectif) * 100);
}

export function getInputValue(value: PrimitiveValue | undefined) {
  if (value === undefined || value === null) return "";
  return String(value);
}

export function isRateField(field: RateLikeField) {
  const key = field.key?.toLowerCase() ?? "";
  const label = field.label?.toLowerCase() ?? "";
  return key === "taux" || key.includes("taux") || label.includes("taux");
}
