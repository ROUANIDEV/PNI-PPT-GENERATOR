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
      className={`h-auto min-w-[140px] justify-start rounded-2xl border p-2 text-left transition sm:min-w-[190px] sm:p-3 ${stateClass}`}
    >
      <span className="flex w-full items-start gap-2 sm:gap-3">
        <StepIcon active={active} completed={completed} order={section.order} />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase opacity-80 sm:text-xs">
            Étape {index + 1}
          </span>
          <span className="mt-0.5 block truncate text-xs font-bold sm:mt-1 sm:text-sm">
            {section.title}
          </span>
          <span className="mt-0.5 hidden text-xs capitalize opacity-75 sm:block">
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
    <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:size-9 ${className}`}>
      {completed ? <Check className="size-4" /> : active ? order : <Circle className="size-4" />}
    </span>
  );
}
