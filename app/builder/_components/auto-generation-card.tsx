import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          3. Génération automatique
        </div>
        <CardTitle className="text-xl">Suggestions intelligentes</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          La génération locale analyse les taux faibles, les ruptures de stock,
          les doses expirées, les pertes et les problèmes de chaîne de froid.
        </p>

        <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground">Confidentialité</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            La génération locale reste dans le navigateur. La génération Gemini
            est optionnelle et envoie les données du rapport au serveur de
            l&apos;application, puis à Google Gemini.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onGenerateLocal}>
            Génération locale
          </Button>
          <Button
            type="button"
            onClick={onGenerateWithGemini}
            disabled={isGeneratingWithAi}
          >
            {isGeneratingWithAi ? "Génération Gemini..." : "Générer avec Gemini"}
          </Button>
        </div>

        {suggestionMessage ? (
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm leading-6 text-foreground">
            {suggestionMessage}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Le texte généré restera modifiable par l&apos;utilisateur.
          </p>
        )}

        {aiGenerationError ? (
          <p className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {aiGenerationError}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
