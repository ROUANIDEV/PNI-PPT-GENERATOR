import { Route, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function BuilderRouteBanner() {
  return (
    <Card className="mb-6 rounded-2xl">
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <Route className="size-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">Vous êtes dans le builder</p>
              <Badge variant="outline" className="rounded-full">
                /builder
              </Badge>
            </div>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Cette page sert à charger le modèle PPTX, importer Excel, remplir
              les sections PNI et générer le fichier PowerPoint final.
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border bg-muted p-4 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <p>
            Local par défaut. Gemini est optionnel et envoie les données via
            l’API de l’application.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}