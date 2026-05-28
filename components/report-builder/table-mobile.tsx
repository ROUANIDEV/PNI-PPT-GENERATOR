"use client";

import type { TableSection, TemplateColumn } from "@/types/template";
import { Label } from "@/components/ui/label";
import { SectionInput } from "./section-input";
import type { PrimitiveValue, TableValue } from "./report-value-types";

type TableMobileProps = {
  section: TableSection;
  tableValue: TableValue;
  onCellChange: (rowIndex: number, column: TemplateColumn, value: PrimitiveValue) => void;
};

export function TableMobile({ section, tableValue, onCellChange }: TableMobileProps) {
  return (
    <div className="grid gap-3 md:hidden">
      {tableValue.rows.map((row, rowIndex) => (
        <div key={row.rowKey} className="rounded-2xl border bg-card p-4 shadow-sm">
          <h3 className="font-semibold">{row.rowLabel}</h3>
          <div className="mt-4 grid gap-3">
            {section.columns.map((column) => (
              <div key={column.key} className="space-y-2">
                <Label>{column.label}</Label>
                <SectionInput
                  field={column}
                  value={row.values[column.key]}
                  onChange={(nextValue) => onCellChange(rowIndex, column, nextValue)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
