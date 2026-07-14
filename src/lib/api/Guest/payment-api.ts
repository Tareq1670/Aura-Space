import { authClient } from "@/lib/auth-client"

const API_BASE = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "") + "/api"

interface PaymentIntentResponse {
  success: boolean
  data?: {
    clientSecret: string
    paymentIntentId: string
  }
  message?: string
}

export async function createPaymentIntent(bookingId: string): Promise<PaymentIntentResponse> {
  const { data: tokenData } = await authClient.token()
  const token = tokenData?.token

  if (!token) {
    throw new Error("Authentication required")
  }

  const res = await fetch(`${API_BASE}/payments/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId }),
  })

  const data: PaymentIntentResponse = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to create payment")
  }

  return data
}
