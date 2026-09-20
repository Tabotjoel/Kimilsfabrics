import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "@/components/shop-filters";
import type { ProductDTO, ProductAudience } from "@/lib/types";

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ audience?: string; category?: string; sort?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const t = await getTranslations("shop");
  const locale = await getLocale();
  const { audience, category, sort } = await searchParams;

  const where: Record<string, unknown> = { published: true };
  if (audience && ["WOMEN", "MEN", "UNISEX"].includes(audience)) {
    where.audience = audience as ProductAudience;
  }
  if (category) {
    where.category = { slug: category };
  }

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { priceCents: "asc" };
  if (sort === "price-desc") orderBy = { priceCents: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where, orderBy, include: { category: true } }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  const formatted: ProductDTO[] = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
    sizes: JSON.parse(p.sizes || "[]"),
    colors: JSON.parse(p.colors || "[]"),
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <ShopFilters categories={categories} locale={locale} />
      </div>

      {formatted.length === 0 ? (
        <p className="mt-16 text-center text-[var(--fg-muted)]">{t("noResults")}</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {formatted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
