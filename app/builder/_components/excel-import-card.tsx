import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDropZone } from "./file-drop-zone";

type ExcelImportCardProps = {
  isImportingExcel: boolean;
  excelImportMessage: string;
  excelImportError: string;
  excelImportWarnings: string[];
  onUpload: (file: File | undefined) => void;
  onDownloadTemplate: () => void;
};

export function ExcelImportCard({
  isImportingExcel,
  excelImportMessage,
  excelImportError,
  excelImportWarnings,
  onUpload,
  onDownloadTemplate,
}: ExcelImportCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/70 shadow-sm">
      <CardHeader className="space-y-2 bg-muted/20">
        <div className="flex items-center gap-3">
          <StepBadge>2</StepBadge>
          <CardTitle>Importer les données depuis Excel</CardTitle>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Importez un fichier Excel PNI. Les valeurs restent modifiables dans
          les formulaires après importation.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <FileDropZone
          title="Déposer le fichier Excel ici"
          description="Compatible avec .xlsx et .xls. Le drag & drop et le bouton utilisent la même action."
          accept=".xlsx,.xls"
          buttonLabel={isImportingExcel ? "Importation..." : "Choisir un fichier Excel"}
          disabled={isImportingExcel}
          onFile={onUpload}
        />
        <Button
          type="button"
          variant="secondary"
          className="w-full rounded-2xl sm:w-auto"
          onClick={onDownloadTemplate}
        >
          <FileSpreadsheet className="mr-2 size-4" /> Télécharger modèle Excel
        </Button>
        <StatusMessage
          success={excelImportMessage}
          error={excelImportError}
          warnings={excelImportWarnings}
        />
      </CardContent>
    </Card>
  );
}

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
      {children}
    </span>
  );
}

function StatusMessage({
  success,
  error,
  warnings,
}: {
  success: string;
  error: string;
  warnings: string[];
}) {
  if (error) return <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>;
  if (success) return <p className="rounded-2xl bg-emerald-500/10 p-3 text-sm text-emerald-700">{success}</p>;
  if (warnings.length === 0) return <p className="text-sm text-muted-foreground">Format accepté : .xlsx ou .xls</p>;
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm">
      <p className="font-medium text-amber-800">Attention : feuilles manquantes.</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
        {warnings.map((warning) => <li key={warning}>{warning}</li>)}
      </ul>
    </div>
  );
}
