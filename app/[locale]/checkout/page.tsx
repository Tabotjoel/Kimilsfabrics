"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/lib/cart-store";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
];

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotalCents());

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "ON",
    postalCode: "",
    country: "CA",
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <p className="mt-3 text-[var(--fg-muted)]">{tCart("empty")}</p>
        <Link href="/shop" className="mt-6">
          <Button>{tCart("emptyCta")}</Button>
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          customer: form,
          lines: lines.map((l) => ({
            productId: l.productId,
            size: l.size,
            color: l.color,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.toString() || "Something went wrong.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]";
  const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--fg-muted)]";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="font-display text-lg">{t("contact")}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("fullName")}</label>
                <input required className={inputClass} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>{t("email")}</label>
                <input required type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>{t("phone")}</label>
                <input className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg">{t("shippingAddress")}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("address")}</label>
                <input required className={inputClass} value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>{t("city")}</label>
                <input required className={inputClass} value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>{t("province")}</label>
                <select required className={inputClass} value={form.province} onChange={(e) => update("province", e.target.value)}>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("postalCode")}</label>
                <input required className={inputClass} value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>{t("country")}</label>
                <input disabled className={inputClass} value="Canada" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("notes")}</label>
                <textarea rows={3} className={inputClass} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
              </div>
            </div>
          </section>
        </div>

        <div className="panel-elevated h-fit rounded-sm p-6">
          <h2 className="font-display text-lg">{t("orderSummary")}</h2>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {lines.map((line) => (
              <div key={`${line.productId}-${line.size}-${line.color}`} className="flex justify-between text-sm">
                <span className="text-[var(--fg-muted)]">
                  {(locale === "fr" ? line.nameFr : line.nameEn)} × {line.quantity}
                </span>
                <span>{formatMoney(line.unitCents * line.quantity, line.currency, locale)}</span>
              </div>
            ))}
          </div>
          <div className="stitch-divider my-4" />
          <div className="flex justify-between text-sm">
            <span className="text-[var(--fg-muted)]">{tCart("subtotal")}</span>
            <span className="font-medium">{formatMoney(subtotal, "CAD", locale)}</span>
          </div>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">{tCart("shippingNote")}</p>

          <Button type="submit" disabled={loading} size="lg" className="mt-6 w-full">
            {loading ? t("processing") : t("payNow")}
          </Button>
          <p className="mt-3 text-center text-xs text-[var(--fg-muted)]">{t("securePayment")}</p>
        </div>
      </form>
    </div>
  );
}
