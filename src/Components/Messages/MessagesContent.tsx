"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Search, Send, ArrowLeft, Check, CheckCheck, Clock } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import {
  getConversations,
  getMessages,
  sendMessage,
  markAllAsRead,
  getUnreadCount,
} from "@/lib/actions/message"

interface OtherUser {
  id: string
  name: string
  image?: string | null
}

interface Conversation {
  _id: string
  participants: string[]
  bookingId?: string
  propertyId?: string
  lastMessage?: string
  lastMessageAt?: string
  createdAt: string
  updatedAt: string
  otherUser: OtherUser | null
}

interface MessageItem {
  _id: string
  conversationId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Now"
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

const HOST_QUICK_REPLIES = [
  "Thank you for your inquiry! Let me know if you have any questions.",
  "Yes, the property is available for those dates.",
  "I'd be happy to accommodate your request. See you soon!",
  "Check-in instructions have been sent to your email.",
  "Please let me know your estimated arrival time.",
]

interface MessagesContentProps {
  role: "guest" | "host" | "admin"
}

export default function MessagesContent({ role }: MessagesContentProps) {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id ?? null

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState("")
  const [inputText, setInputText] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")
  const [showQuickReplies, setShowQuickReplies] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeConv = conversations.find((c) => c._id === activeId)

  const filteredConvs = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(search.toLowerCase())
  )

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [convRes, unreadRes] = await Promise.all([getConversations(1, 50), getUnreadCount()])
        if (!mounted) return
        if (convRes.success) {
          const data = convRes.data as { conversations?: Conversation[]; pagination?: Record<string, unknown> }
          const list = data?.conversations ?? (Array.isArray(convRes.data) ? convRes.data : [])
          setConversations(list)
        }
        if (unreadRes.success) {
          const data = unreadRes.data as { unreadCount?: number }
          setUnreadCount(data?.unreadCount ?? 0)
        }
      } catch {
      } finally {
        if (mounted) setLoadingConvs(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!activeId) return
    let mounted = true
    ;(async () => {
      try {
        if (!mounted) return
        const [msgRes] = await Promise.all([
          getMessages(activeId, 1, 50),
          markAllAsRead(activeId).catch(() => {}),
        ])
        if (!mounted) return
        if (msgRes.success) {
          const data = msgRes.data as { messages?: MessageItem[] } | MessageItem[]
          const list = Array.isArray(data) ? data : (data?.messages ?? [])
          if (!mounted) return
          setMessages(list)
          scrollToBottom()
        }
      } catch {
        if (!mounted) return
        toast.error("Failed to load messages")
      }
    })()
    return () => { mounted = false }
  }, [activeId, scrollToBottom])

  useEffect(() => {
    pollingRef.current = setInterval(() => {
      getConversations(1, 50).then((res) => {
        if (res.success) {
          const data = res.data as { conversations?: Conversation[] }
          const list = data?.conversations ?? (Array.isArray(res.data) ? res.data : [])
          setConversations(list)
        }
      }).catch(() => {})
      getUnreadCount().then((res) => {
        if (res.success) {
          const data = res.data as { unreadCount?: number }
          setUnreadCount(data?.unreadCount ?? 0)
        }
      }).catch(() => {})
      if (activeId) {
        getMessages(activeId, 1, 50).then((res) => {
          if (res.success) {
            const data = res.data as { messages?: MessageItem[] } | MessageItem[]
            const list = Array.isArray(data) ? data : (data?.messages ?? [])
            setMessages(list)
            scrollToBottom()
          }
        }).catch(() => {})
      }
    }, 5000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [activeId, scrollToBottom])

  useEffect(() => {
    if (messages.length > 0 && activeId && currentUserId) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.senderId !== currentUserId) {
        markAllAsRead(activeId).catch(() => {})
      }
    }
  }, [messages, activeId, currentUserId])

  function handleSelect(conv: Conversation) {
    setActiveId(conv._id)
    setMobileView("chat")
  }

  async function handleSend() {
    const text = inputText.trim()
    if (!text || !activeId || sending) return
    setSending(true)
    try {
      const res = await sendMessage(activeId, text)
      if (res.success) {
        setInputText("")
        const [msgRes, convRes] = await Promise.all([
          getMessages(activeId, 1, 50),
          getConversations(1, 50),
        ])
        if (msgRes.success) {
          const data = msgRes.data as { messages?: MessageItem[] } | MessageItem[]
          setMessages(Array.isArray(data) ? data : (data?.messages ?? []))
        }
        if (convRes.success) {
          const data = convRes.data as { conversations?: Conversation[] }
          setConversations(data?.conversations ?? (Array.isArray(convRes.data) ? convRes.data : []))
        }
        scrollToBottom()
      } else {
        toast.error(res.error || "Failed to send message")
      }
    } catch {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleQuickReply(reply: string) {
    setInputText(reply)
    setShowQuickReplies(false)
  }

  function handleBack() {
    setMobileView("list")
    setActiveId(null)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-screen">
      <AnimatePresence mode="wait">
        {mobileView === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full border-r border-gray-100 bg-white lg:w-[360px] lg:min-w-[360px] flex flex-col"
          >
            <div className="border-b border-gray-100 p-4">
              <h1 className="text-lg font-bold text-gray-900">Messages</h1>
              {unreadCount > 0 && (
                <p className="mt-0.5 text-xs text-gray-400">{unreadCount} unread</p>
              )}
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400 transition-all hover:border-violet-300 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-gray-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-44 animate-pulse rounded bg-gray-50" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConvs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                    <Search className="h-6 w-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No conversations yet</p>
                  <p className="mt-1 text-xs text-gray-400">Start chatting with a host or guest</p>
                </div>
              ) : (
                filteredConvs.map((conv) => {
                  const isActive = conv._id === activeId
                  return (
                    <button
                      key={conv._id}
                      onClick={() => handleSelect(conv)}
                      className={`flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3.5 text-left transition-colors hover:bg-violet-50/40 ${
                        isActive ? "bg-violet-50" : ""
                      }`}
                    >
                      {conv.otherUser?.image ? (
                        <img
                          src={conv.otherUser.image}
                          alt={conv.otherUser.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-bold text-violet-600">
                          {(conv.otherUser?.name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {conv.otherUser?.name || "Unknown"}
                          </p>
                          {conv.lastMessageAt && (
                            <span className="ml-2 shrink-0 text-xs text-gray-400">
                              {timeAgo(conv.lastMessageAt)}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-sm text-gray-500">
                          {conv.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}

        {mobileView === "chat" && activeConv && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-1 flex-col bg-white lg:flex"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <button
                onClick={handleBack}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              {activeConv.otherUser?.image ? (
                <img
                  src={activeConv.otherUser.image}
                  alt={activeConv.otherUser.name}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-bold text-violet-600">
                  {(activeConv.otherUser?.name || "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {activeConv.otherUser?.name || "Unknown"}
                </p>
                {activeConv.propertyId && (
                  <p className="truncate text-xs text-gray-400">Property conversation</p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Clock className="mx-auto h-10 w-10 text-gray-200" />
                    <p className="mt-3 text-sm text-gray-400">No messages yet</p>
                    <p className="mt-1 text-xs text-gray-300">Send a message to start the conversation</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.senderId === currentUserId
                    return (
                      <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-[75%]">
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              isMine
                                ? "rounded-br-md bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-sm"
                                : "rounded-bl-md border border-gray-100 bg-white text-gray-700 shadow-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className={`mt-1 flex items-center gap-1 px-1 ${isMine ? "justify-end" : "justify-start"}`}>
                            <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
                            {isMine && (
                              msg.isRead
                                ? <CheckCheck className="h-3 w-3 text-blue-500" />
                                : <Check className="h-3 w-3 text-gray-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 bg-white p-4">
              {role === "host" && showQuickReplies && (
                <div className="mb-3 space-y-1.5">
                  {HOST_QUICK_REPLIES.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(reply)}
                      className="block w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-left text-xs text-gray-600 transition-colors hover:border-violet-200 hover:bg-violet-50"
                    >
                      {reply}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowQuickReplies(false)}
                    className="w-full rounded-xl px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-gray-600"
                  >
                    Close suggestions
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="relative flex-1">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-700 outline-none placeholder-gray-400 transition-all hover:border-violet-300 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    style={{ minHeight: 44, maxHeight: 120 }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = "auto"
                      target.style.height = `${Math.min(target.scrollHeight, 120)}px`
                    }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || sending}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl disabled:opacity-50"
                >
                  {sending ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
