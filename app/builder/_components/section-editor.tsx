import { DynamicSectionRenderer } from "@/components/report-builder/dynamic-section-renderer";
import type { ReportData, TemplateSection } from "@/types/template";

type SectionEditorProps = {
  section: TemplateSection | undefined;
  sections: TemplateSection[];
  report: ReportData;
  onChange: (sectionKey: string, nextValue: unknown) => void;
};

export function SectionEditor({
  section,
  sections,
  report,
  onChange,
}: SectionEditorProps) {
  if (!section) return null;

  return (
    <DynamicSectionRenderer
      section={section}
      sections={sections}
      value={report.values[section.key]}
      allValues={report.values}
      onChange={(nextValue) => onChange(section.key, nextValue)}
    />
  );
}