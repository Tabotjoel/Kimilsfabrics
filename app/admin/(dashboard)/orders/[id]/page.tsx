import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

interface Props {
  params: Promise<{ id: string }>;
}

interface OrderItemRow {
  id: string;
  nameEn: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unitCents: number;
  imageUrl: string | null;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]">
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">Order {order.orderNumber}</h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg">Items</h2>
          <div className="mt-3 divide-y divide-[var(--border)] rounded-sm border border-[var(--border)]">
            {(order.items as OrderItemRow[]).map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-[var(--bg-elevated)]">
                  <Image
                    src={item.imageUrl || "/images/logo-mark.png"}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.nameEn}</p>
                  <p className="text-xs text-[var(--fg-muted)]">
                    {[item.size, item.color].filter(Boolean).join(" · ")} · Qty {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatMoney(item.unitCents * item.quantity, order.currency)}</p>
              </div>
            ))}
          </div>

          {order.notes && (
            <div className="mt-6">
              <h2 className="font-display text-lg">Order notes</h2>
              <p className="mt-2 rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="panel-elevated rounded-sm p-5">
            <h2 className="font-display text-base">Customer</h2>
            <p className="mt-2 text-sm">{order.customerName}</p>
            <p className="text-sm text-[var(--fg-muted)]">{order.customerEmail}</p>
            {order.phone && <p className="text-sm text-[var(--fg-muted)]">{order.phone}</p>}
          </div>

          <div className="panel-elevated rounded-sm p-5">
            <h2 className="font-display text-base">Shipping address</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              {order.shippingAddress}
              <br />
              {order.shippingCity}, {order.shippingProvince} {order.shippingPostal}
              <br />
              {order.shippingCountry}
            </p>
          </div>

          <div className="panel-elevated rounded-sm p-5">
            <h2 className="font-display text-base">Summary</h2>
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--fg-muted)]">Subtotal</span>
                <span>{formatMoney(order.subtotalCents, order.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--fg-muted)]">Shipping</span>
                <span>{formatMoney(order.shippingCents, order.currency)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-1.5 font-medium">
                <span>Total</span>
                <span>{formatMoney(order.totalCents, order.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
