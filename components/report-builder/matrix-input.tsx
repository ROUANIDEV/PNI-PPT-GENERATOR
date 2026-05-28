"use client";

import type { TemplateRow } from "@/types/template";
import { Input } from "@/components/ui/input";
import { isRateField, toNumber } from "./report-value-types";

type MatrixInputProps = {
  column: TemplateRow;
  value: number | undefined;
  onChange: (value: number) => void;
};

export function MatrixInput({ column, value, onChange }: MatrixInputProps) {
  const showPercent = isRateField(column);
  const input = (
    <Input
      type="number"
      min={0}
      value={value ?? 0}
      aria-label={showPercent ? `${column.label} en pourcentage` : column.label}
      onChange={(event) => onChange(Math.max(0, toNumber(event.target.value)))}
      className={showPercent ? "pr-10" : ""}
    />
  );

  if (!showPercent) return input;

  return (
    <div className="relative">
      {input}
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-muted-foreground">
        %
      </span>
    </div>
  );
}
