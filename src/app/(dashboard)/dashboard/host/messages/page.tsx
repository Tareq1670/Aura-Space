import type { Metadata } from "next"
import MessagesContent from "@/Components/Messages/MessagesContent"

export const metadata: Metadata = {
  title: "Messages",
  description: "View and manage your conversations with guests on AuraSpace.",
}

export default function HostMessagesPage() {
  return <MessagesContent role="host" />
}
