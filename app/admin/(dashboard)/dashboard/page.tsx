import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingCart, Clock, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? "Sally";

  const [productCount, orderCount, pendingCount, paidOrders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({ where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"] } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const revenueCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);

  const stats = [
    { label: "Products", value: productCount, icon: Package },
    { label: "Orders", value: orderCount, icon: ShoppingCart },
    { label: "Pending orders", value: pendingCount, icon: Clock },
    { label: "Revenue (paid)", value: formatMoney(revenueCents, "CAD"), icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl">Welcome back, {name}</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel-elevated rounded-sm p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-[var(--fg-muted)]">{s.label}</p>
              <s.icon size={16} className="text-[var(--accent-2)]" />
            </div>
            <p className="mt-2 font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-[var(--accent)] hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-sm border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-elevated)] text-left text-xs uppercase tracking-wide text-[var(--fg-muted)]">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[var(--fg-muted)]">
                    No orders yet.
                  </td>
                </tr>
              )}
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-[var(--accent)] hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-xs">{o.status}</span>
                  </td>
                  <td className="px-4 py-3">{formatMoney(o.totalCents, o.currency)}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">
                    {new Date(o.createdAt).toLocaleDateString("en-CA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
