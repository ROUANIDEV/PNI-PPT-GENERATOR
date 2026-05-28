"use client";

import type { MatrixSection } from "@/types/template";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { MatrixValue } from "./report-value-types";
import { MatrixInput } from "./matrix-input";

type MatrixMobileProps = {
  section: MatrixSection;
  value: MatrixValue;
  onCellChange: (rowIndex: number, columnKey: string, value: number) => void;
};

export function MatrixMobile({ section, value, onCellChange }: MatrixMobileProps) {
  return (
    <div className="space-y-4 md:hidden">
      <div className="rounded-2xl border bg-muted/20 p-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Mode mobile matrice</p>
        <p className="mt-1">
          Chaque carte représente une ligne. Remplissez les valeurs colonne par colonne.
        </p>
      </div>

      {value.rows.map((row, rowIndex) => (
        <section key={row.rowKey} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <header className="border-b bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ligne {rowIndex + 1}
                </p>
                <h3 className="truncate text-base font-semibold text-foreground">{row.rowLabel}</h3>
              </div>
              <Badge variant="outline" className="shrink-0">{section.columns.length} valeurs</Badge>
            </div>
          </header>

          <div className="divide-y">
            {section.columns.map((column, columnIndex) => (
              <div key={column.key} className="grid gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <Label className="text-sm font-semibold text-foreground">
                    {column.label}
                  </Label>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    Col. {columnIndex + 1}
                  </span>
                </div>
                <MatrixInput
                  column={column}
                  value={row.values[column.key]}
                  onChange={(next) => onCellChange(rowIndex, column.key, next)}
                />
                <p className="text-xs text-muted-foreground">
                  {row.rowLabel} → {column.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
