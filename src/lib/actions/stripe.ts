"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getApiBase, getSessionToken } from "@/lib/api-base";

const API_BASE = getApiBase();

export async function createCheckoutSession(bookingId: string): Promise<string> {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const token = await getSessionToken();

    const authHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        headers: authHeaders,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch booking details");
    }

    const data = await res.json();
    const booking = data?.data;

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Get user session to prefill name and email in Stripe Checkout
    const userSession = await (auth.api as any).getSession({ headers: headersList });
    const userEmail = userSession?.user?.email;
    const userName = userSession?.user?.name;

    // Find or create a Stripe Customer for this user to prefill their details
    let customerId: string | undefined;
    if (userEmail) {
        const existing = await stripe.customers.list({ email: userEmail, limit: 1 });
        if (existing.data.length > 0) {
            customerId = existing.data[0].id;
        } else {
            const customer = await stripe.customers.create({
                email: userEmail,
                name: userName || undefined,
                metadata: { bookingId },
            });
            customerId = customer.id;
        }
    }

    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded_page",
        ...(customerId ? { customer: customerId } : { customer_email: userEmail }),
        line_items: [
            {
                price_data: {
                    currency: (process.env.NEXT_PUBLIC_STRIPE_CURRENCY || "usd").toLowerCase(),
                    product_data: {
                        name: booking.propertyTitle || "StayEase Booking",
                        images: booking.propertyImage ? [booking.propertyImage] : [],
                    },
                    unit_amount: Math.round(booking.totalAmount * 100),
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
            bookingId,
        },
    });

    if (!session.client_secret) {
        throw new Error("Failed to get client secret from Stripe");
    }

    return session.client_secret;
}
