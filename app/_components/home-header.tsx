import { Presentation } from "lucide-react";

import { ModeToggle } from "@/components/theme/mode-toggle";

export function HomeHeader() {
  return (
    <header className="flex w-full items-center justify-between gap-3 sm:gap-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shrink-0">
          <Presentation className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
            PNI
          </p>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
            PNI PPT Generator
          </h1>
        </div>
      </div>

      <ModeToggle />
    </header>
  );
}
