import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Processing Payment",
  description: "Processing your payment confirmation. Please wait while we verify your booking on AuraSpace.",
}
import { stripe } from "@/lib/stripe"

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function ReturnPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect("/")
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch {
    redirect("/")
  }

  if (session.status === "complete") {
    redirect(`/checkout/success?session_id=${session_id}`)
  }

  redirect("/")
}
