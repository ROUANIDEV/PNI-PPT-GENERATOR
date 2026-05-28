import { CheckCircle2, FileUp, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize } from "../_utils/format-file-size";
import { FileDropZone } from "./file-drop-zone";

type TemplateUploadCardProps = {
  templateFile: File | null;
  uploadError: string;
  onUpload: (file: File | undefined) => void;
};

export function TemplateUploadCard({
  templateFile,
  uploadError,
  onUpload,
}: TemplateUploadCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/70 shadow-sm">
      <CardHeader className="space-y-2 bg-muted/20">
        <div className="flex items-center gap-3">
          <StepBadge>1</StepBadge>
          <CardTitle>Charger le modèle PowerPoint</CardTitle>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Sélectionnez le fichier PowerPoint vide du PNI. Le fichier reste dans
          le navigateur jusqu’à la génération finale.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <FileDropZone
          title="Déposer le modèle PPTX ici"
          description="Glissez le fichier dans cette zone ou cliquez sur le bouton pour ouvrir le sélecteur."
          accept=".pptx"
          buttonLabel="Choisir le fichier"
          onFile={onUpload}
        />
        {templateFile ? <LoadedTemplate file={templateFile} /> : <EmptyState />}
        {uploadError ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {uploadError}
          </p>
        ) : null}
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

function LoadedTemplate({ file }: { file: File }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
      <div className="min-w-0">
        <p className="font-medium text-emerald-700">Modèle chargé</p>
        <p className="truncate text-sm text-muted-foreground">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-muted/20 p-4">
      <FileUp className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      <div>
        <p className="font-medium">Aucun modèle chargé</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Chargez le modèle PowerPoint avant la génération finale.
        </p>
      </div>
      <Lock className="ml-auto size-4 shrink-0 text-muted-foreground" />
    </div>
  );
}
