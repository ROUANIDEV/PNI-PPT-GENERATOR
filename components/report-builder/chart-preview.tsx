"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { ChartSection, MatrixSection, TemplateSection } from "@/types/template";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MatrixValue } from "./report-value-types";

type ChartPreviewProps = {
  section: ChartSection;
  sections: TemplateSection[];
  allValues: Record<string, unknown>;
};

const chartColors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c", "#0891b2"];

function isMatrixValue(value: unknown): value is MatrixValue {
  return Boolean(value && typeof value === "object" && Array.isArray((value as MatrixValue).rows));
}

function getSourceSection(chartSection: ChartSection, sections: TemplateSection[]): MatrixSection | null {
  const sourceSection = sections.find((item) => item.key === chartSection.sourceSectionKey);
  return sourceSection?.type === "matrix" ? sourceSection : null;
}

function buildChartConfig(sourceValue: MatrixValue): ChartConfig {
  return sourceValue.rows.reduce<ChartConfig>((config, row, index) => {
    config[row.rowKey] = { label: row.rowLabel, color: chartColors[index % chartColors.length] };
    return config;
  }, {});
}

function buildChartData(sourceSection: MatrixSection, sourceValue: MatrixValue) {
  return sourceSection.columns.map((column) => {
    const item: Record<string, string | number> = { category: column.label };
    sourceValue.rows.forEach((row) => {
      item[row.rowKey] = Number(row.values[column.key] ?? 0);
    });
    return item;
  });
}

export function ChartPreview({ section, sections, allValues }: ChartPreviewProps) {
  const sourceSection = getSourceSection(section, sections);
  const sourceValue = allValues[section.sourceSectionKey];

  if (!sourceSection || !isMatrixValue(sourceValue)) {
    return (
      <p className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
        Impossible de générer le graphique. La section source est introuvable.
      </p>
    );
  }

  const chartData = buildChartData(sourceSection, sourceValue);
  const chartConfig = buildChartConfig(sourceValue);
  const chartWidth = Math.max(720, sourceSection.columns.length * 130);
  const scrollClass = "overflow-x-scroll pb-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-muted/40";

  return (
    <div className="min-w-0 space-y-3">
      <div className="rounded-2xl border bg-card p-3 shadow-sm">
        <div className={scrollClass}>
          <div style={{ minWidth: chartWidth }}>
            <ChartContainer config={chartConfig} className="h-[340px] w-full">
              {section.chartType === "bar" ? (
                <BarChart accessibilityLayer data={chartData} margin={{ left: 8, right: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {sourceValue.rows.map((row, index) => (
                    <Bar
                      key={row.rowKey}
                      dataKey={row.rowKey}
                      fill={chartColors[index % chartColors.length]}
                      radius={4}
                    />
                  ))}
                </BarChart>
              ) : (
                <LineChart accessibilityLayer data={chartData} margin={{ left: 8, right: 24 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {sourceValue.rows.map((row, index) => (
                    <Line
                      key={row.rowKey}
                      type="monotone"
                      dataKey={row.rowKey}
                      stroke={chartColors[index % chartColors.length]}
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              )}
            </ChartContainer>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Faites défiler horizontalement si le graphique contient beaucoup de colonnes.
      </p>
    </div>
  );
}
