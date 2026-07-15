"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Megaphone, TrendingUp, Users, DollarSign, BarChart3, ArrowRight } from "lucide-react"

const PLACEHOLDER_CAMPAIGNS = [
  { name: "Featured Listing Boost", reach: "10k-50k", cpc: "$0.50", status: "Coming Soon" },
  { name: "Homepage Spotlight", reach: "50k-200k", cpc: "$1.20", status: "Coming Soon" },
  { name: "Category Banner", reach: "20k-100k", cpc: "$0.80", status: "Coming Soon" },
]

export default function AdminAdvertisePage() {
  return (
    <div className="space-y-8 p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <Megaphone className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Advertisements</h1>
            <p className="text-sm text-slate-500">Manage sponsored listings and promotional campaigns</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: TrendingUp, label: "Active Campaigns", value: "0", color: "text-blue-600", bg: "bg-blue-100" },
          { icon: DollarSign, label: "Total Spend", value: "$0.00", color: "text-emerald-600", bg: "bg-emerald-100" },
          { icon: Users, label: "Advertisers", value: "0", color: "text-violet-600", bg: "bg-violet-100" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Available Campaign Types</h2>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {PLACEHOLDER_CAMPAIGNS.map((campaign) => (
            <div key={campaign.name} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-bold text-slate-900">{campaign.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Reach: {campaign.reach} · CPC: {campaign.cpc}
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                {campaign.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Want to advertise on AuraSpace?</h2>
            <p className="mt-1 text-sm text-slate-600 max-w-lg">
              Our advertising platform is under development. If you&apos;re interested in promoting your
              property or brand, reach out to our team and we&apos;ll keep you updated.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/15 transition-all hover:shadow-xl"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
