"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

interface Category {
  slug: string;
  nameEn: string;
  nameFr: string;
}

export function ShopFilters({ categories, locale }: { categories: Category[]; locale: string }) {
  const t = useTranslations("shop");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const audience = searchParams.get("audience") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectClass =
    "rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={audience}
        onChange={(e) => updateParam("audience", e.target.value)}
        className={selectClass}
        aria-label={t("filterAudience")}
      >
        <option value="">{t("filterAudience")}</option>
        <option value="WOMEN">{locale === "fr" ? "Femme" : "Women"}</option>
        <option value="MEN">{locale === "fr" ? "Homme" : "Men"}</option>
        <option value="UNISEX">{locale === "fr" ? "Unisexe" : "Unisex"}</option>
      </select>

      <select
        value={category}
        onChange={(e) => updateParam("category", e.target.value)}
        className={selectClass}
        aria-label={t("filterCategory")}
      >
        <option value="">{t("filterCategory")}</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {locale === "fr" ? c.nameFr : c.nameEn}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className={selectClass}
        aria-label={t("sortBy")}
      >
        <option value="">{t("sortBy")}</option>
        <option value="price-asc">{t("sortPriceLow")}</option>
        <option value="price-desc">{t("sortPriceHigh")}</option>
      </select>
    </div>
  );
}
