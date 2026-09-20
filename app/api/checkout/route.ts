import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, assertStripeConfigured } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

const checkoutSchema = z.object({
  locale: z.enum(["en", "fr"]).default("en"),
  customer: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().default("CA"),
    notes: z.string().optional(),
  }),
  lines: z
    .array(
      z.object({
        productId: z.string(),
        size: z.string().nullable(),
        color: z.string().nullable(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

function calcShippingCents(subtotalCents: number) {
  if (subtotalCents >= 20000) return 0; // free shipping over $200 CAD
  return 1500; // flat $15 CAD
}

export async function POST(request: NextRequest) {
  try {
    assertStripeConfigured();
  } catch {
    return NextResponse.json(
      {
        error:
          "Payments are not configured yet. Add STRIPE_SECRET_KEY to the environment to enable checkout.",
      },
      { status: 503 }
    );
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { locale, customer, lines } = parsed.data;

  const productIds = [...new Set(lines.map((l) => l.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const orderItemsData = [];
  const stripeLineItems = [];
  let subtotalCents = 0;

  for (const line of lines) {
    const product = productMap.get(line.productId);
    if (!product || !product.published) {
      return NextResponse.json({ error: `Product unavailable: ${line.productId}` }, { status: 400 });
    }
    const images: string[] = JSON.parse(product.images || "[]");
    const unitCents = product.priceCents;
    subtotalCents += unitCents * line.quantity;

    orderItemsData.push({
      productId: product.id,
      nameEn: product.nameEn,
      nameFr: product.nameFr,
      size: line.size,
      color: line.color,
      unitCents,
      quantity: line.quantity,
      imageUrl: images[0] ?? null,
    });

    stripeLineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: locale === "fr" ? product.nameFr : product.nameEn,
          images: images[0] ? [images[0]] : undefined,
          metadata: { productId: product.id },
        },
        unit_amount: unitCents,
      },
      quantity: line.quantity,
    });
  }

  const shippingCents = calcShippingCents(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName: customer.fullName,
      customerEmail: customer.email,
      shippingAddress: customer.address,
      shippingCity: customer.city,
      shippingProvince: customer.province,
      shippingPostal: customer.postalCode,
      shippingCountry: customer.country,
      phone: customer.phone,
      notes: customer.notes,
      currency: "CAD",
      subtotalCents,
      shippingCents,
      totalCents,
      status: "PENDING",
      items: { create: orderItemsData },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customer.email,
    line_items: [
      ...stripeLineItems,
      ...(shippingCents > 0
        ? [
            {
              price_data: {
                currency: "cad",
                product_data: { name: locale === "fr" ? "Livraison" : "Shipping" },
                unit_amount: shippingCents,
              },
              quantity: 1,
            },
          ]
        : []),
    ],
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    success_url: `${siteUrl}/${locale}/checkout/success?order=${order.orderNumber}`,
    cancel_url: `${siteUrl}/${locale}/cart`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
