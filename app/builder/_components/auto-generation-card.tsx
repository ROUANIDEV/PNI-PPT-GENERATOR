import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AutoGenerationCardProps = {
  suggestionMessage: string;
  aiGenerationError: string;
  isGeneratingWithAi: boolean;
  onGenerateLocal: () => void;
  onGenerateWithGemini: () => void;
};

export function AutoGenerationCard({
  suggestionMessage,
  aiGenerationError,
  isGeneratingWithAi,
  onGenerateLocal,
  onGenerateWithGemini,
}: AutoGenerationCardProps) {
  return (
    <Card className="mb-6 rounded-2xl">
      <CardHeader>
        <CardTitle>3. Génération automatique</CardTitle>
        <p className="text-sm text-muted-foreground">
          La génération locale analyse les taux faibles, les ruptures de stock,
          les doses expirées, les pertes et les problèmes de chaîne de froid.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-700 dark:text-yellow-200">
          <p className="font-semibold">Confidentialité</p>
          <p className="mt-1">
            La génération locale reste dans le navigateur. La génération Gemini
            est optionnelle et envoie les données du rapport au serveur de
            l’application, puis à Google Gemini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={onGenerateLocal}
          >
            Génération locale
          </Button>

          <Button
            type="button"
            className="rounded-xl"
            disabled={isGeneratingWithAi}
            onClick={onGenerateWithGemini}
          >
            <Sparkles className="mr-2 size-4" />
            {isGeneratingWithAi
              ? "Génération Gemini..."
              : "Générer avec Gemini"}
          </Button>

          {suggestionMessage ? (
            <p className="text-sm font-medium text-green-600">
              {suggestionMessage}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Le texte généré restera modifiable par l’utilisateur.
            </p>
          )}

          {aiGenerationError ? (
            <p className="text-sm font-medium text-destructive">
              {aiGenerationError}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}