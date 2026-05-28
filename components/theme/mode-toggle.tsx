"use client";

import { Moon, Sun } from "lucide-react";

import { useAppTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { toggleTheme } = useAppTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Changer le thème"
      title="Changer le thème"
      onClick={toggleTheme}
    >
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
      <span className="sr-only">Changer le thème</span>
    </Button>
  );
}
