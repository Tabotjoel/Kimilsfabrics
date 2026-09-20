"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ProductDTO } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products?all=true");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted.");
      setProducts((p) => p.filter((prod) => prod.id !== id));
    } else {
      toast.error("Failed to delete product.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus size={14} /> Add product
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-elevated)] text-left text-xs uppercase tracking-wide text-[var(--fg-muted)]">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Wardrobe</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--fg-muted)]">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--fg-muted)]">
                  No products yet — add your first piece.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-10 overflow-hidden rounded-sm bg-[var(--bg-elevated)]">
                    <Image
                      src={p.images[0] || "/images/logo-mark.png"}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.nameEn}</p>
                  <p className="text-xs text-[var(--fg-muted)]">{p.nameFr}</p>
                </td>
                <td className="px-4 py-3">{p.audience}</td>
                <td className="px-4 py-3">{formatMoney(p.priceCents, p.currency)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      p.published
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-[var(--bg-elevated)] text-[var(--fg-muted)]"
                    }`}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/products/${p.id}`} className="text-[var(--fg-muted)] hover:text-[var(--accent)]">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-[var(--fg-muted)] hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
