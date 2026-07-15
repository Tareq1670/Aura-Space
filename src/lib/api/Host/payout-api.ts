import { apiClientFetch } from "@/lib/client-fetch"

export interface PayoutMethod {
  id: string
  accountHolder: string
  bankName: string
  accountNumber: string
  routingNumber: string
  swiftCode: string
  bankAddress: string
  createdAt: string
  updatedAt: string
}

export async function getPayoutMethod(): Promise<{ success: boolean; data: PayoutMethod | null }> {
  return apiClientFetch<{ success: boolean; data: PayoutMethod | null }>("/api/payments/payout-method")
}

export async function savePayoutMethod(body: {
  accountHolder: string
  bankName: string
  accountNumber: string
  routingNumber?: string
  swiftCode?: string
  bankAddress?: string
}): Promise<{ success: boolean; message: string }> {
  return apiClientFetch<{ success: boolean; message: string }>("/api/payments/payout-method", {
    method: "PUT",
    body: JSON.stringify(body),
  })
}
