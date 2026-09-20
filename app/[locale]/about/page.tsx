import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Heart, Ruler, Shirt } from "lucide-react";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">{t("title")}</h1>
            <p className="mt-6 leading-relaxed text-[var(--fg-muted)]">{t("body1")}</p>
            <p className="mt-4 leading-relaxed text-[var(--fg-muted)]">{t("body2")}</p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <Image
              src="/images/logo-full.png"
              alt="Kekia Sally"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl sm:text-3xl">{t("valuesTitle")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            { icon: Ruler, title: t("value1Title"), desc: t("value1Desc") },
            { icon: Shirt, title: t("value2Title"), desc: t("value2Desc") },
            { icon: Heart, title: t("value3Title"), desc: t("value3Desc") },
          ].map((v, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent-2)] text-[var(--accent-2)]">
                <v.icon size={22} />
              </div>
              <h3 className="mt-4 font-display text-lg">{v.title}</h3>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
