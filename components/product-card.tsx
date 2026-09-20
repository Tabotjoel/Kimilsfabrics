"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/utils";
import type { ProductDTO } from "@/lib/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const locale = useLocale();
  const t = useTranslations("product");
  const name = locale === "fr" ? product.nameFr : product.nameEn;
  const image = product.images[0] ?? "/images/logo-mark.png";
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--bg-elevated)]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.compareAtCents && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--bg)]">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-[var(--ink-900,#1c1310)]/80 py-1.5 text-center text-[11px] font-medium uppercase tracking-widest text-white">
            {t("outOfStock")}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base leading-snug">{name}</h3>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-[var(--fg-muted)]">
            {product.audience === "WOMEN" ? "Women" : product.audience === "MEN" ? "Men" : "Unisex"}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-medium">{formatMoney(product.priceCents, product.currency, locale)}</p>
          {product.compareAtCents && (
            <p className="text-xs text-[var(--fg-muted)] line-through">
              {formatMoney(product.compareAtCents, product.currency, locale)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
