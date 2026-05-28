import Link from "next/link";
import { ArrowLeft, Presentation } from "lucide-react";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BuilderHeader() {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/" aria-label="Retour à l’accueil">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>

        <div className="min-w-0">
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

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Presentation className="size-5" />
          </div>

          <div>
            <p className="text-sm font-semibold">PNI PPT Generator</p>
            <p className="text-xs text-muted-foreground">
              Local par défaut · Gemini optionnel
            </p>
          </div>
        </div>

        <ModeToggle />
      </div>
    </header>
  );
}