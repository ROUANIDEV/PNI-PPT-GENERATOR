import JSZip from "jszip";

export function getSlideRelsPath(slideIndex: number) {
  return `ppt/slides/_rels/slide${slideIndex + 1}.xml.rels`;
}

function normalizeChartTarget(target: string) {
  return target.replace("../", "ppt/");
}

export async function getChartXmlPathFromSlide({
  zip,
  slideIndex,
  chartIndex = 0,
}: {
  zip: JSZip;
  slideIndex: number;
  chartIndex?: number;
}) {
  const relsPath = getSlideRelsPath(slideIndex);
  const relsFile = zip.file(relsPath);

  if (!relsFile) {
    return null;
  }

  const relsXml = await relsFile.async("text");

  const chartRelationships = [...relsXml.matchAll(/<Relationship[^>]+>/g)]
    .map((match) => match[0])
    .filter((relationship) => {
      return relationship.includes(
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart"'
      );
    });

  const chartRelationship = chartRelationships[chartIndex];

  if (!chartRelationship) {
    return null;
  }

  const targetMatch = chartRelationship.match(/Target="([^"]+)"/);

  if (!targetMatch) {
    return null;
  }

  return normalizeChartTarget(targetMatch[1]);
}