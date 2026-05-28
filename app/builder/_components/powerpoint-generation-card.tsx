import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle2, AlertCircle } from "lucide-react";

type PowerPointGenerationCardProps = {
  templateFile: File | null;
  generationError: string;
  isGeneratingPptx: boolean;
  onGenerate: () => void;
};

export function PowerPointGenerationCard({
  templateFile,
  generationError,
  isGeneratingPptx,
  onGenerate,
}: PowerPointGenerationCardProps) {
  const isDisabled = !templateFile || isGeneratingPptx;

  return (
    <Card className="mb-6 rounded-2xl border-0 bg-gradient-to-br from-primary/5 via-card to-accent/5 shadow-lg overflow-hidden">
      {/* Gradient accent border effect */}
      <div className="absolute inset-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-60" />
      
      <CardHeader className="relative pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-primary-foreground">5</span>
          </div>
          <div>
            <CardTitle className="text-xl">Générer le fichier PowerPoint</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Remplissez le modèle avec vos données et téléchargez le rapport
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            type="button"
            className="group rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2.5 font-semibold text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            disabled={isDisabled}
            onClick={onGenerate}
          >
            {isGeneratingPptx ? (
              <>
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Génération en cours...
              </>
            ) : (
              <>
                <Download className="size-4" />
                Générer PowerPoint
              </>
            )}
          </Button>

          <div className="flex-1">
            {generationError ? (
              <div className="flex items-start gap-3 rounded-xl bg-destructive/10 p-3.5 border border-destructive/30">
                <AlertCircle className="size-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-destructive">{generationError}</p>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-3.5 border border-primary/20">
                <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Le fichier généré sera téléchargé automatiquement.
                </p>
              </div>
            )}
          </div>
        </div>

        {templateFile && (
          <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Modèle chargé: <span className="font-semibold">{templateFile.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
