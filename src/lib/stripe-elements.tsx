"use client"

import { Elements } from "@stripe/react-stripe-js"
import type { StripeElementsOptions } from "@stripe/stripe-js"
import { getStripe } from "@/lib/stripe-client"

interface Props {
  clientSecret: string
  children: React.ReactNode
}

export function StripeElementsProvider({ clientSecret, children }: Props) {
  const stripePromise = getStripe()

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#059669",
        colorBackground: "#ffffff",
        colorText: "#111827",
        colorDanger: "#dc2626",
        fontFamily: "Geist, system-ui, sans-serif",
        borderRadius: "8px",
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
