"use client";

import type { FormSection } from "@/types/template";
import { Label } from "@/components/ui/label";
import { SectionInput } from "./section-input";
import type { FormValue, PrimitiveValue } from "./report-value-types";

type FormSectionRendererProps = {
  section: FormSection;
  value: unknown;
  onChange: (nextValue: unknown) => void;
};

export function FormSectionRenderer({
  section,
  value,
  onChange,
}: FormSectionRendererProps) {
  const formValue = value as FormValue;

  function updateField(fieldKey: string, nextValue: PrimitiveValue) {
    onChange({
      ...formValue,
      [fieldKey]: nextValue,
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {section.fields.map((field) => (
        <div
          key={field.key}
          className={field.inputType === "textarea" ? "space-y-2 sm:col-span-2" : "space-y-2"}
        >
          <Label htmlFor={field.key}>
            {field.label} {field.required ? <span className="text-destructive">*</span> : null}
          </Label>
          <SectionInput
            field={field}
            value={formValue[field.key]}
            onChange={(nextValue) => updateField(field.key, nextValue)}
          />
        </div>
      ))}
    </div>
  );
}
