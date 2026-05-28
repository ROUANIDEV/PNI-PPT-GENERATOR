export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function normalizeText(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function formatPercent(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "";
  }

  return `${Math.round(numberValue)} %`;
}

export function formatNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "";
  }

  return new Intl.NumberFormat("fr-FR").format(numberValue);
}

export function replaceFirstTextOccurrence(
  xml: string,
  searchText: string,
  replacementText: string
) {
  const escapedSearchText = escapeXml(searchText);
  const escapedReplacementText = escapeXml(replacementText);

  return xml.replace(escapedSearchText, escapedReplacementText);
}

export function replaceAllTextOccurrences(
  xml: string,
  searchText: string,
  replacementText: string
) {
  const escapedSearchText = escapeXml(searchText);
  const escapedReplacementText = escapeXml(replacementText);

  return xml.replaceAll(escapedSearchText, escapedReplacementText);
}