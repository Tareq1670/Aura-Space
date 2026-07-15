import { authClient } from "@/lib/auth-client"

const API_BASE = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "") + "/api"

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
  const { data: tokenData } = await authClient.token()
  const token = tokenData?.token
  if (!token) throw new Error("Authentication required")

  const res = await fetch(`${API_BASE}/payments/payout-method`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function savePayoutMethod(body: {
  accountHolder: string
  bankName: string
  accountNumber: string
  routingNumber?: string
  swiftCode?: string
  bankAddress?: string
}): Promise<{ success: boolean; message: string }> {
  const { data: tokenData } = await authClient.token()
  const token = tokenData?.token
  if (!token) throw new Error("Authentication required")

  const res = await fetch(`${API_BASE}/payments/payout-method`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  return res.json()
}
