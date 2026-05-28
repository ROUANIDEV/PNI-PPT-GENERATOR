"use client";

import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateSection } from "@/types/template";

type ReportStepperItemProps = {
  section: TemplateSection;
  index: number;
  active: boolean;
  completed: boolean;
  onClick: () => void;
};

export function ReportStepperItem({
  section,
  index,
  active,
  completed,
  onClick,
}: ReportStepperItemProps) {
  const stateClass = active
    ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
    : completed
      ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
      : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted/60";

  return (
    <Button
      type="button"
      variant="ghost"
      aria-current={active ? "step" : undefined}
      onClick={onClick}
      className={`h-auto min-w-[120px] justify-start rounded-xl sm:rounded-2xl border p-1.5 sm:p-2 md:p-3 text-left transition hover:shadow-sm active:scale-95 sm:min-w-[160px] ${stateClass}`}
    >
      <span className="flex w-full items-start gap-1.5 sm:gap-2 md:gap-3">
        <StepIcon active={active} completed={completed} order={section.order} />
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase opacity-75 sm:opacity-80">
            Step {index + 1}
          </span>
          <span className="mt-0.5 block truncate text-[10px] sm:text-xs md:text-sm font-bold">
            {section.title}
          </span>
          <span className="mt-0.5 hidden text-[9px] sm:text-xs capitalize opacity-70 sm:block">
            {section.type}
          </span>
        </span>
      </span>
    </Button>
  );
}

type StepIconProps = {
  active: boolean;
  completed: boolean;
  order: number;
};

function StepIcon({ active, completed, order }: StepIconProps) {
  const className = active
    ? "bg-primary-foreground text-primary"
    : completed
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground";

  return (
    <span className={`flex size-6 sm:size-7 md:size-8 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold ${className}`}>
      {completed ? <Check className="size-3.5 sm:size-4" /> : active ? order : <Circle className="size-3 sm:size-3.5" />}
    </span>
  );
}
