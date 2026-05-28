export function normalizeExcelText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("’", "'")
    .replaceAll("`", "'")
    .replace(/\s+/g, " ");
}

export function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value
      .replace(/\s/g, "")
      .replace(",", ".")
      .replace("%", "");

    const parsed = Number(cleaned);

    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

export function getCellValue(
  row: Record<string, unknown>,
  possibleLabels: string[]
) {
  const normalizedLabels = possibleLabels.map(normalizeExcelText);

  for (const [key, value] of Object.entries(row)) {
    if (normalizedLabels.includes(normalizeExcelText(key))) {
      return value;
    }
  }

  return "";
}

export function findSheetName(
  workbookSheetNames: string[],
  possibleNames: string[]
) {
  const normalizedPossibleNames = possibleNames.map(normalizeExcelText);

  return (
    workbookSheetNames.find((sheetName) => {
      return normalizedPossibleNames.includes(normalizeExcelText(sheetName));
    }) ?? null
  );
}