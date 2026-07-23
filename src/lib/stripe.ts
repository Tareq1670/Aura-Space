import "server-only"
import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripeServer(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set. Stripe payments will not work.")
    }
    _stripe = new Stripe(key)
  }
  return _stripe
}
