"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, RefreshCw, Star, MapPin, Users, BedDouble, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { getRecommendations, type RecommendationItem } from "@/lib/actions/ai"
import { getFeaturedProperties, type PublicProperty } from "@/lib/actions/property-public"
import { cn } from "@/lib/utils/cn"

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [fallbackProperties, setFallbackProperties] = useState<PublicProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { data: session } = authClient.useSession()

  const fetchRecommendations = useCallback(async () => {
    setLoading(true)
    try {
      if (session) {
        setIsAuthenticated(true)
        const res = await getRecommendations()
        if (res.success && res.data?.recommendations?.length) {
          setRecommendations(res.data.recommendations)
          return
        }
      }
      // Fallback to featured properties
      setIsAuthenticated(false)
      const fallback = await getFeaturedProperties()
      if (fallback.success && fallback.data?.properties) {
        setFallbackProperties(fallback.data.properties.slice(0, 6))
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecommendations()
  }, [fetchRecommendations])

  const displayItems = recommendations.length > 0
    ? recommendations
    : fallbackProperties.map((p) => ({
        propertyId: p.id,
        title: p.title,
        reason: isAuthenticated ? "Popular choice among guests" : "Featured property",
        matchScore: p.rating * 20,
        images: p.images?.[0] || "",
        pricePerNight: p.price?.perNight || 0,
        currency: p.price?.currency || "BDT",
        location: p.location,
        rating: p.rating,
        reviewCount: p.reviewCount,
        category: p.category,
        details: p.details,
      }))

  if (loading && displayItems.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Finding your perfect stay...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse h-80" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (displayItems.length === 0) return null

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-500">
                {isAuthenticated ? "AI Powered" : "Featured"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAuthenticated ? "Recommended for You" : "Popular Properties"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isAuthenticated
                ? "Personalized based on your preferences and history"
                : "Discover our most popular stays"}
            </p>
          </div>
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.slice(0, 6).map((item, i) => (
            <motion.div
              key={item.propertyId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/listings/${item.propertyId}`}
                className="group block rounded-xl overflow-hidden bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.images || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.reason && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/90 text-white backdrop-blur-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Match
                      </span>
                    </div>
                  )}
                  {item.matchScore >= 80 && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-500/90 text-white">
                        {item.matchScore}% Match
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{item.rating?.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({item.reviewCount})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.reason && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 italic">
                      &ldquo;{item.reason}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location?.city || "Various"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {item.details?.maxGuests}
                      </span>
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3 h-3" />
                        {item.details?.bedrooms}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.currency === "BDT" ? "৳" : "$"}{item.pricePerNight}
                      </span>
                      <span className="text-xs text-gray-400">/night</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
