import Link from "next/link";
import { ArrowLeft, Presentation } from "lucide-react";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BuilderHeader() {
  return (
    <header className="mb-6 sm:mb-8 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
        <Button variant="outline" size="icon" asChild className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl">
          <Link href="/" aria-label="Back to home">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold tracking-tight truncate">
              PPT Generator
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 sm:gap-3 md:flex">
          <div className="flex size-9 sm:size-10 md:size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shrink-0">
            <Presentation className="size-4 sm:size-5" />
          </div>

          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm font-semibold truncate">PNI PPT Generator</p>
          </div>
        </div>

        <ModeToggle />
      </div>
    </header>
  );
}
