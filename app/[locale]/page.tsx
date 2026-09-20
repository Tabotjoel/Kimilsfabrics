import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Scissors, Sparkles, Truck } from "lucide-react";
import type { ProductDTO } from "@/lib/types";

export const revalidate = 60;

async function getFeaturedProducts(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { category: true },
  });
  return products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
    sizes: JSON.parse(p.sizes || "[]"),
    colors: JSON.parse(p.colors || "[]"),
    createdAt: p.createdAt.toISOString(),
  }));
}

export default async function HomePage() {
  const t = await getTranslations("hero");
  const tHome = await getTranslations("home");
  const locale = await getLocale();
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-2)]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 whitespace-pre-line font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-md text-base text-[var(--fg-muted)]">
              {t("subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/shop">
                <Button size="lg">{t("cta")}</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  {t("ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-[var(--accent)]/10 blur-2xl" />
            <Image
              src="/images/logo-full.png"
              alt="Kimil Fabrics — Designed to Inspire, Made to Last"
              fill
              priority
              className="relative object-contain"
            />
          </div>
        </div>
      </section>

      {/* Shop by audience */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl sm:text-3xl">
          {tHome("shopByAudience")}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/shop?audience=WOMEN"
            className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-sm bg-[var(--burgundy-600,#6a1129)] p-8 text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <Image
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80"
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="relative">
              <h3 className="font-display text-2xl">{tHome("women")}</h3>
              <p className="mt-1 max-w-xs text-sm text-white/80">
                {tHome("womenDesc")}
              </p>
            </div>
          </Link>
          <Link
            href="/shop?audience=MEN"
            className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-sm bg-[var(--ink-900,#1c1310)] p-8 text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="relative">
              <h3 className="font-display text-2xl">{tHome("men")}</h3>
              <p className="mt-1 max-w-xs text-sm text-white/80">
                {tHome("menDesc")}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">
                {tHome("featured")}
              </h2>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">
                {tHome("featuredSub")}
              </p>
            </div>
            <Link
              href="/shop"
              className="stitch-underline hidden text-sm font-medium sm:block"
            >
              {tHome("viewAll")}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/shop" className="stitch-underline text-sm font-medium">
              {tHome("viewAll")}
            </Link>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl sm:text-3xl">
            {tHome("processTitle")}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: tHome("process1Title"),
                desc: tHome("process1Desc"),
              },
              {
                icon: Scissors,
                title: tHome("process2Title"),
                desc: tHome("process2Desc"),
              },
              {
                icon: Truck,
                title: tHome("process3Title"),
                desc: tHome("process3Desc"),
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent-2)] text-[var(--accent-2)]">
                  <step.icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--fg-muted)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl">
          {tHome("newsletterTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--fg-muted)]">
          {tHome("newsletterSub")}
        </p>
        <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder={locale === "fr" ? "Votre courriel" : "Your email"}
            className="w-full flex-1 rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <Button type="submit">{tHome("newsletterCta")}</Button>
        </form>
      </section>
    </div>
  );
}
