"use client";

import { Separator } from "@/components/ui/separator";

import { AutoGenerationCard } from "./auto-generation-card";
import { BuilderHeader } from "./builder-header";
import { BuilderRouteBanner } from "./builder-route-banner";
import { ExcelImportCard } from "./excel-import-card";
import { PowerPointGenerationCard } from "./powerpoint-generation-card";
import { ReportJsonDetails } from "./report-json-details";
import { SectionEditor } from "./section-editor";
import { SectionNavigation } from "./section-navigation";
import { SectionSidebar } from "./section-sidebar";
import { TemplateUploadCard } from "./template-upload-card";
import { useBuilderPage } from "../_hooks/use-builder-page";

export function BuilderPageView() {
  const builder = useBuilderPage();

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-6 py-6">
        <BuilderHeader />
        <BuilderRouteBanner />

        <TemplateUploadCard
          templateFile={builder.templateFile}
          uploadError={builder.uploadError}
          onUpload={builder.handleTemplateUpload}
        />

        <ExcelImportCard
          isImportingExcel={builder.isImportingExcel}
          excelImportMessage={builder.excelImportMessage}
          excelImportError={builder.excelImportError}
          excelImportWarnings={builder.excelImportWarnings}
          onUpload={builder.handleExcelUpload}
          onDownloadTemplate={builder.handleDownloadExcelTemplate}
        />

        <AutoGenerationCard
          suggestionMessage={builder.suggestionMessage}
          aiGenerationError={builder.aiGenerationError}
          isGeneratingWithAi={builder.isGeneratingWithAi}
          onGenerateLocal={builder.generateProblemsAndActivities}
          onGenerateWithGemini={builder.generateProblemsAndActivitiesWithGemini}
        />

        <div className="grid flex-1 gap-6 lg:grid-cols-[320px_1fr]">
          <SectionSidebar
            sections={builder.sections}
            activeSectionKey={builder.activeSection?.key ?? ""}
            onSelectSection={builder.setActiveSectionKey}
          />

          <section className="space-y-6">
            <SectionEditor
              section={builder.activeSection}
              sections={builder.sections}
              report={builder.report}
              onChange={builder.updateSectionValue}
            />

            <SectionNavigation
              activeSectionIndex={builder.activeSectionIndex}
              sectionsCount={builder.sections.length}
              onPrevious={builder.goToPreviousSection}
              onNext={builder.goToNextSection}
            />

            <PowerPointGenerationCard
              templateFile={builder.templateFile}
              generationError={builder.generationError}
              isGeneratingPptx={builder.isGeneratingPptx}
              onGenerate={builder.handleGeneratePowerPoint}
            />

            <Separator />

            <ReportJsonDetails report={builder.report} />
          </section>
        </div>
      </div>
    </main>
  );
}