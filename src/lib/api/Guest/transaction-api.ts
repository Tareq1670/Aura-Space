import { authClient } from "@/lib/auth-client"

const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== "undefined"
        ? window.location.origin.includes("localhost")
            ? "http://localhost:5000"
            : "https://aura-space-server.vercel.app"
        : "http://localhost:5000")

async function getAuthToken(): Promise<string> {
    try {
        const { data } = await authClient.token()
        if (data?.token) return data.token
        throw new Error("No token from authClient.token()")
    } catch (err) {
        console.error("[getAuthToken] failed:", err)
        throw new Error("Login required.")
    }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await getAuthToken()
    const isFormData = options.body instanceof FormData
    const res = await fetch(`${SERVER_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    })
    const contentType = res.headers.get("content-type") || ""
    const isJson = contentType.includes("application/json")
    const body = isJson ? await res.json() : await res.text()
    if (!res.ok) {
        const message = isJson ? (body.message || body.error || "Something went wrong.") : `HTTP ${res.status}`
        throw new Error(message)
    }
    return body as T
}

export interface TransactionItem {
    _id: string
    userId: string
    bookingId?: string
    type: "payment" | "payout" | "refund" | "commission"
    amount: number
    currency: string
    method: "card" | "bank" | string
    status: "pending" | "success" | "failed" | "refunded"
    transactionId: string
    description?: string
    createdAt: string
}

interface PaginationInfo {
    total: number
    totalPages: number
    currentPage: number
    limit: number
}

interface TransactionListResponse {
    success: boolean
    data: {
        transactions: TransactionItem[]
        pagination: PaginationInfo
    }
}

interface StatsResponse {
    success: boolean
    data: {
        totalSpend?: number
        totalEarned?: number
        commissionEarned?: number
        pendingPayouts?: number
    }
}

interface SimpleResponse {
    success: boolean
    message?: string
    data?: any
}

interface Params {
    page?: number
    limit?: number
    status?: string
    type?: string
    method?: string
    userId?: string
}

function toQuery(params: Params): string {
    const q = new URLSearchParams()
    if (params.page) q.set("page", String(params.page))
    if (params.limit) q.set("limit", String(params.limit))
    if (params.status) q.set("status", params.status)
    if (params.type) q.set("type", params.type)
    if (params.method) q.set("method", params.method)
    if (params.userId) q.set("userId", params.userId)
    const s = q.toString()
    return s ? `?${s}` : ""
}

export const transactionAPI = {
    getMyTransactions(params: Params = {}): Promise<TransactionListResponse> {
        return apiFetch(`/api/transactions/my-transactions${toQuery(params)}`)
    },

    getHostTransactions(params: Params = {}): Promise<TransactionListResponse> {
        return apiFetch(`/api/transactions/host-transactions${toQuery(params)}`)
    },

    getTransactionStats(): Promise<StatsResponse> {
        return apiFetch("/api/transactions/stats")
    },

    getAdminTransactions(params: Params = {}): Promise<TransactionListResponse> {
        return apiFetch(`/api/admin/transactions${toQuery(params)}`)
    },

    refundBooking(bookingId: string): Promise<SimpleResponse> {
        return apiFetch(`/api/transactions/refund/${bookingId}`, { method: "POST" })
    },

    processPayout(transactionId: string): Promise<SimpleResponse> {
        return apiFetch("/api/admin/payments/process-payout", {
            method: "POST",
            body: JSON.stringify({ transactionId }),
        })
    },

    requestPayout(): Promise<SimpleResponse> {
        return apiFetch("/api/payments/request-payout", { method: "POST" })
    },

    getPayoutHistory(params: Params = {}): Promise<TransactionListResponse> {
        return apiFetch(`/api/payments/payout-history${toQuery(params)}`)
    },
}
