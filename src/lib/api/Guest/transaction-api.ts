import { apiClientFetch } from "@/lib/client-fetch"

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
        return apiClientFetch(`/api/transactions/my-transactions${toQuery(params)}`)
    },

    getHostTransactions(params: Params = {}): Promise<TransactionListResponse> {
        return apiClientFetch(`/api/transactions/host-transactions${toQuery(params)}`)
    },

    getTransactionStats(): Promise<StatsResponse> {
        return apiClientFetch("/api/transactions/stats")
    },

    getAdminTransactions(params: Params = {}): Promise<TransactionListResponse> {
        return apiClientFetch(`/api/admin/transactions${toQuery(params)}`)
    },

    refundBooking(bookingId: string): Promise<SimpleResponse> {
        return apiClientFetch(`/api/transactions/refund/${bookingId}`, { method: "POST" })
    },

    processPayout(transactionId: string): Promise<SimpleResponse> {
        return apiClientFetch("/api/admin/payments/process-payout", {
            method: "POST",
            body: JSON.stringify({ transactionId }),
        })
    },

    requestPayout(): Promise<SimpleResponse> {
        return apiClientFetch("/api/payments/request-payout", { method: "POST" })
    },

    getPayoutHistory(params: Params = {}): Promise<TransactionListResponse> {
        return apiClientFetch(`/api/payments/payout-history${toQuery(params)}`)
    },
}
