"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Shirt, PackageSearch, ExternalLink, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/orders", label: "Orders", icon: PackageSearch },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="mb-8 flex items-center gap-2.5 px-1">
        <img src="/images/logo-mark.png" alt="" className="h-9 w-9 rounded-full object-cover" />
        <div>
          <p className="font-display text-sm leading-none">Kekia Sally</p>
          <p className="text-xs text-[var(--fg-muted)]">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((l) => {
          const Icon = l.icon;
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--accent)] text-[var(--bg)]"
                  : "text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
              )}
            >
              <Icon size={16} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[var(--border)] pt-4">
        <p className="px-3 text-xs text-[var(--fg-muted)]">Signed in as {userName}</p>
        <a
          href="/en"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
        >
          <ExternalLink size={16} /> View site
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
