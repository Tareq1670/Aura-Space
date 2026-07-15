"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Megaphone, TrendingUp, DollarSign, Users, CheckCircle, ArrowRight, Mail, Loader2, Sparkles, BarChart3, Target, Eye, MousePointerClick } from "lucide-react"
import Link from "next/link"

const TIERS = [
  {
    name: "Featured Listing",
    price: "$49",
    period: "/ month",
    description: "Boost a single property to the top of search results",
    reach: "10k–50k",
    cpc: "$0.50",
    features: [
      "Priority in category search",
      "Featured badge on listing",
      "Homepage carousel inclusion",
      "Weekly performance report",
    ],
    popular: false,
  },
  {
    name: "Homepage Spotlight",
    price: "$199",
    period: "/ month",
    description: "Prime placement on the homepage hero section",
    reach: "50k–200k",
    cpc: "$1.20",
    features: [
      "Hero banner rotation placement",
      "Custom campaign image",
      "Social media promotion",
      "Bi-weekly performance report",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Category Banner",
    price: "$99",
    period: "/ month",
    description: "Stand out within your property category",
    reach: "20k–100k",
    cpc: "$0.80",
    features: [
      "Banner in category pages",
      "Category filter priority",
      "Monthly performance report",
      "A/B tested creatives",
    ],
    popular: false,
  },
]

const BENEFITS = [
  { icon: Eye, title: "Increased Visibility", description: "Get in front of thousands of travelers actively searching for spaces like yours" },
  { icon: Target, title: "Targeted Reach", description: "Reach the right audience based on location, category, and guest preferences" },
  { icon: BarChart3, title: "Performance Analytics", description: "Track impressions, clicks, and bookings with detailed campaign reports" },
  { icon: MousePointerClick, title: "Pay for Performance", description: "Flexible pricing models including pay-per-click and flat-rate placements" },
]

export default function AdminAdvertisePage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !name.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    setSubmitting(true)
    // Simulate submission — backend endpoint TBD
    await new Promise((r) => setTimeout(r, 1000))
    setSubscribed(true)
    setSubmitting(false)
    toast.success("You're on the waitlist!")
  }

  return (
    <div className="space-y-10 p-6 lg:p-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-8 shadow-2xl shadow-violet-500/25"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Megaphone className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white sm:text-3xl">Advertise on AuraSpace</h1>
              <p className="mt-1 text-sm text-white/70 max-w-xl">
                Promote your properties to our growing audience of travelers. Coming soon — join the waitlist for early access.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Early Access Available
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: TrendingUp, label: "Monthly Active Users", value: "12.4k", sub: "Growing 18% MoM", color: "text-violet-600", bg: "bg-violet-100" },
          { icon: Eye, label: "Monthly Page Views", value: "89.2k", sub: "Property detail pages", color: "text-blue-600", bg: "bg-blue-100" },
          { icon: DollarSign, label: "Avg. Booking Value", value: "$320", sub: "Per reservation", color: "text-emerald-600", bg: "bg-emerald-100" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{stat.sub}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="mb-6 text-lg font-extrabold text-slate-900">Why Advertise with Us?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-violet-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 mb-3">
                <benefit.icon className="h-5 w-5 text-violet-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{benefit.title}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pricing Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-6 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-slate-400" />
          <h2 className="text-lg font-extrabold text-slate-900">Advertising Tiers</h2>
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600">Coming Soon</span>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + i * 0.06 }}
              className={`relative rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg ${
                tier.popular
                  ? "border-violet-200 ring-2 ring-violet-500/20"
                  : "border-slate-100"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}
              <div className="mt-2">
                <h3 className="text-lg font-black text-slate-900">{tier.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{tier.description}</p>
                <div className="mt-4 flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-slate-900">{tier.price}</span>
                  <span className="text-sm text-slate-400">{tier.period}</span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                  <span>Reach: <strong className="text-slate-700">{tier.reach}</strong></span>
                  <span>CPC: <strong className="text-slate-700">{tier.cpc}</strong></span>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Waitlist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-6 sm:p-8"
      >
        {subscribed ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900">You're on the List!</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-md">
              We&apos;ll notify <strong className="text-slate-900">{email}</strong> when advertising launches. In the meantime, explore our current offerings.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/dashboard/admin/main"
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-600"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <h2 className="text-xl font-black text-slate-900">Get Early Access</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Be the first to know when advertising goes live. Join the waitlist and we&apos;ll send you
                pricing details, launch updates, and an exclusive early-adopter discount.
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span><strong className="text-slate-700">47</strong> on waitlist</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Early adopter pricing available</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleWaitlist} className="flex flex-col gap-3 sm:flex-row sm:items-end min-w-0 sm:min-w-[360px]">
              <div className="flex-1 space-y-2">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/15 transition-all hover:shadow-xl hover:from-violet-600 hover:to-indigo-700 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {submitting ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          </div>
        )}
      </motion.div>

      {/* FAQ / Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">Questions?</h2>
        <p className="text-sm text-slate-600 max-w-xl">
          Want to discuss custom advertising solutions or partnership opportunities? Our team is ready to help.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Contact Us
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  )
}
