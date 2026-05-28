import { getWorkbookPathFromChart } from "@/lib/pptx/chart-workbook-relations";
import { updateChartWorkbook } from "@/lib/pptx/update-chart-workbook";

import { getChartXmlPathFromSlide } from "@/lib/pptx/chart-relations";
import { updateNativeChartCache } from "@/lib/pptx/native-chart-cache";

import JSZip from "jszip";

import type { ReportData, TemplateDefinition } from "@/types/template";

import {
  bulletListToText,
  getSlideXmlPath,
  setShapeTextByExistingText,
  setTableCellText,
} from "@/lib/pptx/pptx-dom-utils";

import {
  formatNumber,
  formatPercent,
  normalizeText,
} from "@/lib/pptx/xml-utils";

type GeneratePptxInput = {
  templateFile: File;
  template: TemplateDefinition;
  report: ReportData;
};

type FormValue = Record<string, unknown>;

type TableValue = {
  rows: {
    rowKey: string;
    rowLabel: string;
    values: Record<string, unknown>;
  }[];
};

type ListValue = {
  items: string[];
};

type MatrixValue = {
  rows: {
    rowKey: string;
    rowLabel: string;
    values: Record<string, number>;
  }[];
};

type NativeChartData = {
  categories: string[];
  series: {
    name: string;
    values: number[];
  }[];
};

function isFormValue(value: unknown): value is FormValue {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isTableValue(value: unknown): value is TableValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Array.isArray((value as TableValue).rows);
}

function isListValue(value: unknown): value is ListValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Array.isArray((value as ListValue).items);
}

function getFormValue(report: ReportData, sectionKey: string, fieldKey: string) {
  const sectionValue = report.values[sectionKey];

  if (!isFormValue(sectionValue)) {
    return "";
  }

  return sectionValue[fieldKey] ?? "";
}

function formatCellValue(columnKey: string, value: unknown) {
  if (columnKey === "taux") {
    return formatPercent(value);
  }

  if (typeof value === "number") {
    return formatNumber(value);
  }

  return normalizeText(value);
}

async function readSlideXml(zip: JSZip, slideIndex: number) {
  const path = getSlideXmlPath(slideIndex);
  const file = zip.file(path);

  if (!file) {
    return null;
  }

  return file.async("text");
}

function writeSlideXml(zip: JSZip, slideIndex: number, xml: string) {
  const path = getSlideXmlPath(slideIndex);
  zip.file(path, xml);
}

async function updateSlide(
  zip: JSZip,
  slideIndex: number,
  updater: (xml: string) => string
) {
  const xml = await readSlideXml(zip, slideIndex);

  if (!xml) {
    return;
  }

  const nextXml = updater(xml);
  writeSlideXml(zip, slideIndex, nextXml);
}

function formatDateFr(value: unknown) {
  const text = normalizeText(value);

  if (!text) {
    return "";
  }

  const parts = text.split("-");

  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  return text;
}

async function fillTitleSlide(zip: JSZip, report: ReportData) {
  const centerName = getFormValue(report, "centerInfo", "centerName");
  const reportDate = getFormValue(report, "centerInfo", "reportDate");
  const reportYear = getFormValue(report, "centerInfo", "reportYear");

  const formattedDate = formatDateFr(reportDate);

  await updateSlide(zip, 0, (xml) => {
    let nextXml = xml;

    nextXml = setShapeTextByExistingText(
      nextXml,
      "Centre de sante",
      `Centre de santé : ${normalizeText(centerName)}\nLe ${formattedDate}`
    );

    nextXml = nextXml.replaceAll(
      "Année 2025",
      `Année ${normalizeText(reportYear)}`
    );

    return nextXml;
  });
}

async function fillTableSection(
  zip: JSZip,
  template: TemplateDefinition,
  report: ReportData,
  sectionKey: string
) {
  const section = template.sections.find((item) => item.key === sectionKey);

  if (!section || section.type !== "table" || !section.pptx) {
    return;
  }

  const tableValue = report.values[section.key];

  if (!isTableValue(tableValue)) {
    return;
  }

  const slideIndex = section.pptx.slideIndex;
  const tableIndex = section.pptx.tableIndex ?? 0;

  await updateSlide(zip, slideIndex, (xml) => {
    let nextXml = xml;

    tableValue.rows.forEach((row, rowIndex) => {
      const pptxRowIndex = rowIndex + 1;
      const firstColumnIsData = section.columns[0]?.key === "centerName";

      if (!firstColumnIsData) {
        nextXml = setTableCellText(
          nextXml,
          tableIndex,
          pptxRowIndex,
          0,
          row.rowLabel
        );
      }

      section.columns.forEach((column, columnIndex) => {
        const pptxColumnIndex = firstColumnIsData
          ? columnIndex
          : columnIndex + 1;

        const cellValue = row.values[column.key];

        nextXml = setTableCellText(
          nextXml,
          tableIndex,
          pptxRowIndex,
          pptxColumnIndex,
          formatCellValue(column.key, cellValue),
          {
            bold: column.key === "taux",
          }
        );
      });
    });

    return nextXml;
  });
}

function getCenterName(report: ReportData) {
  return normalizeText(getFormValue(report, "centerInfo", "centerName"));
}

async function fillProblemsAndActivities(
  zip: JSZip,
  template: TemplateDefinition,
  report: ReportData
) {
  const problemsSection = template.sections.find((item) => {
    return item.key === "problems";
  });

  const activitiesSection = template.sections.find((item) => {
    return item.key === "activities";
  });

  const problemsValue = report.values.problems;
  const activitiesValue = report.values.activities;

  if (
    !problemsSection?.pptx ||
    !activitiesSection?.pptx ||
    !isListValue(problemsValue) ||
    !isListValue(activitiesValue)
  ) {
    return;
  }

  const centerName = getCenterName(report);
  const slideIndex = problemsSection.pptx.slideIndex;
  const tableIndex = problemsSection.pptx.tableIndex ?? 0;

  await updateSlide(zip, slideIndex, (xml) => {
    let nextXml = xml;

    nextXml = setShapeTextByExistingText(
      nextXml,
      "Améliorer la vaccination",
      `Améliorer la vaccination de routine au niveau de la ${centerName}: les activités prévues 2026`
    );

    nextXml = setTableCellText(
      nextXml,
      tableIndex,
      0,
      0,
      "Problems identifies"
    );

    nextXml = setTableCellText(
      nextXml,
      tableIndex,
      0,
      1,
      bulletListToText(problemsValue.items)
    );

    nextXml = setTableCellText(
      nextXml,
      tableIndex,
      1,
      0,
      "Activités planifiées"
    );

    nextXml = setTableCellText(
      nextXml,
      tableIndex,
      1,
      1,
      bulletListToText(activitiesValue.items)
    );

    return nextXml;
  });
}

function isMatrixValue(value: unknown): value is MatrixValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Array.isArray((value as MatrixValue).rows);
}

function buildChartDataFromMatrix(
  template: TemplateDefinition,
  report: ReportData,
  sourceSectionKey: string
): NativeChartData | null {
  const sourceSection = template.sections.find((section) => {
    return section.key === sourceSectionKey;
  });

  if (!sourceSection || sourceSection.type !== "matrix") {
    return null;
  }

  const sourceValue = report.values[sourceSectionKey];

  if (!isMatrixValue(sourceValue)) {
    return null;
  }

  return {
    categories: sourceSection.columns.map((column) => column.label),
    series: sourceValue.rows.map((row) => {
      return {
        name: row.rowLabel,
        values: sourceSection.columns.map((column) => {
          return Number(row.values[column.key] ?? 0);
        }),
      };
    }),
  };
}

async function fillNativeCharts(
  zip: JSZip,
  template: TemplateDefinition,
  report: ReportData
) {
  const chartSections = template.sections.filter((section) => {
    return section.type === "chart";
  });

  for (const chartSection of chartSections) {
    if (chartSection.type !== "chart" || !chartSection.pptx) {
      continue;
    }

    const chartData = buildChartDataFromMatrix(
      template,
      report,
      chartSection.sourceSectionKey
    );

    if (!chartData) {
      continue;
    }

    const chartXmlPath = await getChartXmlPathFromSlide({
      zip,
      slideIndex: chartSection.pptx.slideIndex,
      chartIndex: chartSection.pptx.chartIndex ?? 0,
    });

    if (!chartXmlPath) {
      continue;
    }

    const chartFile = zip.file(chartXmlPath);

    if (!chartFile) {
      continue;
    }

    const chartXml = await chartFile.async("text");

    const nextChartXml = updateNativeChartCache({
  chartXml,
  categories: chartData.categories,
  series: chartData.series,
});

zip.file(chartXmlPath, nextChartXml);

const workbookPath = await getWorkbookPathFromChart({
  zip,
  chartXmlPath,
});

if (workbookPath) {
  const workbookFile = zip.file(workbookPath);

  if (workbookFile) {
    const workbookBuffer = await workbookFile.async("arraybuffer");

    const nextWorkbookBuffer = updateChartWorkbook(
      workbookBuffer,
      chartData
    );

    zip.file(workbookPath, nextWorkbookBuffer);
  }
}

    zip.file(chartXmlPath, nextChartXml);
  }
}

export async function generatePptx({
  templateFile,
  template,
  report,
}: GeneratePptxInput) {
  const fileBuffer = await templateFile.arrayBuffer();
  const zip = await JSZip.loadAsync(fileBuffer);

  await fillTitleSlide(zip, report);

  await fillTableSection(zip, template, report, "demographics");
  await fillTableSection(zip, template, report, "coldChain");
  await fillTableSection(zip, template, report, "smi2025");
  await fillTableSection(zip, template, report, "bilanPni2025");
  await fillTableSection(zip, template, report, "bilanPni2026T1");
  await fillTableSection(zip, template, report, "vaccineStock");

  await fillProblemsAndActivities(zip, template, report);

await fillNativeCharts(zip, template, report);

return zip.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
}