"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ListSection } from "@/types/template";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ListValue } from "./report-value-types";

type ListSectionRendererProps = {
  section: ListSection;
  value: unknown;
  onChange: (nextValue: unknown) => void;
};

export function ListSectionRenderer({
  section,
  value,
  onChange,
}: ListSectionRendererProps) {
  const listValue = value as ListValue;

  function updateItem(index: number, nextText: string) {
    const nextItems = listValue.items.map((item, itemIndex) =>
      itemIndex === index ? nextText : item,
    );
    onChange({ items: nextItems });
  }

  function addItem() {
    onChange({ items: [...listValue.items, ""] });
  }

  function removeItem(index: number) {
    const nextItems = listValue.items.filter((_, itemIndex) => itemIndex !== index);
    onChange({ items: nextItems.length > 0 ? nextItems : [""] });
  }

  return (
    <div className="space-y-4">
      {section.aiGenerated ? (
        <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary">
          Cette section pourra être générée par IA. Vous pouvez toujours la
          modifier manuellement.
        </p>
      ) : null}
      <div className="grid gap-3">
        {listValue.items.map((item, index) => (
          <div key={`${section.key}-${index}`} className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3">
              <Label>
                {section.itemLabel} {index + 1}
              </Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-xl text-destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="mr-2 size-4" /> Supprimer
              </Button>
            </div>
            <textarea
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              className="min-h-28 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder={`Saisir ${section.itemLabel.toLowerCase()}...`}
            />
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" className="rounded-2xl" onClick={addItem}>
        <Plus className="mr-2 size-4" /> Ajouter
      </Button>
    </div>
  );
}
