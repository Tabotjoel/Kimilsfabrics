import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const productInput = z.object({
  nameEn: z.string().min(1),
  nameFr: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionFr: z.string().min(1),
  audience: z.enum(["WOMEN", "MEN", "UNISEX"]),
  priceCents: z.number().int().positive(),
  compareAtCents: z.number().int().positive().nullable().optional(),
  images: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  fabric: z.string().nullable().optional(),
  leadTimeDays: z.number().int().nullable().optional(),
  stock: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  categoryId: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const audience = searchParams.get("audience");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const includeUnpublished = searchParams.get("all") === "true";
  const sort = searchParams.get("sort");

  const session = includeUnpublished ? await auth() : null;
  const canSeeAll = includeUnpublished && session?.user;

  const where: Record<string, unknown> = canSeeAll ? {} : { published: true };
  if (audience && ["WOMEN", "MEN", "UNISEX"].includes(audience)) {
    where.audience = audience;
  }
  if (category) {
    where.category = { slug: category };
  }
  if (featured === "true") {
    where.featured = true;
  }

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { priceCents: "asc" };
  if (sort === "price-desc") orderBy = { priceCents: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });

  const formatted = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
    sizes: JSON.parse(p.sizes || "[]"),
    colors: JSON.parse(p.colors || "[]"),
    createdAt: p.createdAt.toISOString(),
  }));

  return NextResponse.json(formatted);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  let slug = slugify(data.nameEn);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-5)}`;
  }

  const product = await prisma.product.create({
    data: {
      slug,
      nameEn: data.nameEn,
      nameFr: data.nameFr,
      descriptionEn: data.descriptionEn,
      descriptionFr: data.descriptionFr,
      audience: data.audience,
      priceCents: data.priceCents,
      compareAtCents: data.compareAtCents ?? null,
      images: JSON.stringify(data.images),
      sizes: JSON.stringify(data.sizes),
      colors: JSON.stringify(data.colors),
      fabric: data.fabric ?? null,
      leadTimeDays: data.leadTimeDays ?? null,
      stock: data.stock,
      featured: data.featured,
      published: data.published,
      categoryId: data.categoryId ?? null,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
