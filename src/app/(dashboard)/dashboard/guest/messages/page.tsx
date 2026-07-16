import type { Metadata } from "next"
import MessagesContent from "@/Components/Messages/MessagesContent"

export const metadata: Metadata = {
  title: "Messages",
  description: "View and manage your conversations with hosts on AuraSpace.",
}

export default function GuestMessagesPage() {
  return <MessagesContent role="guest" />
}
