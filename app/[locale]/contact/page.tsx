"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]";
  const labelClass =
    "mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--fg-muted)]";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center font-display text-3xl">{t("title")}</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-[var(--fg-muted)]">
        {t("subtitle")}
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--fg-muted)]">
        <MapPin size={14} /> {t("location")}
      </div>

      {sent ? (
        <p className="mt-10 rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center">
          {t("sent")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label className={labelClass}>{t("name")}</label>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>{t("email")}</label>
            <input
              required
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>{t("message")}</label>
            <textarea
              required
              rows={5}
              className={inputClass}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? "…" : t("send")}
          </Button>
        </form>
      )}
    </div>
  );
}
