"use client"

import StatusBadge from "./StatusBadge"
import type { BookingItem } from "@/lib/api/Guest/booking-api"

interface Props {
  booking: BookingItem
  onCancel?: (id: string) => void
  showActions?: boolean
}

export default function BookingCard({ booking, onCancel, showActions = true }: Props) {
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
            <span className="font-semibold text-gray-900">${Number(booking.totalAmount).toFixed(2)}</span>
          </div>

          {showActions && onCancel && booking.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onCancel(booking._id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
