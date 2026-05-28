"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileUp,
  Lock,
  Presentation,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { DynamicSectionRenderer } from "@/components/report-builder/dynamic-section-renderer";
import { createEmptyReport } from "@/lib/report/create-empty-report";
import { generateSuggestions } from "@/lib/report/generate-suggestions";
import { parseReportExcel } from "@/lib/excel/parse-report-excel";
import { validateReportExcel } from "@/lib/excel/validate-report-excel";
import { createExcelTemplate } from "@/lib/excel/create-excel-template";
import { downloadBlob } from "@/lib/download-file";
import { generatePptx } from "@/lib/pptx/generate-pptx";
import { pniTemplate } from "@/lib/templates/pni-template";
import type { ReportData } from "@/types/template";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function BuilderPage() {
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

    if (!file) {
      return;
    }

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

  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();

  if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
    setExcelImportError("Veuillez sélectionner un fichier Excel .xlsx ou .xls.");
    return;
  }

  try {
    setIsImportingExcel(true);

    const warnings = await validateReportExcel({
  file,
  template: pniTemplate,
});

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
      return {
        ...currentReport,
        values: {
          ...currentReport.values,
          [sectionKey]: nextValue,
        },
      };
    });
  }

  function generateProblemsAndActivities() {
    const result = generateSuggestions(report);

    setReport((currentReport) => {
      return {
        ...currentReport,
        values: {
          ...currentReport.values,
          problems: {
            items: result.problems,
          },
          activities: {
            items: result.activities,
          },
        },
      };
    });

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: pniTemplate,
        report,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "Erreur Gemini");
    }

    setReport((currentReport) => {
      return {
        ...currentReport,
        values: {
          ...currentReport.values,
          problems: {
            items: result.problems,
          },
          activities: {
            items: result.activities,
          },
        },
      };
    });

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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">
                  Générateur PowerPoint PNI
                </h1>

                <Badge variant="secondary" className="rounded-full">
                  Projet local
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Interface en français pour remplir le modèle PowerPoint PNI.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-200">
              <Presentation className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">PNI PPT Generator</p>
              <p className="text-xs text-muted-foreground">
                Données locales uniquement
              </p>
            </div>
          </div>
        </header>

        <Card className="mb-6 rounded-3xl border-slate-200">
          <CardHeader>
            <CardTitle>1. Charger le modèle PowerPoint</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sélectionnez le fichier PowerPoint vide du PNI. Le fichier reste
              uniquement dans le navigateur pour ce mini-projet.
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
              <Label
                htmlFor="template-upload"
                className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-slate-950 hover:bg-slate-50"
              >
                <UploadCloud className="mb-4 size-9 text-slate-700" />

                <p className="font-semibold">
                  Cliquer pour sélectionner le modèle PPTX
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Format accepté : .pptx
                </p>

                <div className="mt-5">
                  <Button type="button" className="rounded-2xl">
                    <FileUp className="mr-2 size-4" />
                    Choisir le fichier
                  </Button>
                </div>

                <Input
                  id="template-upload"
                  type="file"
                  accept=".pptx"
                  className="hidden"
                  onChange={(event) =>
                    handleTemplateUpload(event.target.files?.[0])
                  }
                />
              </Label>

              <div className="rounded-3xl bg-slate-950 p-5 text-white">
                {templateFile ? (
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                        <CheckCircle2 className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold">Modèle chargé</p>

                        <p className="mt-1 truncate text-sm text-slate-300">
                          {templateFile.name}
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {formatFileSize(templateFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Lock className="mb-4 size-6 text-slate-300" />

                    <p className="font-bold">Aucun modèle chargé</p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Chargez le modèle PowerPoint avant la génération finale.
                      La saisie peut déjà être préparée.
                    </p>
                  </div>
                )}

                {uploadError ? (
                  <p className="mt-4 rounded-2xl bg-red-500/20 p-3 text-sm text-red-100">
                    {uploadError}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 rounded-3xl border-slate-200 bg-white">
  <CardHeader>
    <CardTitle>2. Importer les données depuis Excel</CardTitle>
    <p className="text-sm text-muted-foreground">
      Importez un fichier Excel contenant les données PNI. Les données importées
      restent modifiables dans les formulaires.
    </p>
  </CardHeader>

  <CardContent>
    <div className="flex flex-wrap items-center gap-4">
      <Label
        htmlFor="excel-upload"
        className="cursor-pointer rounded-2xl border bg-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-slate-50"
      >
        {isImportingExcel ? "Importation..." : "Choisir un fichier Excel"}
      </Label>

      <Button
  type="button"
  variant="outline"
  className="rounded-2xl"
  onClick={handleDownloadExcelTemplate}
>
  Télécharger modèle Excel
</Button>

      <Input
        id="excel-upload"
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(event) => handleExcelUpload(event.target.files?.[0])}
      />

      {excelImportMessage ? (
        <p className="text-sm font-medium text-green-700">
          {excelImportMessage}
        </p>
      ) : null}

      {excelImportError ? (
        <p className="text-sm font-medium text-red-600">
          {excelImportError}
        </p>
      ) : null}

      {excelImportWarnings.length > 0 ? (
  <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
    <p className="font-semibold">
      Attention : certaines feuilles sont manquantes.
    </p>

    <ul className="mt-2 list-disc space-y-1 pl-5">
      {excelImportWarnings.map((warning) => (
        <li key={warning}>{warning}</li>
      ))}
    </ul>
  </div>
) : null}

      {!excelImportMessage && !excelImportError ? (
        <p className="text-sm text-muted-foreground">
          Format accepté : .xlsx ou .xls
        </p>
      ) : null}
    </div>
  </CardContent>
</Card>

        <Card className="mb-6 rounded-3xl border-slate-200 bg-white">
  <CardHeader>
    <CardTitle>2. Génération automatique</CardTitle>
    <p className="text-sm text-muted-foreground">
      Cette fonction analyse les taux faibles, les ruptures de stock,
      les doses expirées, les pertes et les problèmes de chaîne de
      froid.
    </p>
  </CardHeader>

  <CardContent className="flex flex-wrap items-center gap-4">
    <Button
      type="button"
      variant="outline"
      className="rounded-2xl"
      onClick={generateProblemsAndActivities}
    >
      Génération locale
    </Button>

    <Button
      type="button"
      className="rounded-2xl"
      disabled={isGeneratingWithAi}
      onClick={generateProblemsAndActivitiesWithGemini}
    >
      <Sparkles className="mr-2 size-4" />
      {isGeneratingWithAi ? "Génération Gemini..." : "Générer avec Gemini"}
    </Button>

    {suggestionMessage ? (
      <p className="text-sm font-medium text-green-700">
        {suggestionMessage}
      </p>
    ) : (
      <p className="text-sm text-muted-foreground">
        Le texte généré restera modifiable par l’utilisateur.
      </p>
    )}

    {aiGenerationError ? (
      <p className="text-sm font-medium text-red-600">
        {aiGenerationError}
      </p>
    ) : null}
  </CardContent>
</Card>

<Card className="mb-6 rounded-3xl border-slate-200 bg-white">
  <CardHeader>
    <CardTitle>3. Générer le fichier PowerPoint</CardTitle>
    <p className="text-sm text-muted-foreground">
      Cette action remplit le modèle PowerPoint chargé avec les données saisies.
    </p>
  </CardHeader>

  <CardContent className="flex flex-wrap items-center gap-4">
    <Button
      type="button"
      className="rounded-2xl"
      disabled={!templateFile || isGeneratingPptx}
      onClick={handleGeneratePowerPoint}
    >
      {isGeneratingPptx ? "Génération..." : "Générer PowerPoint"}
    </Button>

    {generationError ? (
      <p className="text-sm font-medium text-red-600">
        {generationError}
      </p>
    ) : (
      <p className="text-sm text-muted-foreground">
        Le fichier généré sera téléchargé automatiquement.
      </p>
    )}
  </CardContent>
</Card>

        <div className="grid flex-1 gap-6 lg:grid-cols-[320px_1fr]">
          <aside>
            <Card className="sticky top-6 rounded-3xl border-slate-200">
              <CardHeader>
                <CardTitle>3. Sections du modèle</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Les champs affichés viennent du modèle dynamique.
                </p>
              </CardHeader>

              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const isActive = section.key === activeSectionKey;

                  return (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setActiveSectionKey(section.key)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "bg-white hover:bg-slate-50"
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

          <section className="space-y-6">
            {activeSection ? (
              <DynamicSectionRenderer
                section={activeSection}
                sections={sections}
                value={report.values[activeSection.key]}
                allValues={report.values}
                onChange={(nextValue) =>
                  updateSectionValue(activeSection.key, nextValue)
                }
              />
            ) : null}

            <Card className="rounded-3xl">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                <Button
                  type="button"
                  variant="outline"
                  disabled={activeSectionIndex <= 0}
                  onClick={goToPreviousSection}
                >
                  Section précédente
                </Button>

                <div className="text-sm text-muted-foreground">
                  Section {activeSectionIndex + 1} / {sections.length}
                </div>

                <Button
                  type="button"
                  disabled={activeSectionIndex >= sections.length - 1}
                  onClick={goToNextSection}
                >
                  Section suivante
                </Button>
              </CardContent>
            </Card>

            <Separator />

            <details className="rounded-3xl border bg-white p-5">
              <summary className="cursor-pointer font-semibold">
                Voir les données JSON actuelles
              </summary>

              <pre className="mt-4 max-h-[500px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                {JSON.stringify(report, null, 2)}
              </pre>
            </details>
          </section>
        </div>
      </div>
    </main>
  );
}