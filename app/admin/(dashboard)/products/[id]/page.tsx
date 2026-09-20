import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">Edit product</h1>
      <div className="mt-6">
        <ProductForm
          productId={product.id}
          initialValues={{
            nameEn: product.nameEn,
            nameFr: product.nameFr,
            descriptionEn: product.descriptionEn,
            descriptionFr: product.descriptionFr,
            audience: product.audience,
            priceCents: product.priceCents,
            compareAtCents: product.compareAtCents,
            images: JSON.parse(product.images || "[]"),
            sizes: JSON.parse(product.sizes || "[]"),
            colors: JSON.parse(product.colors || "[]"),
            fabric: product.fabric ?? "",
            leadTimeDays: product.leadTimeDays,
            stock: product.stock,
            featured: product.featured,
            published: product.published,
            categoryId: product.categoryId,
          }}
        />
      </div>
    </div>
  );
}
