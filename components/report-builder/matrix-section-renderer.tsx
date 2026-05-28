"use client";

import type { MatrixSection } from "@/types/template";
import type { MatrixValue } from "./report-value-types";
import { MatrixDesktop } from "./matrix-desktop";
import { MatrixMobile } from "./matrix-mobile";

type MatrixSectionRendererProps = {
  section: MatrixSection;
  value: unknown;
  onChange: (nextValue: unknown) => void;
};

export function MatrixSectionRenderer({
  section,
  value,
  onChange,
}: MatrixSectionRendererProps) {
  const matrixValue = value as MatrixValue;

  function updateCell(rowIndex: number, columnKey: string, nextValue: number) {
    const nextRows = matrixValue.rows.map((row, index) => {
      if (index !== rowIndex) return row;
      return { ...row, values: { ...row.values, [columnKey]: nextValue } };
    });
    onChange({ ...matrixValue, rows: nextRows });
  }

  return (
    <div className="space-y-4">
      <MatrixDesktop
        section={section}
        value={matrixValue}
        onCellChange={updateCell}
      />
      <MatrixMobile
        section={section}
        value={matrixValue}
        onCellChange={updateCell}
      />
    </div>
  );
}
