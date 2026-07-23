"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Send, Trash2, Plus, MessageSquare, Bot } from "lucide-react"
import { toast } from "sonner"
import AIChatMessage from "@/Components/Chat/AIChatMessage"
import { sendChatMessage, getChatHistory, deleteChatConversation, type ChatConversationSummary } from "@/lib/actions/ai"
import { cn } from "@/lib/utils/cn"

export default function AIChatPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [conversations, setConversations] = useState<ChatConversationSummary[]>([])
  const [sidebarOpen] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const loadConversations = useCallback(async () => {
    const res = await getChatHistory()
    if (res.success && res.data?.conversations) {
      setConversations(res.data.conversations)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConversations()
  }, [loadConversations])

  const loadConversation = useCallback(async (id: string) => {
    const res = await getChatHistory(id)
    if (res.success && res.data?.messages) {
      setMessages(res.data.messages.map((m) => ({ role: m.role, content: m.content })))
      setConversationId(id)
      setSuggestions([])
    }
  }, [])

  const handleSend = useCallback(async () => {
    const msg = input.trim()
    if (!msg || isLoading) return

    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: msg }])
    setIsLoading(true)
    setSuggestions([])

    try {
      const res = await sendChatMessage(msg, conversationId)
      if (res.success && res.data) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.data!.reply }])
        setConversationId(res.data.conversationId)
        setSuggestions(res.data.suggestions || [])
        loadConversations()
      } else {
        toast.error(res.error || "Failed to send message")
        setMessages((prev) => [...prev, { role: "assistant", content: res.error || "Sorry, I couldn't process that." }])
      }
    } catch {
      toast.error("Network error")
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, conversationId, loadConversations])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setConversationId(undefined)
    setSuggestions([])
  }

  const handleDeleteChat = async (id: string) => {
    await deleteChatConversation(id)
    if (conversationId === id) handleNewChat()
    loadConversations()
    toast.success("Conversation deleted")
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6">
      {sidebarOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          className="border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col flex-shrink-0"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleNewChat}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((c) => (
              <div
                key={c.conversationId}
                role="button"
                tabIndex={0}
                onClick={() => loadConversation(c.conversationId)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") loadConversation(c.conversationId) }}
                className={cn(
                  "w-full p-3 rounded-xl text-left text-sm transition-colors group flex items-center justify-between cursor-pointer",
                  conversationId === c.conversationId
                    ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate text-xs">{c.lastMessage || "New conversation"}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteChat(c.conversationId) }}
                  className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {conversations.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">No conversations yet</p>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Assistant</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Ask me about finding properties, managing bookings, or navigating the platform.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-6 max-w-sm">
                {["Find apartments in Dhaka under 5000", "How do I cancel a booking?", "Show me luxury villas", "How to become a host?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50) }}
                    className="p-3 rounded-xl text-xs text-left bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <AIChatMessage key={i} role={msg.role} content={msg.content} />
            ))
          )}
          {isLoading && <AIChatMessage role="assistant" content="" isTyping />}
          <div ref={messagesEndRef} />
        </div>

        {suggestions.length > 0 && !isLoading && (
          <div className="px-6 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors border border-gray-200 dark:border-gray-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
