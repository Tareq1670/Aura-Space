"use client"

import { useEffect, useState, useRef } from "react"
import { authClient } from "@/lib/auth-client"
import { StripeElementsProvider } from "@/lib/stripe-elements"
import { PaymentForm } from "@/Components/Checkout/PaymentForm"
import { Skeleton } from "@heroui/react"

interface Props {
  propertyId: string
  checkIn: string
  checkOut: string
  guests: number
  specialRequest?: string
}

type Step = "creating" | "error" | "ready"

const API_BASE = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "") + "/api"

export function CheckoutPaymentWrapper({ propertyId, checkIn, checkOut, guests, specialRequest }: Props) {
  const [step, setStep] = useState<Step>("creating")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    async function init() {
      try {
        const { data: tokenData } = await authClient.token()
        const token = tokenData?.token
        if (!token) throw new Error("Authentication required")

        const bookingRes = await fetch(`${API_BASE}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId,
            checkIn,
            checkOut,
            numberOfGuests: guests,
            specialRequest: specialRequest || "",
          }),
        })

        const bookingData = await bookingRes.json()
        if (!bookingRes.ok) {
          throw new Error(bookingData?.message || bookingData?.error || "Failed to create booking")
        }

        const booking = bookingData?.data?.booking || bookingData?.data
        const newBookingId = booking?.id || booking?._id
        if (!newBookingId) throw new Error("No booking ID returned")

        setBookingId(newBookingId)

        const piRes = await fetch(`${API_BASE}/payments/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId: newBookingId }),
        })

        const piData = await piRes.json()
        if (!piRes.ok || !piData?.data?.clientSecret) {
          throw new Error(piData?.message || "Failed to initialize payment")
        }

        setClientSecret(piData.data.clientSecret)
        setStep("ready")
      } catch (err: any) {
        setErrorMsg(err.message || "Something went wrong")
        setStep("error")
      }
    }

    init()
  }, [propertyId, checkIn, checkOut, guests, specialRequest])

  if (step === "creating") {
    return (
      <div className="mt-4 space-y-4">
        <div className="rounded-xl border bg-white p-6">
          <Skeleton className="mb-4 h-6 w-3/4 rounded-lg" />
          <Skeleton className="mb-3 h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (step === "error") {
    return (
      <div className="mt-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 w-full rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold transition hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!clientSecret || !bookingId) return null

  return (
    <StripeElementsProvider clientSecret={clientSecret}>
      <PaymentForm bookingId={bookingId} />
    </StripeElementsProvider>
  )
}
