"use client";

import { Separator } from "@/components/ui/separator";
import { AutoGenerationCard } from "./auto-generation-card";
import { BuilderHeader } from "./builder-header";
import { BuilderRouteBanner } from "./builder-route-banner";
import { ExcelImportCard } from "./excel-import-card";
import { ReportJsonDetails } from "./report-json-details";
import { ReportStepper } from "./report-stepper";
import { SectionEditor } from "./section-editor";
import { SectionNavigation } from "./section-navigation";
import { TemplateUploadCard } from "./template-upload-card";
import { useBuilderPage } from "../_hooks/use-builder-page";

export function BuilderPageView() {
  const builder = useBuilderPage();
  const activeSectionKey = builder.activeSection?.key ?? builder.sections[0]?.key ?? "";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <BuilderHeader />
        <BuilderRouteBanner />

        <section className="grid gap-4 xl:grid-cols-3">
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
        </section>

        <Separator />

        <ReportStepper
          sections={builder.sections}
          activeSectionKey={activeSectionKey}
          onSelectSection={builder.setActiveSectionKey}
        />

        <section className="mx-auto grid w-full max-w-6xl gap-4">
          <SectionEditor
            section={builder.activeSection}
            sections={builder.sections}
            report={builder.report}
            templateFile={builder.templateFile}
            generationError={builder.generationError}
            isGeneratingPptx={builder.isGeneratingPptx}
            onGeneratePPT={builder.handleGeneratePowerPoint}
            onChange={builder.updateSectionValue}
          />
          <SectionNavigation
            activeSectionIndex={builder.activeSectionIndex}
            sectionsCount={builder.sections.length}
            onPrevious={builder.goToPreviousSection}
            onNext={builder.goToNextSection}
          />
          <ReportJsonDetails report={builder.report} />
        </section>
      </div>
    </main>
  );
}
