"use client";

import { useMemo, useState } from "react";

import { createExcelTemplate } from "@/lib/excel/create-excel-template";
import { parseReportExcel } from "@/lib/excel/parse-report-excel";
import { validateReportExcel } from "@/lib/excel/validate-report-excel";
import { downloadBlob } from "@/lib/download-file";
import { generatePptx } from "@/lib/pptx/generate-pptx";
import { createEmptyReport } from "@/lib/report/create-empty-report";
import { generateSuggestions } from "@/lib/report/generate-suggestions";
import { pniTemplate } from "@/lib/templates/pni-template";
import type { ReportData } from "@/types/template";

import {
  applyGeneratedPlan,
  applySectionValue,
  type GeneratedPlan,
} from "../_utils/report-updaters";

type GeminiPlanResponse = GeneratedPlan & {
  error?: string;
};

export function useBuilderPage() {
  const sections = useMemo(() => {
    return [...pniTemplate.sections].sort((a, b) => a.order - b.order);
  }, []);

  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [aiGenerationError, setAiGenerationError] = useState("");
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [isGeneratingPptx, setIsGeneratingPptx] = useState(false);
  const [excelImportMessage, setExcelImportMessage] = useState("");
  const [excelImportError, setExcelImportError] = useState("");
  const [isImportingExcel, setIsImportingExcel] = useState(false);
  const [excelImportWarnings, setExcelImportWarnings] = useState<string[]>([]);
  const [activeSectionKey, setActiveSectionKey] = useState(sections[0].key);
  const [report, setReport] = useState<ReportData>(() =>
    createEmptyReport(pniTemplate)
  );

  const activeSection = sections.find((section) => {
    return section.key === activeSectionKey;
  });

  const activeSectionIndex = sections.findIndex((section) => {
    return section.key === activeSectionKey;
  });

  function handleTemplateUpload(file: File | undefined) {
    setUploadError("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pptx")) {
      setTemplateFile(null);
      setUploadError("Veuillez sélectionner un fichier PowerPoint .pptx.");
      return;
    }

    setTemplateFile(file);
  }

  async function handleExcelUpload(file: File | undefined) {
    setExcelImportMessage("");
    setExcelImportError("");
    setExcelImportWarnings([]);

    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      setExcelImportError("Veuillez sélectionner un fichier Excel .xlsx ou .xls.");
      return;
    }

    try {
      setIsImportingExcel(true);

      const warnings = await validateReportExcel({ file, template: pniTemplate });
      setExcelImportWarnings(warnings);

      const importedReport = await parseReportExcel({
        file,
        template: pniTemplate,
        currentReport: report,
      });

      setReport(importedReport);
      setExcelImportMessage(
        "Les données Excel ont été importées. Vous pouvez les vérifier et les modifier."
      );
    } catch (error) {
      console.error(error);
      setExcelImportError(
        "Une erreur est survenue pendant l’importation du fichier Excel."
      );
    } finally {
      setIsImportingExcel(false);
    }
  }

  function handleDownloadExcelTemplate() {
    const blob = createExcelTemplate(pniTemplate);
    downloadBlob(blob, "modele-saisie-pni.xlsx");
  }

  function updateSectionValue(sectionKey: string, nextValue: unknown) {
    setReport((currentReport) => {
      return applySectionValue(currentReport, sectionKey, nextValue);
    });
  }

  function generateProblemsAndActivities() {
    const result = generateSuggestions(report);

    setReport((currentReport) => applyGeneratedPlan(currentReport, result));
    setSuggestionMessage(
      "Les problèmes identifiés et les activités planifiées ont été générés. Vous pouvez les modifier manuellement."
    );
    setActiveSectionKey("problems");
  }

  async function generateProblemsAndActivitiesWithGemini() {
    setSuggestionMessage("");
    setAiGenerationError("");

    try {
      setIsGeneratingWithAi(true);

      const response = await fetch("/api/ai/generate-pni-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: pniTemplate, report }),
      });

      const result = (await response.json()) as GeminiPlanResponse;

      if (!response.ok) {
        throw new Error(result.error ?? "Erreur Gemini");
      }

      setReport((currentReport) => applyGeneratedPlan(currentReport, result));
      setSuggestionMessage(
        "Les problèmes et les activités ont été générés avec Gemini. Vous pouvez les modifier manuellement."
      );
      setActiveSectionKey("problems");
    } catch (error) {
      console.error(error);
      setAiGenerationError(
        "Gemini n’a pas pu générer les problèmes et activités. Utilisez la génération locale ou vérifiez la clé API Gemini."
      );
    } finally {
      setIsGeneratingWithAi(false);
    }
  }

  async function handleGeneratePowerPoint() {
    setGenerationError("");

    if (!templateFile) {
      setGenerationError("Veuillez d’abord charger le modèle PowerPoint.");
      return;
    }

    try {
      setIsGeneratingPptx(true);

      const pptxBlob = await generatePptx({
        templateFile,
        template: pniTemplate,
        report,
      });

      downloadBlob(pptxBlob, "rapport-pni-genere.pptx");
    } catch (error) {
      console.error(error);
      setGenerationError(
        "Une erreur est survenue pendant la génération du PowerPoint."
      );
    } finally {
      setIsGeneratingPptx(false);
    }
  }

  function goToPreviousSection() {
    const previousSection = sections[activeSectionIndex - 1];

    if (previousSection) {
      setActiveSectionKey(previousSection.key);
    }
  }

  function goToNextSection() {
    const nextSection = sections[activeSectionIndex + 1];

    if (nextSection) {
      setActiveSectionKey(nextSection.key);
    }
  }

  return {
    sections,
    activeSection,
    activeSectionIndex,
    report,
    templateFile,
    uploadError,
    suggestionMessage,
    aiGenerationError,
    isGeneratingWithAi,
    generationError,
    isGeneratingPptx,
    excelImportMessage,
    excelImportError,
    excelImportWarnings,
    isImportingExcel,
    setActiveSectionKey,
    handleTemplateUpload,
    handleExcelUpload,
    handleDownloadExcelTemplate,
    updateSectionValue,
    generateProblemsAndActivities,
    generateProblemsAndActivitiesWithGemini,
    handleGeneratePowerPoint,
    goToPreviousSection,
    goToNextSection,
  };
}