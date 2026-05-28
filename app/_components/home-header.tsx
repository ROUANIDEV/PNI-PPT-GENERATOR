import { Presentation } from "lucide-react";

import { ModeToggle } from "@/components/theme/mode-toggle";

export function HomeHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Presentation className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            PNI
          </p>
          <h1 className="text-lg font-semibold tracking-tight">
            PNI PPT Generator
          </h1>
        </div>
      </div>

      <ModeToggle />
    </header>
  );
}
