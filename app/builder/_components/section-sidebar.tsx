import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemplateSection } from "@/types/template";

type SectionSidebarProps = {
  sections: TemplateSection[];
  activeSectionKey: string;
  onSelectSection: (sectionKey: string) => void;
};

export function SectionSidebar({
  sections,
  activeSectionKey,
  onSelectSection,
}: SectionSidebarProps) {
  return (
    <aside>
      <Card className="sticky top-6 rounded-2xl">
        <CardHeader>
          <CardTitle>4. Sections du rapport</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choisissez une section, remplissez les champs, puis passez à la
            section suivante.
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          {sections.map((section) => {
            const isActive = section.key === activeSectionKey;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => onSelectSection(section.key)}
                className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card hover:bg-muted/50 hover:border-border/80 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold">
                    {section.order}. {section.title}
                  </span>

                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className="shrink-0"
                  >
                    {section.type}
                  </Badge>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </aside>
  );
}
