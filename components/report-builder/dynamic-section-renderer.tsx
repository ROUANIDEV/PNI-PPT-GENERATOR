"use client";

import type {
  FormSection,
  ListSection,
  MatrixSection,
  TableSection,
  TemplateColumn,
  TemplateField,
  TemplateSection,
} from "@/types/template";

import { ChartPreview } from "@/components/report-builder/chart-preview";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PrimitiveValue = string | number;

type FormValue = Record<string, PrimitiveValue>;

type TableValue = {
  rows: {
    rowKey: string;
    rowLabel: string;
    values: Record<string, PrimitiveValue>;
  }[];
};

type MatrixValue = {
  rows: {
    rowKey: string;
    rowLabel: string;
    values: Record<string, number>;
  }[];
};

type ListValue = {
  items: string[];
};

type Props = {
  section: TemplateSection;
  sections: TemplateSection[];
  value: unknown;
  allValues: Record<string, unknown>;
  onChange: (nextValue: unknown) => void;
};

function toNumber(value: string) {
  if (value.trim() === "") return 0;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

function formatRate(objectif: number, realisation: number) {
  if (!objectif || objectif <= 0) {
    return 0;
  }

  const rate = (realisation / objectif) * 100;

  return Math.round(rate);
}

function getInputValue(value: PrimitiveValue | undefined) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

function DynamicInput({
  field,
  value,
  onChange,
}: {
  field: TemplateField | TemplateColumn;
  value: PrimitiveValue | undefined;
  onChange: (value: PrimitiveValue) => void;
}) {
  const isNumber = field.inputType === "number";

  return (
    <Input
      type={field.inputType === "date" ? "date" : isNumber ? "number" : "text"}
      value={getInputValue(value)}
      disabled={field.readonly}
      onChange={(event) => {
        const nextValue = isNumber
          ? toNumber(event.target.value)
          : event.target.value;

        onChange(nextValue);
      }}
      className={field.readonly ? "bg-muted/50 font-semibold cursor-not-allowed dark:bg-muted/40" : ""}
    />
  );
}

function FormSectionRenderer({
  section,
  value,
  onChange,
}: {
  section: FormSection;
  value: unknown;
  onChange: (nextValue: unknown) => void;
}) {
  const formValue = value as FormValue;

  function updateField(fieldKey: string, nextValue: PrimitiveValue) {
    onChange({
      ...formValue,
      [fieldKey]: nextValue,
    });
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {section.fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label>
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </Label>

          <DynamicInput
            field={field}
            value={formValue[field.key]}
            onChange={(nextValue) => updateField(field.key, nextValue)}
          />
        </div>
      ))}
    </div>
  );
}

function TableSectionRenderer({
  section,
  value,
  onChange,
}: {
  section: TableSection;
  value: unknown;
  onChange: (nextValue: unknown) => void;
}) {
  const tableValue = value as TableValue;

  function updateCell(
    rowIndex: number,
    column: TemplateColumn,
    nextValue: PrimitiveValue
  ) {
    const nextRows = tableValue.rows.map((row, index) => {
      if (index !== rowIndex) {
        return row;
      }

      const nextCellValues = {
        ...row.values,
        [column.key]: nextValue,
      };

      if (section.autoCalculateRate) {
        const objectif = Number(nextCellValues.objectif ?? 0);
        const realisation = Number(nextCellValues.realisation ?? 0);

        nextCellValues.taux = formatRate(objectif, realisation);
      }

      return {
        ...row,
        values: nextCellValues,
      };
    });

    onChange({
      ...tableValue,
      rows: nextRows,
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="bg-muted/60 dark:bg-muted/40">
            <th className="border border-border p-3 text-left font-bold text-foreground">
              {section.rowHeader}
            </th>

            {section.columns.map((column) => (
              <th key={column.key} className="border border-border p-3 text-left font-bold text-foreground">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableValue.rows.map((row, rowIndex) => (
            <tr key={row.rowKey} className="hover:bg-muted/30 transition-colors">
              <td className="border border-border bg-card p-3 font-semibold text-foreground">
                {row.rowLabel}
              </td>

              {section.columns.map((column) => (
                <td key={column.key} className="border border-border bg-card p-2 hover:bg-muted/40 transition-colors">
                  <DynamicInput
                    field={column}
                    value={row.values[column.key]}
                    onChange={(nextValue) =>
                      updateCell(rowIndex, column, nextValue)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {section.autoCalculateRate ? (
        <div className="border-t border-border bg-muted/40 p-3 text-sm text-muted-foreground dark:bg-muted/30">
          Le taux est calculé automatiquement : réalisation / objectif × 100.
        </div>
      ) : null}
    </div>
  );
}

function MatrixSectionRenderer({
  section,
  value,
  onChange,
}: {
  section: MatrixSection;
  value: unknown;
  onChange: (nextValue: unknown) => void;
}) {
  const matrixValue = value as MatrixValue;

  function updateCell(rowIndex: number, columnKey: string, nextValue: number) {
    const nextRows = matrixValue.rows.map((row, index) => {
      if (index !== rowIndex) {
        return row;
      }

      return {
        ...row,
        values: {
          ...row.values,
          [columnKey]: nextValue,
        },
      };
    });

    onChange({
      ...matrixValue,
      rows: nextRows,
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
      <table className="w-full min-w-[1000px] border-collapse text-sm">
        <thead>
          <tr className="bg-muted/60 dark:bg-muted/40">
            <th className="border border-border p-3 text-left font-bold text-foreground">Ligne</th>

            {section.columns.map((column) => (
              <th key={column.key} className="border border-border p-3 text-center font-bold text-foreground">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {matrixValue.rows.map((row, rowIndex) => (
            <tr key={row.rowKey} className="hover:bg-muted/30 transition-colors">
              <td className="border border-border bg-card p-3 font-semibold text-foreground">
                {row.rowLabel}
              </td>

              {section.columns.map((column) => (
                <td key={column.key} className="border border-border bg-card p-2 hover:bg-muted/40 transition-colors">
                  <Input
                    type="number"
                    value={String(row.values[column.key] ?? 0)}
                    onChange={(event) =>
                      updateCell(
                        rowIndex,
                        column.key,
                        toNumber(event.target.value)
                      )
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListSectionRenderer({
  section,
  value,
  onChange,
}: {
  section: ListSection;
  value: unknown;
  onChange: (nextValue: unknown) => void;
}) {
  const listValue = value as ListValue;

  function updateItem(index: number, nextText: string) {
    const nextItems = listValue.items.map((item, itemIndex) => {
      if (itemIndex !== index) {
        return item;
      }

      return nextText;
    });

    onChange({
      items: nextItems,
    });
  }

  function addItem() {
    onChange({
      items: [...listValue.items, ""],
    });
  }

  function removeItem(index: number) {
    const nextItems = listValue.items.filter((_, itemIndex) => {
      return itemIndex !== index;
    });

    onChange({
      items: nextItems.length > 0 ? nextItems : [""],
    });
  }

  return (
    <div className="space-y-4">
      {section.aiGenerated ? (
        <div className="rounded-2xl border bg-blue-50 p-4 text-sm text-blue-900">
          Cette section pourra être générée par IA plus tard. L’utilisateur peut
          toujours modifier le texte manuellement.
        </div>
      ) : null}

      {listValue.items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-2xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <Label>
              {section.itemLabel} {index + 1}
            </Label>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
            >
              Supprimer
            </Button>
          </div>

          <textarea
            value={item}
            onChange={(event) => updateItem(index, event.target.value)}
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder={`Saisir ${section.itemLabel.toLowerCase()}...`}
          />
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addItem}>
        Ajouter
      </Button>
    </div>
  );
}

export function DynamicSectionRenderer({
  section,
  sections,
  value,
  allValues,
  onChange,
}: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{section.title}</CardTitle>

            {section.description ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {section.description}
              </p>
            ) : null}
          </div>

          <Badge variant="secondary">Étape {section.order}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {section.type === "form" ? (
          <FormSectionRenderer
            section={section}
            value={value}
            onChange={onChange}
          />
        ) : null}

        {section.type === "table" ? (
          <TableSectionRenderer
            section={section}
            value={value}
            onChange={onChange}
          />
        ) : null}

        {section.type === "matrix" ? (
          <MatrixSectionRenderer
            section={section}
            value={value}
            onChange={onChange}
          />
        ) : null}

        {section.type === "list" ? (
          <ListSectionRenderer
            section={section}
            value={value}
            onChange={onChange}
          />
        ) : null}

        {section.type === "chart" ? (
          <ChartPreview
            section={section}
            sections={sections}
            allValues={allValues}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
