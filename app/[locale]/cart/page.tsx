"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartStore((s) => s.subtotalCents());

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <p className="mt-3 text-[var(--fg-muted)]">{t("empty")}</p>
        <Link href="/shop" className="mt-6">
          <Button>{t("emptyCta")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl">{t("title")}</h1>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {lines.map((line) => {
            const name = locale === "fr" ? line.nameFr : line.nameEn;
            return (
              <div
                key={`${line.productId}-${line.size}-${line.color}`}
                className="flex gap-4 border-b border-[var(--border)] pb-6"
              >
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm bg-[var(--bg-elevated)]">
                  <Image
                    src={line.image || "/images/logo-mark.png"}
                    alt={name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${line.slug}`} className="font-display text-base hover:underline">
                        {name}
                      </Link>
                      <p className="mt-1 text-xs text-[var(--fg-muted)]">
                        {[line.size, line.color].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeLine(line.productId, line.size, line.color)}
                      aria-label={t("remove")}
                      className="text-[var(--fg-muted)] hover:text-[var(--accent)]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-sm border border-[var(--border)]">
                      <button
                        className="px-2.5 py-1.5 disabled:opacity-40"
                        onClick={() =>
                          updateQuantity(line.productId, line.size, line.color, line.quantity - 1)
                        }
                        disabled={line.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm">{line.quantity}</span>
                      <button
                        className="px-2.5 py-1.5"
                        onClick={() =>
                          updateQuantity(line.productId, line.size, line.color, line.quantity + 1)
                        }
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-medium">
                      {formatMoney(line.unitCents * line.quantity, line.currency, locale)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <Link href="/shop" className="stitch-underline inline-block text-sm font-medium">
            {t("continueShopping")}
          </Link>
        </div>

        <div className="panel-elevated h-fit rounded-sm p-6">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--fg-muted)]">{t("subtotal")}</span>
            <span className="font-medium">{formatMoney(subtotal, "CAD", locale)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-[var(--fg-muted)]">{t("shipping")}</span>
            <span className="text-[var(--fg-muted)]">{t("shippingNote")}</span>
          </div>
          <div className="stitch-divider my-4" />
          <div className="flex justify-between text-base font-medium">
            <span>{t("total")}</span>
            <span>{formatMoney(subtotal, "CAD", locale)}</span>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full" size="lg">
              {t("checkout")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
