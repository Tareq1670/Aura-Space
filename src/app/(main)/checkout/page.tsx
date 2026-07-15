import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/route-guards"
import { getApiBase } from "@/lib/api-base"
import { formatCurrency } from "@/lib/currency"
import { CheckoutPaymentWrapper } from "@/Components/Checkout/CheckoutPaymentWrapper"

interface PageProps {
  searchParams: Promise<{ propertyId?: string; checkIn?: string; checkOut?: string; guests?: string; error?: string }>
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const { propertyId, checkIn, checkOut, guests, error } = await searchParams

  if (!propertyId || !checkIn || !checkOut || !guests) {
    return redirect("/")
  }

  await requireAuth()

  let property: Record<string, any> | null = null
  try {
    const res = await fetch(`${getApiBase()}/properties/${propertyId}`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      property = data?.data?.property ?? null
    }
  } catch {
    // backend unreachable — fall through to notFound
  }

  if (!property) return notFound()

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
  const pricePerNight = property.price?.perNight || property.price || 0
  const subtotal = pricePerNight * nights
  const cleaningFee = property.price?.cleaningFee || 0
  const serviceFee = property.price?.serviceFee || 0

  // Apply weekly/monthly discounts
  const weeklyDiscountPct = property.price?.weeklyDiscount || 0
  const monthlyDiscountPct = property.price?.monthlyDiscount || 0
  let discountPercent = 0
  if (nights >= 28 && monthlyDiscountPct > 0) {
    discountPercent = monthlyDiscountPct
  } else if (nights >= 7 && weeklyDiscountPct > 0) {
    discountPercent = weeklyDiscountPct
  }
  const discountAmount = Math.round(subtotal * discountPercent / 100)
  const discountedSubtotal = subtotal - discountAmount
  const total = discountedSubtotal + cleaningFee + serviceFee

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error === "missing_fields" && "Missing required fields. Please try again."}
            {error === "server_error" && "Something went wrong. Please try again."}
            {error !== "missing_fields" && error !== "server_error" && error}
          </div>
        )}

        <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Booking Details</h2>

              <div className="mb-6 flex gap-4">
                <div className="h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={property.images?.[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-500">
                    {property.location?.city}, {property.location?.country}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span>{property.rating?.toFixed(1) || "New"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-medium">{checkInDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-medium">{checkOutDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{guests}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Price Breakdown</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{formatCurrency(pricePerNight)} x {nights} nights</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{discountPercent}% {nights >= 28 ? "Monthly" : "Weekly"} discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span>{formatCurrency(cleaningFee)}</span>
                  </div>
                )}
                {serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span>{formatCurrency(serviceFee)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <CheckoutPaymentWrapper
              propertyId={propertyId}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={Number(guests)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
