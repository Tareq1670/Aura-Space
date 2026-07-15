import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getApiBase, getAuthHeaders, getSessionToken } from "@/lib/api-base"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const propertyId = formData.get("propertyId") as string
    const checkIn = formData.get("checkIn") as string
    const checkOut = formData.get("checkOut") as string
    const guests = formData.get("guests") as string
    const specialRequest = formData.get("specialRequest") as string

    if (!propertyId || !checkIn || !checkOut || !guests) {
      return NextResponse.redirect(
        new URL("/checkout?error=missing_fields", req.url)
      )
    }

    const session = await (auth.api as any).getSession({
      headers: await headers(),
    })
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login?redirect=/checkout", req.url))
    }

    const token = await getSessionToken()

    const bookingRes = await fetch(`${getApiBase()}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        propertyId,
        checkIn,
        checkOut,
        numberOfGuests: Number(guests),
        specialRequest: specialRequest || "",
      }),
    })

    const bookingData = await bookingRes.json()
    if (!bookingRes.ok) {
      const errorMsg = bookingData?.message || bookingData?.error || "Failed to create booking"
      return NextResponse.redirect(
        new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url)
      )
    }

    const booking = bookingData?.data?.booking || bookingData?.data

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: (process.env.NEXT_PUBLIC_STRIPE_CURRENCY || process.env.STRIPE_CURRENCY || "usd").toLowerCase(),
            product_data: {
              name: booking.propertyTitle || "Property Booking",
              images: booking.propertyImage ? [booking.propertyImage] : [],
            },
            unit_amount: Math.round(booking.totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id || booking._id,
        propertyId: booking.propertyId,
        guestId: session.user.id,
      },
      success_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/checkout/cancel`,
      customer_email: session.user.email || undefined,
    })

    return NextResponse.redirect(checkoutSession.url!, 303)
  } catch (error) {
    console.error("Checkout session error:", error)
    return NextResponse.redirect(
      new URL("/checkout?error=server_error", req.url)
    )
  }
}
