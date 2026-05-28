import { DynamicSectionRenderer } from "@/components/report-builder/dynamic-section-renderer";
import { PowerPointGenerationCard } from "./powerpoint-generation-card";
import type { ReportData, TemplateSection } from "@/types/template";

type SectionEditorProps = {
  section: TemplateSection | undefined;
  sections: TemplateSection[];
  report: ReportData;
  templateFile: File | null;
  generationError: string;
  isGeneratingPptx: boolean;
  onGeneratePPT: () => void;
  onChange: (sectionKey: string, nextValue: unknown) => void;
};

export function SectionEditor({
  section,
  sections,
  report,
  templateFile,
  generationError,
  isGeneratingPptx,
  onGeneratePPT,
  onChange,
}: SectionEditorProps) {
  if (!section) return null;

  const sectionIndex = sections.findIndex((item) => item.key === section.key);
  const isFinalSection = sectionIndex === sections.length - 1;

  return (
    <div className="min-w-0 space-y-4">
      <DynamicSectionRenderer
        section={section}
        sections={sections}
        value={report.values[section.key]}
        allValues={report.values}
        onChange={(nextValue) => onChange(section.key, nextValue)}
      />
      {isFinalSection ? (
        <PowerPointGenerationCard
          templateFile={templateFile}
          generationError={generationError}
          isGeneratingPptx={isGeneratingPptx}
          onGenerate={onGeneratePPT}
        />
      ) : null}
    </div>
  );
}
