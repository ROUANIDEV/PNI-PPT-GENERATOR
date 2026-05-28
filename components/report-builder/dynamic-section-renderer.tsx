"use client";

import type { TemplateSection } from "@/types/template";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPreview } from "./chart-preview";
import { FormSectionRenderer } from "./form-section-renderer";
import { ListSectionRenderer } from "./list-section-renderer";
import { MatrixSectionRenderer } from "./matrix-section-renderer";
import { TableSectionRenderer } from "./table-section-renderer";

type DynamicSectionRendererProps = {
  section: TemplateSection;
  sections: TemplateSection[];
  value: unknown;
  allValues: Record<string, unknown>;
  onChange: (nextValue: unknown) => void;
};

export function DynamicSectionRenderer({
  section,
  sections,
  value,
  allValues,
  onChange,
}: DynamicSectionRendererProps) {
  return (
    <Card className="min-w-0 overflow-hidden rounded-3xl border-border/70 bg-card shadow-sm">
      <CardHeader className="border-b bg-muted/20 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-xl sm:text-2xl">{section.title}</CardTitle>
            {section.description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {section.description}
              </p>
            ) : null}
          </div>
          <Badge variant="outline" className="w-fit rounded-xl">
            Étape {section.order}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 p-4 sm:p-6">
        {section.type === "form" ? <FormSectionRenderer section={section} value={value} onChange={onChange} /> : null}
        {section.type === "table" ? <TableSectionRenderer section={section} value={value} onChange={onChange} /> : null}
        {section.type === "matrix" ? <MatrixSectionRenderer section={section} value={value} onChange={onChange} /> : null}
        {section.type === "list" ? <ListSectionRenderer section={section} value={value} onChange={onChange} /> : null}
        {section.type === "chart" ? <ChartPreview section={section} sections={sections} allValues={allValues} /> : null}
      </CardContent>
    </Card>
  );
}
