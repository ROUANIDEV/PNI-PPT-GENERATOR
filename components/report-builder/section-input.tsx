"use client";

import { Input } from "@/components/ui/input";
import type { InputField, PrimitiveValue } from "./report-value-types";
import { getInputValue, isRateField, toNumber } from "./report-value-types";

type SectionInputProps = {
  field: InputField;
  value: PrimitiveValue | undefined;
  onChange: (value: PrimitiveValue) => void;
};

export function SectionInput({ field, value, onChange }: SectionInputProps) {
  const isNumber = field.inputType === "number";
  const showPercent = isNumber && isRateField(field);
  const sharedClass = field.readonly
    ? "cursor-not-allowed bg-muted/50 font-semibold dark:bg-muted/40"
    : "";

  if (field.inputType === "textarea") {
    return (
      <textarea
        value={getInputValue(value)}
        readOnly={field.readonly}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring ${sharedClass}`}
      />
    );
  }

  const input = (
    <Input
      type={isNumber ? "number" : field.inputType === "date" ? "date" : "text"}
      min={isNumber ? 0 : undefined}
      value={getInputValue(value)}
      readOnly={field.readonly}
      aria-label={showPercent ? `${field.label} en pourcentage` : field.label}
      onChange={(event) => {
        const nextValue = isNumber
          ? Math.max(0, toNumber(event.target.value))
          : event.target.value;
        onChange(nextValue);
      }}
      className={`${sharedClass} ${showPercent ? "pr-10" : ""}`}
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
