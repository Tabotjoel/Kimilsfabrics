"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { ProductDTO } from "@/lib/types";

export function AddToCartForm({ product }: { product: ProductDTO }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const addLine = useCartStore((s) => s.addLine);

  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  const outOfStock = product.stock <= 0;
  const name = locale === "fr" ? product.nameFr : product.nameEn;

  function handleAdd() {
    if (product.sizes.length > 0 && !size) {
      toast.error(t("selectSize"));
      return;
    }
    if (product.colors.length > 0 && !color) {
      toast.error(t("selectColor"));
      return;
    }
    addLine({
      productId: product.id,
      slug: product.slug,
      nameEn: product.nameEn,
      nameFr: product.nameFr,
      unitCents: product.priceCents,
      currency: product.currency,
      image: product.images[0] ?? null,
      size: size || null,
      color: color || null,
      quantity,
      stock: product.stock,
    });
    toast.success(t("addedToCart"), { icon: "🧵" });
  }

  return (
    <div className="space-y-6">
      {product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--fg-muted)]">
            {t("size")}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-sm border px-3.5 py-2 text-sm transition-colors ${
                  size === s
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--fg-muted)]">
            {t("color")}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-sm border px-3.5 py-2 text-sm transition-colors ${
                  color === c
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--fg-muted)]">
          {t("quantity")}
        </p>
        <div className="inline-flex items-center rounded-sm border border-[var(--border)]">
          <button
            className="px-3 py-2 disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            className="px-3 py-2"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <Button
        onClick={handleAdd}
        disabled={outOfStock}
        size="lg"
        className="w-full sm:w-auto"
      >
        {outOfStock ? t("outOfStock") : t("addToCart")}
      </Button>
      <p className="sr-only">{name}</p>
    </div>
  );
}
