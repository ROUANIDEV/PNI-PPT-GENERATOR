"use client";

import type { TableSection, TemplateColumn } from "@/types/template";
import type { PrimitiveValue, TableValue } from "./report-value-types";
import { formatRate } from "./report-value-types";
import { TableDesktop } from "./table-desktop";
import { TableMobile } from "./table-mobile";

type TableSectionRendererProps = {
  section: TableSection;
  value: unknown;
  onChange: (nextValue: unknown) => void;
};

export function TableSectionRenderer({
  section,
  value,
  onChange,
}: TableSectionRendererProps) {
  const tableValue = value as TableValue;

  function updateCell(rowIndex: number, column: TemplateColumn, nextValue: PrimitiveValue) {
    const nextRows = tableValue.rows.map((row, index) => {
      if (index !== rowIndex) return row;
      const nextCellValues = { ...row.values, [column.key]: nextValue };
      if (section.autoCalculateRate) {
        const objectif = Number(nextCellValues.objectif ?? 0);
        const realisation = Number(nextCellValues.realisation ?? 0);
        nextCellValues.taux = formatRate(objectif, realisation);
      }
      return { ...row, values: nextCellValues };
    });
    onChange({ ...tableValue, rows: nextRows });
  }

  return (
    <div className="space-y-4">
      <TableDesktop
        section={section}
        tableValue={tableValue}
        onCellChange={updateCell}
      />
      <TableMobile
        section={section}
        tableValue={tableValue}
        onCellChange={updateCell}
      />
      {section.autoCalculateRate ? (
        <p className="rounded-2xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Le taux est calculé automatiquement : réalisation / objectif × 100.
        </p>
      ) : null}
    </div>
  );
}
