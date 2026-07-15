"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Skeleton } from "@heroui/react"
import { authClient } from "@/lib/auth-client"
import { createCheckoutSession } from "@/lib/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const API_BASE = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "") + "/api"

interface Props {
  propertyId: string
  checkIn: string
  checkOut: string
  guests: number
  specialRequest?: string
}

export function CheckoutPaymentWrapper({ propertyId, checkIn, checkOut, guests, specialRequest }: Props) {
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
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
        const id = booking?.id || String(booking?._id || "")
        if (!id) throw new Error("No booking ID returned")

        setBookingId(id)
      } catch (err) {
        setError((err as Error)?.message || "Something went wrong")
      }
    }

    init()
  }, [propertyId, checkIn, checkOut, guests, specialRequest])

  const fetchClientSecret = useCallback(async () => {
    if (!bookingId) throw new Error("Booking not created yet")
    return createCheckoutSession(bookingId)
  }, [bookingId])

  if (error) {
    return (
      <div className="mt-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
        <button
          onClick={() => {
            started.current = false
            setError(null)
            setBookingId(null)
          }}
          className="mt-3 w-full rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold transition hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!bookingId) {
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

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
