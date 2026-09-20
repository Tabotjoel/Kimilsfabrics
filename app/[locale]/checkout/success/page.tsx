"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";

function CheckoutSuccessContent() {
  const t = useTranslations("checkoutSuccess");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
        <CheckCircle2 size={32} />
      </div>
      <h1 className="mt-6 font-display text-3xl">{t("title")}</h1>
      <p className="mt-3 text-[var(--fg-muted)]">{t("subtitle")}</p>
      {orderNumber && (
        <p className="mt-6 rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-3 text-sm">
          {t("orderNumber")}: <span className="font-medium">{orderNumber}</span>
        </p>
      )}
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="outline">{t("backHome")}</Button>
        </Link>
        <Link href="/shop">
          <Button>{t("continueShopping")}</Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
