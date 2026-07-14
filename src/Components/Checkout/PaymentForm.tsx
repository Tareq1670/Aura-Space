"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Lock } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Props {
  bookingId: string
}

export function PaymentForm({ bookingId }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    })

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.")
      toast.error(stripeError.message ?? "Payment failed.")
      setLoading(false)
      return
    }

    if (paymentIntent?.status === "succeeded") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("property_draft")
      }
      toast.success("Payment successful! Booking confirmed.")
      router.push(`/checkout/success?payment_intent=${paymentIntent.id}`)
    } else {
      toast.error("Payment could not be completed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="rounded-xl border bg-white p-6">
        <div className={loading ? "pointer-events-none opacity-60" : ""}>
          <PaymentElement
            options={{
              layout: {
                type: "tabs",
                defaultCollapsed: false,
              },
            }}
          />
        </div>

        {loading && (
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-emerald-100">
            <div className="h-full w-full animate-pulse rounded-full bg-emerald-500" />
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay with Card
          </>
        )}
      </button>
    </form>
  )
}
