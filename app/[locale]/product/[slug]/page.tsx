import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { ProductCard } from "@/components/product-card";
import type { ProductDTO } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.published) return null;
  return {
    ...product,
    images: JSON.parse(product.images || "[]"),
    sizes: JSON.parse(product.sizes || "[]"),
    colors: JSON.parse(product.colors || "[]"),
    createdAt: product.createdAt.toISOString(),
  } as ProductDTO;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${locale === "fr" ? product.nameFr : product.nameEn} — Kekia Sally`,
    description: locale === "fr" ? product.descriptionFr : product.descriptionEn,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("product");
  const locale = await getLocale();
  const product = await getProduct(slug);

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      published: true,
      audience: product.audience,
      id: { not: product.id },
    },
    take: 4,
    include: { category: true },
  });
  const relatedFormatted: ProductDTO[] = related.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
    sizes: JSON.parse(p.sizes || "[]"),
    colors: JSON.parse(p.colors || "[]"),
    createdAt: p.createdAt.toISOString(),
  }));

  const name = locale === "fr" ? product.nameFr : product.nameEn;
  const description = locale === "fr" ? product.descriptionFr : product.descriptionEn;
  const images = product.images.length > 0 ? product.images : ["/images/logo-mark.png"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--bg-elevated)]">
            <Image src={images[0]} alt={name} fill sizes="50vw" className="object-cover" priority />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-sm bg-[var(--bg-elevated)]">
                  <Image src={img} alt={`${name} ${i + 2}`} fill sizes="12vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <p className="text-xs uppercase tracking-widest text-[var(--fg-muted)]">
              {locale === "fr" ? product.category.nameFr : product.category.nameEn}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">{name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl font-medium">{formatMoney(product.priceCents, product.currency, locale)}</span>
            {product.compareAtCents && (
              <span className="text-[var(--fg-muted)] line-through">
                {formatMoney(product.compareAtCents, product.currency, locale)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-[var(--fg-muted)]">{description}</p>

          <div className="mt-6 space-y-2 text-sm">
            {product.fabric && (
              <p>
                <span className="font-medium text-[var(--fg)]">{t("fabric")}:</span>{" "}
                <span className="text-[var(--fg-muted)]">{product.fabric}</span>
              </p>
            )}
            {product.madeToOrder && product.leadTimeDays && (
              <p>
                <span className="font-medium text-[var(--fg)]">{t("leadTime")}:</span>{" "}
                <span className="text-[var(--fg-muted)]">
                  ~{product.leadTimeDays} {t("days")} · {t("madeToOrder")}
                </span>
              </p>
            )}
          </div>

          <div className="mt-8 border-t border-[var(--border)] pt-8">
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>

      {relatedFormatted.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-2xl">{t("youMayAlsoLike")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {relatedFormatted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
