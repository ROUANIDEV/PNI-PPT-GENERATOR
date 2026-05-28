import { CheckCircle2, FileUp, Lock, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { formatFileSize } from "../_utils/format-file-size";

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
    <Card className="mb-6 rounded-2xl">
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
            className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 p-6 text-center transition hover:bg-muted/40 hover:border-border/80 hover:text-foreground"
          >
            <UploadCloud className="mb-4 size-9 text-muted-foreground" />

            <p className="font-semibold">
              Cliquer pour sélectionner le modèle PPTX
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Format accepté : .pptx
            </p>

            <div className="mt-5">
              <Button type="button" className="rounded-xl">
                <FileUp className="mr-2 size-4" />
                Choisir le fichier
              </Button>
            </div>

            <Input
              id="template-upload"
              type="file"
              accept=".pptx"
              className="hidden"
              onChange={(event) => onUpload(event.target.files?.[0])}
            />
          </Label>

          <div className="rounded-2xl border border-border bg-card p-5 text-muted-foreground shadow-sm">
            {templateFile ? (
              <LoadedTemplate file={templateFile} />
            ) : (
              <EmptyTemplateState />
            )}

            {uploadError ? (
              <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/15 dark:border-destructive/40">
                {uploadError}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadedTemplate({ file }: { file: File }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <CheckCircle2 className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="font-bold text-foreground">Modèle chargé</p>
        <p className="mt-1 truncate text-sm">{file.name}</p>
        <p className="mt-2 text-sm font-semibold">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  );
}

function EmptyTemplateState() {
  return (
    <div>
      <Lock className="mb-4 size-6" />
      <p className="font-bold text-foreground">Aucun modèle chargé</p>
      <p className="mt-2 text-sm leading-6">
        Chargez le modèle PowerPoint avant la génération finale. La saisie peut
        déjà être préparée.
      </p>
    </div>
  );
}
