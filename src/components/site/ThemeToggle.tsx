import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

/** Sliding sun/moon switch. Its look follows the `dark` class, so it is correct on first paint. */
export function ThemeToggle({ className, showLabel = false }: { className?: string | undefined; showLabel?: boolean | undefined }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span className="relative flex h-9 w-[4.25rem] shrink-0 items-center justify-between rounded-full border border-border bg-muted px-2 shadow-inner">
        <Sun className="size-4 text-brand-ink opacity-0 transition-opacity duration-300 dark:opacity-100" aria-hidden />
        <Moon className="size-4 text-muted-foreground opacity-100 transition-opacity duration-300 dark:opacity-0" aria-hidden />
        <span className="absolute left-1 top-1 flex size-7 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 dark:translate-x-8">
          <Sun className="size-4 transition-all duration-500 dark:-rotate-90 dark:scale-0" aria-hidden />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" aria-hidden />
        </span>
      </span>
      {showLabel && (
        <span className="text-sm font-semibold text-foreground">
          <span className="dark:hidden">Light mode</span>
          <span className="hidden dark:inline">Dark mode</span>
        </span>
      )}
    </button>
  );
}
