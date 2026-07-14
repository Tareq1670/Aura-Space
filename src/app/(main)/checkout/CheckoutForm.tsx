"use client"

interface Props {
  propertyId: string
  checkIn: string
  checkOut: string
  guests: string
}

export function CheckoutForm({ propertyId, checkIn, checkOut, guests }: Props) {
  return (
    <form action="/api/checkout_sessions" method="POST" className="mt-4">
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="checkIn" value={checkIn} />
      <input type="hidden" name="checkOut" value={checkOut} />
      <input type="hidden" name="guests" value={guests} />

      <div className="mb-4">
        <label htmlFor="specialRequest" className="mb-1 block text-sm font-medium text-gray-700">
          Special request (optional)
        </label>
        <textarea
          id="specialRequest"
          name="specialRequest"
          rows={3}
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="Anything the host should know..."
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold transition hover:bg-emerald-700"
      >
        Pay with Stripe
      </button>
    </form>
  )
}
