"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductAudience } from "@/lib/types";

interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameFr: string;
}

export interface ProductFormValues {
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  audience: ProductAudience;
  priceCents: number;
  compareAtCents: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  fabric: string;
  leadTimeDays: number | null;
  stock: number;
  featured: boolean;
  published: boolean;
  categoryId: string | null;
}

const emptyValues: ProductFormValues = {
  nameEn: "",
  nameFr: "",
  descriptionEn: "",
  descriptionFr: "",
  audience: "UNISEX",
  priceCents: 0,
  compareAtCents: null,
  images: [],
  sizes: [],
  colors: [],
  fabric: "",
  leadTimeDays: null,
  stock: 0,
  featured: false,
  published: true,
  categoryId: null,
};

export function ProductForm({
  productId,
  initialValues,
}: {
  productId?: string;
  initialValues?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<ProductFormValues>({ ...emptyValues, ...initialValues });
  const [sizesInput, setSizesInput] = useState((initialValues?.sizes ?? []).join(", "));
  const [colorsInput, setColorsInput] = useState((initialValues?.colors ?? []).join(", "));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploaded.push(data.url);
      }
      set("images", [...values.images, ...uploaded]);
      toast.success(`${uploaded.length} photo(s) uploaded.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    set("images", values.images.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...values,
      sizes: sizesInput.split(",").map((s) => s.trim()).filter(Boolean),
      colors: colorsInput.split(",").map((c) => c.trim()).filter(Boolean),
      fabric: values.fabric || null,
    };

    try {
      const res = await fetch(productId ? `/api/products/${productId}` : "/api/products", {
        method: productId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data.error));
      toast.success("Product saved.");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Could not save product. Check all required fields.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]";
  const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--fg-muted)]";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Photos */}
      <section>
        <label className={labelClass}>Product photos</label>
        <div className="flex flex-wrap gap-3">
          {values.images.map((img) => (
            <div key={img} className="relative h-24 w-20 overflow-hidden rounded-sm border border-[var(--border)]">
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)]"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            <span className="text-[10px]">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </section>

      {/* Names & descriptions */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name (English)</label>
          <input required className={inputClass} value={values.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Name (French)</label>
          <input required className={inputClass} value={values.nameFr} onChange={(e) => set("nameFr", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Description (English)</label>
          <textarea required rows={3} className={inputClass} value={values.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Description (French)</label>
          <textarea required rows={3} className={inputClass} value={values.descriptionFr} onChange={(e) => set("descriptionFr", e.target.value)} />
        </div>
      </section>

      {/* Pricing & inventory */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Price (CAD)</label>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={values.priceCents ? (values.priceCents / 100).toString() : ""}
            onChange={(e) => set("priceCents", Math.round(parseFloat(e.target.value || "0") * 100))}
          />
        </div>
        <div>
          <label className={labelClass}>Compare-at price (optional)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={values.compareAtCents ? (values.compareAtCents / 100).toString() : ""}
            onChange={(e) =>
              set("compareAtCents", e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null)
            }
          />
        </div>
        <div>
          <label className={labelClass}>Stock quantity</label>
          <input
            required
            type="number"
            min={0}
            className={inputClass}
            value={values.stock}
            onChange={(e) => set("stock", parseInt(e.target.value || "0", 10))}
          />
        </div>
        <div>
          <label className={labelClass}>Wardrobe</label>
          <select className={inputClass} value={values.audience} onChange={(e) => set("audience", e.target.value as ProductAudience)}>
            <option value="WOMEN">Women</option>
            <option value="MEN">Men</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={values.categoryId ?? ""}
            onChange={(e) => set("categoryId", e.target.value || null)}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Lead time (days)</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={values.leadTimeDays ?? ""}
            onChange={(e) => set("leadTimeDays", e.target.value ? parseInt(e.target.value, 10) : null)}
          />
        </div>
      </section>

      {/* Variants */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Sizes (comma-separated)</label>
          <input
            className={inputClass}
            placeholder="S, M, L, XL"
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Colours (comma-separated)</label>
          <input
            className={inputClass}
            placeholder="Burgundy, Gold, Ivory"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Fabric</label>
          <input className={inputClass} value={values.fabric} onChange={(e) => set("fabric", e.target.value)} />
        </div>
      </section>

      {/* Flags */}
      <section className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.featured} onChange={(e) => set("featured", e.target.checked)} />
          Feature on homepage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.published} onChange={(e) => set("published", e.target.checked)} />
          Published (visible on site)
        </label>
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save product"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
