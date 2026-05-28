"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ChartSection,
  MatrixSection,
  TemplateSection,
} from "@/types/template";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type MatrixValue = {
  rows: {
    rowKey: string;
    rowLabel: string;
    values: Record<string, number>;
  }[];
};

type Props = {
  section: ChartSection;
  sections: TemplateSection[];
  allValues: Record<string, unknown>;
};

function isMatrixValue(value: unknown): value is MatrixValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Array.isArray((value as MatrixValue).rows);
}

function getSourceSection(
  chartSection: ChartSection,
  sections: TemplateSection[]
): MatrixSection | null {
  const sourceSection = sections.find((item) => {
    return item.key === chartSection.sourceSectionKey;
  });

  if (!sourceSection || sourceSection.type !== "matrix") {
    return null;
  }

  return sourceSection;
}

const chartColors = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
];

function buildChartConfig(sourceValue: MatrixValue): ChartConfig {
  const config: ChartConfig = {};

  sourceValue.rows.forEach((row, index) => {
    config[row.rowKey] = {
      label: row.rowLabel,
      color: chartColors[index % chartColors.length],
    };
  });

  return config;
}

function buildChartData(
  sourceSection: MatrixSection,
  sourceValue: MatrixValue
) {
  return sourceSection.columns.map((column) => {
    const item: Record<string, string | number> = {
      category: column.label,
    };

    sourceValue.rows.forEach((row) => {
      item[row.rowKey] = Number(row.values[column.key] ?? 0);
    });

    return item;
  });
}

export function ChartPreview({ section, sections, allValues }: Props) {
  const sourceSection = getSourceSection(section, sections);
  const sourceValue = allValues[section.sourceSectionKey];

  if (!sourceSection || !isMatrixValue(sourceValue)) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
        Impossible de générer le graphique. La section source est introuvable.
      </div>
    );
  }

  const chartData = buildChartData(sourceSection, sourceValue);
  const chartConfig = buildChartConfig(sourceValue);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <ChartContainer config={chartConfig} className="h-[380px] w-full">
          {section.chartType === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                angle={-35}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              {sourceValue.rows.map((row) => (
                <Bar
                  key={row.rowKey}
                  dataKey={row.rowKey}
                  fill={`var(--color-${row.rowKey})`}
                  radius={3}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              {sourceValue.rows.map((row) => (
                <Line
  key={row.rowKey}
  dataKey={row.rowKey}
  type="linear"
  stroke={`var(--color-${row.rowKey})`}
  strokeWidth={3}
  dot={{ r: 4 }}
  activeDot={{ r: 6 }}
  connectNulls
/>
              ))}
            </LineChart>
          )}
        </ChartContainer>
      </div>

      <p className="text-sm text-muted-foreground">
        Prévisualisation shadcn/Recharts : barres groupées pour la couverture,
        courbes pour le suivi mensuel.
      </p>
    </div>
  );
}
