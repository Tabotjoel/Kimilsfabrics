"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-8 w-14 items-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-1 transition-colors"
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] transition-transform duration-300"
        style={{ transform: isDark ? "translateX(22px)" : "translateX(0)" }}
      >
        {isDark ? (
          <Moon size={13} strokeWidth={2.25} />
        ) : (
          <Sun size={13} strokeWidth={2.25} />
        )}
      </span>
    </button>
  );
}
