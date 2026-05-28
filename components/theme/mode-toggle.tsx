"use client";

import { Moon, Sun } from "lucide-react";

import { useAppTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Changer le thème"
      onClick={toggleTheme}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}