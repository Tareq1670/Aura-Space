import { redirect } from "next/navigation"
import { stripe } from "@/lib/stripe"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ session_id?: string; payment_intent?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id, payment_intent } = await searchParams

  if (!session_id && !payment_intent) {
    redirect("/")
  }

  let session;
  try {
    if (session_id) {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "payment_intent"],
      })
    } else if (payment_intent) {
      const pi = await stripe.paymentIntents.retrieve(payment_intent)
      if (pi.status !== "succeeded") redirect("/")
      session = {
        id: pi.id,
        status: "complete",
        customer_details: { email: pi.receipt_email },
        amount_total: pi.amount,
        metadata: pi.metadata || {},
        currency: pi.currency,
      }
    }
  } catch {
    redirect("/")
  }

  if (!session || session.status === "open") {
    redirect("/")
  }

  const customerEmail = session.customer_details?.email
  const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : null
  const bookingId = session.metadata?.bookingId

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
        <p className="mb-6 text-gray-600">Thank you for your booking.</p>

        <div className="mb-8 rounded-xl border bg-white p-6 text-left text-sm">
          {bookingId && (
            <div className="mb-3 flex justify-between">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono font-medium">{bookingId}</span>
            </div>
          )}
          {amountTotal && (
            <div className="mb-3 flex justify-between">
              <span className="text-gray-500">Total paid</span>
              <span className="font-medium">${amountTotal}</span>
            </div>
          )}
          {customerEmail && (
            <div className="flex justify-between">
              <span className="text-gray-500">Confirmation sent to</span>
              <span className="font-medium">{customerEmail}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/guest/bookings"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold transition hover:bg-emerald-700"
          >
            View My Bookings
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
