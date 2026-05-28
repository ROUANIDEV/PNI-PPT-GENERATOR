import JSZip from "jszip";

function getChartRelsPath(chartXmlPath: string) {
  const fileName = chartXmlPath.split("/").pop();

  if (!fileName) {
    return null;
  }

  return `ppt/charts/_rels/${fileName}.rels`;
}

function normalizeWorkbookTarget(target: string) {
  return target.replace("../", "ppt/");
}

export async function getWorkbookPathFromChart({
  zip,
  chartXmlPath,
}: {
  zip: JSZip;
  chartXmlPath: string;
}) {
  const chartRelsPath = getChartRelsPath(chartXmlPath);

  if (!chartRelsPath) {
    return null;
  }

  const relsFile = zip.file(chartRelsPath);

  if (!relsFile) {
    return null;
  }

  const relsXml = await relsFile.async("text");

  const relationshipMatch = relsXml.match(
    /<Relationship[^>]+Type="http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/relationships\/package"[^>]+Target="([^"]+)"/
  );

  if (!relationshipMatch) {
    return null;
  }

  return normalizeWorkbookTarget(relationshipMatch[1]);
}