import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

// Keep this lazy/tolerant of a missing key so the app can still build and
// pages other than checkout can render before Sally adds her real keys.
export const stripe = secretKey
  ? new Stripe(secretKey, { apiVersion: "2026-08-26.dahlia" })
  : (null as unknown as Stripe);

export function assertStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add your Stripe keys to .env before accepting payments."
    );
  }
}
