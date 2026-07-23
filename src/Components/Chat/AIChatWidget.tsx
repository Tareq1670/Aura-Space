"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Sparkles, Trash2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import AIChatMessage from "@/Components/Chat/AIChatMessage"
import { sendChatMessage, deleteChatConversation } from "@/lib/actions/ai"

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { data: session } = authClient.useSession()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

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
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: res.error || "Sorry, I couldn't process that." }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, conversationId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = async () => {
    setMessages([])
    setConversationId(undefined)
    setSuggestions([])
  }

  const handleDeleteChat = async () => {
    if (!conversationId) return
    await deleteChatConversation(conversationId)
    handleNewChat()
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  if (!session) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-violet-500 to-indigo-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="font-semibold text-white text-sm">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                {conversationId && (
                  <button
                    onClick={handleDeleteChat}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleNewChat}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors text-xs"
                  title="New chat"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500">
                  <Sparkles className="w-10 h-10 mb-3 text-violet-500" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Hi! How can I help you?</p>
                  <p className="text-xs mt-1">Ask me about properties, bookings, or navigating the platform.</p>
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
              <div className="px-4 pb-2 flex flex-wrap gap-2">
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

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:shadow-violet-500/30 flex items-center justify-center z-50 transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  )
}
