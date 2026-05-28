"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemplateSection } from "@/types/template";
import { ReportStepperItem } from "./report-stepper-item";

type ReportStepperProps = {
  sections: TemplateSection[];
  activeSectionKey: string;
  onSelectSection: (sectionKey: string) => void;
};

export function ReportStepper({
  sections,
  activeSectionKey,
  onSelectSection,
}: ReportStepperProps) {
  const foundIndex = sections.findIndex((section) => section.key === activeSectionKey);
  const activeIndex = foundIndex >= 0 ? foundIndex : 0;
  const activeSection = sections[activeIndex];
  const progress = sections.length ? ((activeIndex + 1) / sections.length) * 100 : 0;

  return (
    <Card className="relative rounded-3xl border-border/70 bg-card shadow-sm">
      <CardHeader className="gap-3 border-b bg-muted/20 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border bg-background shadow-sm sm:size-11">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base">
                4. Sections du rapport
              </CardTitle>
              <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                {activeSection
                  ? `Étape ${activeIndex + 1}/${sections.length} · ${activeSection.title}`
                  : "Sélectionnez une étape"}
              </p>
            </div>
          </div>
          <Badge className="w-fit shrink-0 rounded-full px-2.5 py-1 text-xs sm:px-3">
            {Math.round(progress)}%
          </Badge>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted sm:h-2">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-muted/40">
          <div className="flex min-w-max gap-2 p-2 sm:gap-3 sm:p-3">
            {sections.map((section, index) => (
              <ReportStepperItem
                key={section.key}
                section={section}
                index={index}
                active={section.key === activeSectionKey}
                completed={index < activeIndex}
                onClick={() => onSelectSection(section.key)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
