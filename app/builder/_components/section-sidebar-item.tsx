"use client";

import { Badge } from "@/components/ui/badge";
import type { TemplateSection } from "@/types/template";

type ItemProps = {
  section: TemplateSection;
  active: boolean;
  onClick: () => void;
};

export function CollapsedSectionButton({ section, active, onClick }: ItemProps) {
  return (
    <button
      type="button"
      title={`${section.order}. ${section.title}${active ? " - étape active" : ""}`}
      aria-current={active ? "step" : undefined}
      onClick={onClick}
      className={`relative flex size-12 items-center justify-center rounded-2xl border text-sm font-black transition ${
        active
          ? "scale-[1.03] border-primary bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/25"
          : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted/70"
      }`}
    >
      {section.order}
      {active ? (
        <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-card bg-primary" />
      ) : null}
    </button>
  );
}

export function SectionButton({ section, active, onClick }: ItemProps) {
  return (
    <button
      type="button"
      aria-current={active ? "step" : undefined}
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-2xl border p-3 text-left transition ${
        active
          ? "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/25"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/60"
      }`}
    >
      {active ? <span className="absolute inset-y-0 left-0 w-1.5 bg-primary" /> : null}
      <div className="flex items-start justify-between gap-3 pl-2">
        <p className="min-w-0 truncate text-sm font-bold">
          {section.order}. {section.title}
        </p>
        <Badge variant={active ? "default" : "outline"} className="shrink-0 capitalize">
          {active ? "En cours" : section.type}
        </Badge>
      </div>
      {section.description ? (
        <p className={`mt-1 line-clamp-2 pl-2 text-xs ${active ? "text-primary/80" : "text-muted-foreground"}`}>
          {section.description}
        </p>
      ) : null}
    </button>
  );
}
