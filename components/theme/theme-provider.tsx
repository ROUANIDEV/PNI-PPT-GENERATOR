"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "pni-theme";
const THEME_EVENT = "pni-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function readTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(savedTheme) ? savedTheme : "light";
  } catch {
    return "light";
  }
}

function getServerTheme(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

function subscribeTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const notify = () => onStoreChange();
  window.addEventListener("storage", notify);
  window.addEventListener(THEME_EVENT, notify);
  window.setTimeout(notify, 0);

  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(THEME_EVENT, notify);
  };
}

function saveTheme(theme: Theme) {
  applyTheme(theme);

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Keep the visual theme working even if localStorage is blocked.
  }

  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, getServerTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    saveTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const currentTheme = readTheme();
    saveTheme(currentTheme === "dark" ? "light" : "dark");
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider");
  }

  return context;
}
