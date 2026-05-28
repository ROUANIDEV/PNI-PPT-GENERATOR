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
    <Card className="relative rounded-2xl sm:rounded-3xl border-border/70 bg-card shadow-sm">
      <CardHeader className="gap-2 sm:gap-3 border-b bg-muted/20 p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border bg-background shadow-sm">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-xs sm:text-sm md:text-base truncate">
                4. Report Sections
              </CardTitle>
              <p className="mt-0.5 truncate text-[11px] sm:text-xs text-muted-foreground">
                {activeSection
                  ? `Step ${activeIndex + 1}/${sections.length} · ${activeSection.title}`
                  : "Select a section"}
              </p>
            </div>
          </div>
          <Badge className="w-fit shrink-0 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs">
            {Math.round(progress)}%
          </Badge>
        </div>
        <div className="h-1 sm:h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-muted/40">
          <div className="flex min-w-max gap-1.5 p-2 sm:gap-2 sm:p-3">
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
