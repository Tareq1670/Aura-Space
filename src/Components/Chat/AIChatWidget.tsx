"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Sparkles, Trash2, LogIn, RotateCw } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import AIChatMessage from "@/Components/Chat/AIChatMessage"
import { sendChatMessage, deleteChatConversation } from "@/lib/actions/ai"

const QUICK_ACTIONS = [
  "Find apartments in Dhaka",
  "How do I book a property?",
  "Show luxury villas",
  "How to become a host?",
]

interface ChatMsg {
  role: "user" | "assistant"
  content: string
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showRetryBtn, setShowRetryBtn] = useState(false)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { data: session, isPending } = authClient.useSession()

  const isLoggedIn = !!session

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

  const doSend = useCallback(async (msg: string) => {
    setMessages((prev) => [...prev, { role: "user", content: msg }])
    setIsLoading(true)
    setSuggestions([])
    setShowRetryBtn(false)

    try {
      const res = await sendChatMessage(msg, conversationId)
      if (res.success && res.data) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.data!.reply }])
        setConversationId(res.data.conversationId ?? undefined)
        setSuggestions(res.data.suggestions || [])
        setLastFailedMessage(null)
      } else {
        if (res.statusCode === 429) {
          setLastFailedMessage(msg)
          setShowRetryBtn(true)
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: res.error || "Sorry, something went wrong. Please try again." }])
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Check your connection and try again." }])
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  const handleSend = useCallback(async () => {
    const msg = input.trim()
    if (!msg || isLoading) return
    setInput("")
    await doSend(msg)
  }, [input, isLoading, doSend])

  const handleRetry = useCallback(async () => {
    if (!lastFailedMessage || isLoading) return
    const msg = lastFailedMessage
    setShowRetryBtn(false)
    setLastFailedMessage(null)
    await doSend(msg)
  }, [lastFailedMessage, isLoading, doSend])

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
    setShowRetryBtn(false)
    setLastFailedMessage(null)
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

  const handleQuickAction = (action: string) => {
    setInput(action)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

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
                {isLoggedIn && conversationId && (
                  <button
                    onClick={handleDeleteChat}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {isLoggedIn && (
                  <button
                    onClick={handleNewChat}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors text-xs"
                    title="New chat"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isPending && !isLoggedIn && (
              <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2">
                <LogIn className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Guest mode &mdash;{" "}
                  <Link href="/login" className="underline font-medium hover:text-amber-900 dark:hover:text-amber-100">
                    Sign in
                  </Link>{" "}
                  to save history.
                </p>
              </div>
            )}

            {isPending ? (
              <div className="flex-1 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-violet-500 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-3">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Hi there!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-[260px]">
                        I can help you find properties, answer booking questions, or guide you around the platform.
                      </p>
                      <div className="grid grid-cols-2 gap-2 w-full max-w-[300px]">
                        {QUICK_ACTIONS.map((action) => (
                          <button
                            key={action}
                            onClick={() => handleQuickAction(action)}
                            className="p-2.5 rounded-xl text-xs text-left bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30 transition-colors border border-gray-200 dark:border-gray-700"
                          >
                            {action}
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

                {showRetryBtn && (
                  <div className="mx-4 mb-2 flex justify-center">
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Try again
                    </button>
                  </div>
                )}

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
              </>
            )}
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
