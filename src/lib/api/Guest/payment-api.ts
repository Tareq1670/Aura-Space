import { apiClientFetch } from "@/lib/client-fetch"

interface PaymentIntentResponse {
  success: boolean
  data?: {
    clientSecret: string
    paymentIntentId: string
  }
  message?: string
}

export async function createPaymentIntent(bookingId: string): Promise<PaymentIntentResponse> {
  return apiClientFetch<PaymentIntentResponse>("/api/payments/create-payment-intent", {
    method: "POST",
    body: JSON.stringify({ bookingId }),
  })
}
