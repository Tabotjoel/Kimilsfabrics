"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { useCartStore } from "@/lib/cart-store";

export function Navbar() {
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/shop", label: t("shop") },
    { href: "/shop?audience=WOMEN", label: t("women") },
    { href: "/shop?audience=MEN", label: t("men") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo-mark.png"
            alt="Kimil Fabrics"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
            priority
          />
          <span className="font-display text-lg leading-none tracking-wide sm:text-xl">
            Kimil <span className="text-[var(--accent-2)]">Fabrics</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={pathname === l.href.split("?")[0]}
              className="stitch-underline text-sm font-medium tracking-wide text-[var(--fg-muted)] hover:text-[var(--fg)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <ThemeToggle label={tTheme("toggle")} />
          <Link
            href="/cart"
            aria-label={t("cart")}
            className="relative rounded-full border border-[var(--border)] p-2 text-[var(--fg)] transition-colors hover:border-[var(--accent-2)]"
          >
            <ShoppingBag size={18} />
            {mounted && itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-[var(--bg)]">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-full border border-[var(--border)] p-2 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-4 lg:hidden">
          <div className="mb-4 sm:hidden">
            <LocaleSwitcher />
          </div>
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium tracking-wide text-[var(--fg)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
