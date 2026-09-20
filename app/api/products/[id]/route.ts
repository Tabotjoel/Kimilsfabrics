import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...product,
    images: JSON.parse(product.images || "[]"),
    sizes: JSON.parse(product.sizes || "[]"),
    colors: JSON.parse(product.colors || "[]"),
    createdAt: product.createdAt.toISOString(),
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = productInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
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

  return NextResponse.json(product);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
