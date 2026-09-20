import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo-mark.png"
                alt="Kimil Fabrics"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="font-display text-lg">Kimil Fabrics</span>
            </div>
            <p className="mt-3 font-script text-lg text-[var(--accent)]">
              {t("tagline")}
            </p>
            <div className="mt-4 flex gap-3 text-[var(--fg-muted)]">
              <a
                href="mailto:kimilsfabrics@gmail.com"
                aria-label="Email"
                className="hover:text-[var(--accent-2)]"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-[var(--fg-muted)]">
              {t("shop")}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/shop?audience=WOMEN"
                  className="hover:text-[var(--accent-2)]"
                >
                  {tNav("women")}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?audience=MEN"
                  className="hover:text-[var(--accent-2)]"
                >
                  {tNav("men")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[var(--accent-2)]">
                  {tNav("shop")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-[var(--fg-muted)]">
              {t("company")}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-[var(--accent-2)]">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--accent-2)]">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-[var(--fg-muted)]">
              {t("help")}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/contact" className="hover:text-[var(--accent-2)]">
                  {t("shipping")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--accent-2)]">
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="stitch-divider my-10" />

        <div className="flex flex-col items-center justify-between gap-2 text-xs text-[var(--fg-muted)] sm:flex-row">
          <p>
            © {year} Kimil Fabrics. {t("rights")}
          </p>
          <p>{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
