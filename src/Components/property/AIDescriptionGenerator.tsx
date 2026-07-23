"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Loader2, RefreshCw, Check } from "lucide-react"
import { generateDescription } from "@/lib/actions/ai"
import { cn } from "@/lib/utils/cn"

interface AIDescriptionGeneratorProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    title: string
    propertyType?: string
    placeType?: string
    city?: string
    country?: string
    bedrooms?: number
    bathrooms?: number
    maxGuests?: number
    beds?: number
    amenities?: string[]
  }
  onApply: (description: string) => void
}

const tones = [
  { value: "professional", label: "Professional", desc: "Polished, for business travelers" },
  { value: "luxury", label: "Luxury", desc: "Elegant, highlighting exclusivity" },
  { value: "friendly", label: "Friendly", desc: "Warm and inviting" },
]

const lengths = [
  { value: "short", label: "Short", desc: "2-3 sentences" },
  { value: "medium", label: "Medium", desc: "3-5 sentences" },
  { value: "long", label: "Long", desc: "5-8 sentences" },
]

export default function AIDescriptionGenerator({
  isOpen,
  onClose,
  formData,
  onApply,
}: AIDescriptionGeneratorProps) {
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    if (!formData.title) return
    setIsGenerating(true)
    setGenerated(false)

    try {
      const res = await generateDescription({
        title: formData.title,
        propertyType: formData.propertyType,
        placeType: formData.placeType,
        city: formData.city,
        country: formData.country,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        guests: formData.maxGuests,
        beds: formData.beds,
        amenities: formData.amenities,
        tone,
        length,
      })

      if (res.success && res.data) {
        setDescription(res.data.description)
        setGenerated(true)
      } else {
        setDescription("Failed to generate description. Please try again.")
      }
    } catch {
      setDescription("Network error. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Description Generator</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {!formData.title && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Please enter a property title first before generating a description.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {tones.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={cn(
                        "p-3 rounded-xl border-2 text-left transition-all",
                        tone === t.value
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                    >
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">{t.label}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {lengths.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLength(l.value)}
                      className={cn(
                        "p-3 rounded-xl border-2 text-left transition-all",
                        length === l.value
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                    >
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">{l.label}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{l.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!formData.title || isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {generated ? "Regenerate" : "Generate Description"}
                  </>
                )}
              </button>

              {description && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preview
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                  <div className="flex justify-end gap-2">
                    {generated && (
                      <button
                        onClick={handleGenerate}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Generate Again
                      </button>
                    )}
                    <button
                      onClick={() => onApply(description)}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Apply Description
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
