import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  console.log("Webhook endpoint hit");
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log("Has signature:", !!signature, "Has webhookSecret:", !!webhookSecret);

  if (!signature || !webhookSecret) {
    console.log("Missing signature or webhook secret — returning early");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

 try {
  event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
} catch (err) {
  const message = err instanceof Error ? err.message : "Invalid signature";
  return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
}

console.log("Signature verified successfully. Event type:", event.type);

if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentId:
            typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        },
        include: { items: true },
      });

      // Decrement stock for each purchased item (best-effort; floors at 0).
      for (const item of order.items) {
        if (!item.productId) continue;
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: Math.max(0, product.stock - item.quantity) },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
