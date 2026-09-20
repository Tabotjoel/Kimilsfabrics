"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: "en" | "fr") {
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1 text-xs font-medium">
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`rounded-full px-2.5 py-1 uppercase tracking-wide transition-colors ${
            locale === l
              ? "bg-[var(--accent)] text-[var(--bg)]"
              : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
