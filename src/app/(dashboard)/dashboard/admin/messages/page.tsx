import type { Metadata } from "next"
import MessagesContent from "@/Components/Messages/MessagesContent"

export const metadata: Metadata = {
  title: "Messages",
  description: "View and manage platform-wide conversations on AuraSpace.",
}

export default function AdminMessagesPage() {
  return <MessagesContent role="admin" />
}
