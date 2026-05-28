import * as XLSX from "xlsx";

export type WorkbookChartData = {
  categories: string[];
  series: {
    name: string;
    values: number[];
  }[];
};

export function updateChartWorkbook(
  workbookBuffer: ArrayBuffer,
  chartData: WorkbookChartData
) {
  const workbook = XLSX.read(workbookBuffer, {
    type: "array",
  });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return workbookBuffer;
  }

  const rows: (string | number)[][] = [];

  rows.push([
    "",
    ...chartData.series.map((series) => {
      return series.name;
    }),
  ]);

  chartData.categories.forEach((category, categoryIndex) => {
    rows.push([
      category,
      ...chartData.series.map((series) => {
        return series.values[categoryIndex] ?? 0;
      }),
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  workbook.Sheets[sheetName] = worksheet;

  const output = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  return output as ArrayBuffer;
}