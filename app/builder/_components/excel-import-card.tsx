import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <Card className="mb-6 rounded-2xl">
      <CardHeader>
        <CardTitle>2. Importer les données depuis Excel</CardTitle>
        <p className="text-sm text-muted-foreground">
          Importez un fichier Excel contenant les données PNI. Les données
          importées restent modifiables dans les formulaires.
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <Label
            htmlFor="excel-upload"
            className="cursor-pointer rounded-xl border bg-background px-5 py-3 text-sm font-medium shadow-sm transition hover:bg-accent hover:text-accent-foreground"
          >
            {isImportingExcel ? "Importation..." : "Choisir un fichier Excel"}
          </Label>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={onDownloadTemplate}
          >
            Télécharger modèle Excel
          </Button>

          <Input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(event) => onUpload(event.target.files?.[0])}
          />

          {excelImportMessage ? (
            <p className="text-sm font-medium text-green-600">
              {excelImportMessage}
            </p>
          ) : null}

          {excelImportError ? (
            <p className="text-sm font-medium text-destructive">
              {excelImportError}
            </p>
          ) : null}

          <ExcelWarnings warnings={excelImportWarnings} />

          {!excelImportMessage && !excelImportError ? (
            <p className="text-sm text-muted-foreground">
              Format accepté : .xlsx ou .xls
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ExcelWarnings({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="w-full rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-200">
      <p className="font-semibold">
        Attention : certaines feuilles sont manquantes.
      </p>

      <ul className="mt-2 list-disc space-y-1 pl-5">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}