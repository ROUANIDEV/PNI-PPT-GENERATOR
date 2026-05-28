"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { parseReportExcel } from "@/lib/excel/parse-report-excel";
import { validateReportExcel } from "@/lib/excel/validate-report-excel";
import { downloadBlob } from "@/lib/download-file";
import { generatePptx } from "@/lib/pptx/generate-pptx";
import { createEmptyReport } from "@/lib/report/create-empty-report";
import { generateSuggestions } from "@/lib/report/generate-suggestions";
import { pniTemplate } from "@/lib/templates/pni-template";
import { applyGeneratedPlan, applySectionValue, type GeneratedPlan } from "../_utils/report-updaters";
import { createInitialBuilderState, getBuilderServerSnapshot, getBuilderSnapshot, normalizeBuilderState, saveBuilderState, subscribeBuilderState, type StoredBuilderState } from "../_utils/builder-storage";

const EXCEL_TEMPLATE_URL = "/templates/modele-saisie-pni.xlsx";
const IMPORT_OK = "Les données Excel ont été importées. Vous pouvez les vérifier et les modifier.";
const LOCAL_OK = "Les problèmes identifiés et les activités planifiées ont été générés. Vous pouvez les modifier manuellement.";
const GEMINI_OK = "Les problèmes et les activités ont été générés avec Gemini. Vous pouvez les modifier manuellement.";
const GEMINI_ERROR = "Gemini n’a pas pu générer les problèmes et activités. Utilisez la génération locale ou vérifiez la clé API Gemini.";
type GeminiPlanResponse = GeneratedPlan & { error?: string };

export function useBuilderPage() {
  const sections = useMemo(() => [...pniTemplate.sections].sort((a, b) => a.order - b.order), []);
  const firstSectionKey = sections[0]?.key ?? "";
  const emptyReport = useMemo(() => createEmptyReport(pniTemplate), []);
  const storedState = useSyncExternalStore(subscribeBuilderState, getBuilderSnapshot, getBuilderServerSnapshot);
  const state = normalizeBuilderState(storedState, pniTemplate.id, firstSectionKey, emptyReport);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState(false);
  const [isGeneratingPptx, setIsGeneratingPptx] = useState(false);
  const [isImportingExcel, setIsImportingExcel] = useState(false);
  const activeSection = sections.find((section) => section.key === state.activeSectionKey);
  const activeSectionIndex = sections.findIndex((section) => section.key === state.activeSectionKey);

  function setStored(patch: Partial<StoredBuilderState>) {
    saveBuilderState({ ...state, ...patch });
  }
  function resetStored(patch: Partial<StoredBuilderState> = {}) {
    saveBuilderState({ ...createInitialBuilderState(firstSectionKey, emptyReport), ...patch });
  }
  function handleTemplateUpload(file: File | undefined) {
    setStored({ uploadError: "" });
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pptx")) {
      setTemplateFile(null);
      setStored({ templateFileName: "", uploadError: "Veuillez sélectionner un fichier PowerPoint .pptx." });
      return;
    }
    setTemplateFile(file);
    setStored({ templateFileName: file.name, uploadError: "", generationError: "" });
  }
  async function handleExcelUpload(file: File | undefined) {
    setStored({ excelImportMessage: "", excelImportError: "", excelImportWarnings: [] });
    if (!file) return;
    if (!file.name.toLowerCase().match(/\.xls[x]?$/)) {
      setStored({ excelImportError: "Veuillez sélectionner un fichier Excel .xlsx ou .xls." });
      return;
    }
    try {
      setIsImportingExcel(true);
      const baseReport = createEmptyReport(pniTemplate);
      const warnings = await validateReportExcel({ file, template: pniTemplate });
      const importedReport = await parseReportExcel({ file, template: pniTemplate, currentReport: baseReport });
      resetStored({ report: importedReport, activeSectionKey: firstSectionKey, templateFileName: state.templateFileName, excelImportWarnings: warnings, excelImportMessage: IMPORT_OK });
    } catch (error) {
      console.error(error);
      setStored({ excelImportError: "Une erreur est survenue pendant l’importation du fichier Excel." });
    } finally {
      setIsImportingExcel(false);
    }
  }
  async function handleDownloadExcelTemplate() {
    setStored({ excelImportError: "" });
    const response = await fetch(EXCEL_TEMPLATE_URL);
    if (!response.ok) { setStored({ excelImportError: "Le modèle Excel est introuvable dans public/templates." }); return; }
    downloadBlob(await response.blob(), "modele-saisie-pni.xlsx");
  }
  function updateSectionValue(sectionKey: string, nextValue: unknown) {
    setStored({ report: applySectionValue(state.report, sectionKey, nextValue) });
  }
  function generateProblemsAndActivities() {
    setStored({ report: applyGeneratedPlan(state.report, generateSuggestions(state.report)), suggestionMessage: LOCAL_OK, activeSectionKey: "problems" });
  }
  async function generateProblemsAndActivitiesWithGemini() {
    setStored({ suggestionMessage: "", aiGenerationError: "" });
    try {
      setIsGeneratingWithAi(true);
      const response = await fetch("/api/ai/generate-pni-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ template: pniTemplate, report: state.report }) });
      const result = (await response.json()) as GeminiPlanResponse;
      if (!response.ok) throw new Error(result.error ?? "Erreur Gemini");
      setStored({ report: applyGeneratedPlan(state.report, result), suggestionMessage: GEMINI_OK, activeSectionKey: "problems" });
    } catch (error) { console.error(error); setStored({ aiGenerationError: GEMINI_ERROR }); }
    finally { setIsGeneratingWithAi(false); }
  }
  async function handleGeneratePowerPoint() {
    setStored({ generationError: "" });
    if (!templateFile) { setStored({ generationError: "Veuillez d’abord charger le modèle PowerPoint." }); return; }
    try {
      setIsGeneratingPptx(true);
      const blob = await generatePptx({ templateFile, template: pniTemplate, report: state.report });
      downloadBlob(blob, "rapport-pni-genere.pptx");
      resetStored({ templateFileName: templateFile.name });
    } catch (error) { console.error(error); setStored({ generationError: "Une erreur est survenue pendant la génération du PowerPoint." }); }
    finally { setIsGeneratingPptx(false); }
  }
  function goToPreviousSection() { const item = sections[activeSectionIndex - 1]; if (item) setStored({ activeSectionKey: item.key }); }
  function goToNextSection() { const item = sections[activeSectionIndex + 1]; if (item) setStored({ activeSectionKey: item.key }); }
  return { sections, activeSection, activeSectionIndex, report: state.report, templateFile, uploadError: state.uploadError,
    suggestionMessage: state.suggestionMessage, aiGenerationError: state.aiGenerationError, isGeneratingWithAi,
    generationError: state.generationError, isGeneratingPptx, excelImportMessage: state.excelImportMessage,
    excelImportError: state.excelImportError, excelImportWarnings: state.excelImportWarnings, isImportingExcel,
    setActiveSectionKey: (activeSectionKey: string) => setStored({ activeSectionKey }), handleTemplateUpload,
    handleExcelUpload, handleDownloadExcelTemplate, updateSectionValue, generateProblemsAndActivities,
    generateProblemsAndActivitiesWithGemini, handleGeneratePowerPoint, goToPreviousSection, goToNextSection };
}
