import { Presentation } from "lucide-react";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Badge } from "@/components/ui/badge";

export function HomeHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Presentation className="size-5" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight">
            PNI PPT Generator
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
      </div>
    </header>
  );
}