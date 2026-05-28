"use client";

import type { MatrixSection } from "@/types/template";
import type { MatrixValue } from "./report-value-types";
import { MatrixInput } from "./matrix-input";

type MatrixDesktopProps = {
  section: MatrixSection;
  value: MatrixValue;
  onCellChange: (rowIndex: number, columnKey: string, value: number) => void;
};

export function MatrixDesktop({ section, value, onCellChange }: MatrixDesktopProps) {
  const tableWidth = 220 + section.columns.length * 150;

  return (
    <div className="hidden rounded-2xl border bg-card shadow-sm md:block">
      <div className="overflow-x-scroll overflow-y-auto pb-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-muted/40">
        <table
          className="border-separate border-spacing-0 text-sm"
          style={{ minWidth: tableWidth }}
        >
          <thead className="sticky top-0 z-10 bg-muted">
            <tr>
              <th className="sticky left-0 z-20 w-56 bg-muted p-3 text-left font-semibold shadow-[1px_0_0_hsl(var(--border))]">
                Ligne
              </th>
              {section.columns.map((column) => (
                <th key={column.key} className="w-36 p-3 text-left font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, rowIndex) => (
              <tr key={row.rowKey}>
                <td className="sticky left-0 bg-card p-3 font-medium shadow-[1px_0_0_hsl(var(--border))]">
                  {row.rowLabel}
                </td>
                {section.columns.map((column) => (
                  <td key={column.key} className="p-3 align-top">
                    <MatrixInput
                      column={column}
                      value={row.values[column.key]}
                      onChange={(next) => onCellChange(rowIndex, column.key, next)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
        Barre de défilement horizontale disponible si la matrice dépasse la largeur.
      </p>
    </div>
  );
}
