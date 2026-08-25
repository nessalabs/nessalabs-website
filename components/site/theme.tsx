"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { CodeSurfaceProvider } from "./code-surface";
import { cn } from "@/lib/cn";

export type Theme = "light" | "dark";

const STORAGE_KEY = "nessa-theme";

const ThemeContext = React.createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

/** nessa-ui keys dark tokens off `.dark`; the site's chrome reads data-theme. */
function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("dark");

  React.useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  const toggle = React.useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      apply(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // storage can be unavailable; the toggle still works for this page
      }
      return next;
    });
  }, []);

  const value = React.useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return (
    <ThemeContext.Provider value={value}>
      {/* The app resolves its own color mode, so code surfaces follow it
          instead of the OS. */}
      <CodeSurfaceProvider mode={theme}>{children}</CodeSurfaceProvider>
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, toggle } = React.useContext(ThemeContext);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground",
        "transition-colors hover:bg-secondary hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {/* Nothing until mounted, so server and client markup agree. */}
      {!mounted ? null : theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

/**
 * Runs before paint: resolves the stored choice, falling back to the OS, so
 * there is no flash of the wrong palette.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.dataset.theme=t;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){}})();`;
