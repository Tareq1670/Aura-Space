"use client"

import StatusBadge from "./StatusBadge"
import type { BookingItem } from "@/lib/api/Guest/booking-api"
import { formatCurrency } from "@/lib/currency"

interface Props {
  booking: BookingItem
  onCancel?: (id: string) => void
  onMessage?: (booking: BookingItem) => void
  messageLoading?: boolean
  showActions?: boolean
}

export default function BookingCard({ booking, onCancel, onMessage, messageLoading, showActions = true }: Props) {
  const checkIn = new Date(booking.checkIn)
  const checkOut = new Date(booking.checkOut)
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex gap-4">
        <div className="h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={booking.propertyImage || "/placeholder.svg"}
            alt={booking.propertyTitle}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900">{booking.propertyTitle}</h3>
              <StatusBadge status={booking.status} />
            </div>
            {booking.property?.location && (
              <p className="mt-0.5 text-sm text-gray-500">
                {[booking.property.location.city, booking.property.location.country].filter(Boolean).join(", ")}
              </p>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>
              {checkIn.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" — "}
              {checkOut.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span>{nights} night{nights !== 1 ? "s" : ""}</span>
            <span className="font-semibold text-gray-900">{formatCurrency(Number(booking.totalAmount))}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {showActions && onMessage && (
              <button
                onClick={() => onMessage(booking)}
                disabled={messageLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-50 active:scale-[0.97] disabled:opacity-50"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                Message Host
              </button>
            )}
            {showActions && onCancel && booking.status === "pending" && (
              <button
                onClick={() => onCancel(booking._id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
