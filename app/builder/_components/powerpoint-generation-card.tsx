import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="mb-6 rounded-2xl">
      <CardHeader>
        <CardTitle>5. Générer le fichier PowerPoint</CardTitle>
        <p className="text-sm text-muted-foreground">
          Cette action remplit le modèle PowerPoint chargé avec les données
          saisies.
        </p>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-4">
        <Button
          type="button"
          className="rounded-xl"
          disabled={!templateFile || isGeneratingPptx}
          onClick={onGenerate}
        >
          {isGeneratingPptx ? "Génération..." : "Générer PowerPoint"}
        </Button>

        {generationError ? (
          <p className="text-sm font-medium text-destructive">
            {generationError}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Le fichier généré sera téléchargé automatiquement.
          </p>
        )}
      </CardContent>
    </Card>
  );
}