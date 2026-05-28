"use client";

import { ChevronLeft, ChevronRight, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemplateSection } from "@/types/template";
import { CollapsedSectionButton, SectionButton } from "./section-sidebar-item";

type SectionSidebarProps = {
  sections: TemplateSection[];
  activeSectionKey: string;
  collapsed: boolean;
  mobile?: boolean;
  onToggle: () => void;
  onSelectSection: (sectionKey: string) => void;
};

export function SectionSidebar({
  sections,
  activeSectionKey,
  collapsed,
  mobile = false,
  onToggle,
  onSelectSection,
}: SectionSidebarProps) {
  const currentKey = activeSectionKey || sections[0]?.key || "";
  const active = sections.find((section) => section.key === currentKey);

  if (collapsed && !mobile) {
    return (
      <Card className="sticky top-4 overflow-hidden rounded-3xl border-border/70 bg-card shadow-sm">
        <CardContent className="flex flex-col items-center gap-2 p-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            title="Ouvrir les sections"
            className="size-12 rounded-2xl"
            onClick={onToggle}
          >
            <ChevronRight className="size-4" />
          </Button>
          {active ? <ActiveMiniCard order={active.order} /> : null}
          <div className="my-1 h-px w-10 bg-border" />
          {sections.map((section) => (
            <CollapsedSectionButton
              key={section.key}
              section={section}
              active={section.key === currentKey}
              onClick={() => onSelectSection(section.key)}
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${mobile ? "" : "sticky top-4"} overflow-hidden rounded-3xl border-border/70 bg-card shadow-sm`}>
      <CardHeader className="space-y-3 border-b bg-muted/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border bg-background">
              <ListChecks className="size-4" />
            </span>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">4. Sections du rapport</CardTitle>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                Actuelle: {active ? `${active.order}. ${active.title}` : "Non sélectionnée"}
              </p>
            </div>
          </div>
          <Button type="button" size="icon" variant="ghost" title={mobile ? "Fermer" : "Réduire"} className="shrink-0 rounded-xl" onClick={onToggle}>
            <ChevronLeft className="size-4" />
          </Button>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          La section active est marquée en couleur. Cliquez sur une étape pour la modifier.
        </p>
      </CardHeader>
      <CardContent className="max-h-[min(72vh,760px)] space-y-2 overflow-y-auto p-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-muted/40">
        {sections.map((section) => (
          <SectionButton
            key={section.key}
            section={section}
            active={section.key === currentKey}
            onClick={() => onSelectSection(section.key)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ActiveMiniCard({ order }: { order: TemplateSection["order"] }) {
  return (
    <div className="w-full rounded-2xl border border-primary/40 bg-primary/10 px-1 py-2 text-center">
      <p className="text-[10px] font-semibold uppercase text-primary">Étape</p>
      <p className="text-lg font-black text-primary">{order}</p>
    </div>
  );
}
