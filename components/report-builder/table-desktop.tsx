"use client";

import type { TableSection, TemplateColumn } from "@/types/template";
import { SectionInput } from "./section-input";
import type { PrimitiveValue, TableValue } from "./report-value-types";

type TableDesktopProps = {
  section: TableSection;
  tableValue: TableValue;
  onCellChange: (rowIndex: number, column: TemplateColumn, value: PrimitiveValue) => void;
};

export function TableDesktop({ section, tableValue, onCellChange }: TableDesktopProps) {
  const tableWidth = 220 + section.columns.length * 180;

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
                {section.rowHeader}
              </th>
              {section.columns.map((column) => (
                <th key={column.key} className="w-44 p-3 text-left font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableValue.rows.map((row, rowIndex) => (
              <tr key={row.rowKey} className="border-t">
                <td className="sticky left-0 bg-card p-3 font-medium shadow-[1px_0_0_hsl(var(--border))]">
                  {row.rowLabel}
                </td>
                {section.columns.map((column) => (
                  <td key={column.key} className="p-3 align-top">
                    <SectionInput
                      field={column}
                      value={row.values[column.key]}
                      onChange={(nextValue) => onCellChange(rowIndex, column, nextValue)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
        Barre de défilement horizontale disponible si le tableau dépasse la largeur.
      </p>
    </div>
  );
}
