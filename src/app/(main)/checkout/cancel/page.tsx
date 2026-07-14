import Link from "next/link"

export default function CancelPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold">Payment Cancelled</h1>
        <p className="mb-8 text-gray-600">
          Your payment was not processed. No charges have been made.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/checkout"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold transition hover:bg-emerald-700"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
