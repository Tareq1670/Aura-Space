// Components/Public/HomePageSkeleton.tsx
import { Skeleton } from "@heroui/react";

// ─── Hero Skeleton ────────────────────────────────────────────────────────────
// Mirrors: full-width hero with headline, sub-text, two CTA buttons,
//          a search bar row, and a decorative image / floating card area
function HeroSkeleton() {
  return (
    <section className="relative w-full min-h-[65vh] bg-gradient-to-br from-slate-100 to-indigo-50/40 overflow-hidden px-4 sm:px-8 lg:px-16 flex items-center">
      {/* Decorative blobs — purely visual, no skeleton needed */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-100/40 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 lg:py-24">
        {/* ── Left: text content ── */}
        <div className="flex flex-col gap-5">
          {/* Badge */}
          <Skeleton className="h-7 w-40 rounded-full" />

          {/* Main headline — 3 lines */}
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-5/6 rounded-2xl" />
            <Skeleton className="h-12 w-4/6 rounded-2xl" />
          </div>

          {/* Sub-text */}
          <div className="space-y-2 mt-1">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
            <Skeleton className="h-4 w-3/5 rounded-lg" />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>

          {/* Search / input bar */}
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>

          {/* Micro-stats row */}
          <div className="flex gap-6 mt-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: decorative image / card area ── */}
        <div className="relative hidden lg:flex items-center justify-center">
          {/* Main image placeholder */}
          <Skeleton className="w-[420px] h-[420px] rounded-3xl" />

          {/* Floating card 1 — top-left */}
          <div className="absolute -left-8 top-8 bg-white rounded-2xl shadow-xl p-4 w-44 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>

          {/* Floating card 2 — bottom-right */}
          <div className="absolute -right-6 bottom-10 bg-white rounded-2xl shadow-xl p-4 w-40 space-y-2">
            <Skeleton className="w-10 h-10 rounded-full mx-auto" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-2/3 mx-auto rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Brand Partners Skeleton ──────────────────────────────────────────────────
// Mirrors: section title + a horizontal row of brand logo chips
function BrandPartnersSkeleton() {
  return (
    <section className="w-full py-10 sm:py-14 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section label */}
        <div className="flex justify-center mb-8">
          <Skeleton className="h-4 w-48 rounded-full" />
        </div>

        {/* Logo row — 6 brand logos */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 rounded-lg"
              style={{ width: `${80 + (i % 3) * 20}px` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Our Services Skeleton ────────────────────────────────────────────────────
// Mirrors: section heading + sub-text + 3×2 service cards (icon, title, desc)
function OurServicesSkeleton() {
  return (
    <section className="w-full py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-12 space-y-3">
          <Skeleton className="h-4 w-24 rounded-full mx-auto" />
          <Skeleton className="h-9 w-72 rounded-2xl mx-auto" />
          <div className="space-y-2 max-w-lg mx-auto">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-4/5 mx-auto rounded-lg" />
          </div>
        </div>

        {/* Service cards — 3 per row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4"
            >
              {/* Icon */}
              <Skeleton className="w-12 h-12 rounded-xl" />
              {/* Title */}
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              {/* Description — 3 lines */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
                <Skeleton className="h-3 w-4/6 rounded" />
              </div>
              {/* Link */}
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Skeleton ────────────────────────────────────────────────────
// Mirrors: section heading + 4 numbered step cards in a horizontal row
function HowItWorksSkeleton() {
  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-14 space-y-3">
          <Skeleton className="h-4 w-28 rounded-full mx-auto" />
          <Skeleton className="h-9 w-64 rounded-2xl mx-auto" />
          <div className="space-y-2 max-w-md mx-auto">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 mx-auto rounded-lg" />
          </div>
        </div>

        {/* Step cards — 4 across on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100"
            >
              {/* Step number badge */}
              <Skeleton className="w-12 h-12 rounded-full" />
              {/* Icon circle */}
              <Skeleton className="w-16 h-16 rounded-2xl" />
              {/* Step title */}
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              {/* Description */}
              <div className="w-full space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 mx-auto rounded" />
                <Skeleton className="h-3 w-4/6 mx-auto rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Statistics Skeleton ──────────────────────────────────────────────────────
// Mirrors: full-width coloured band with 4 big-number stat counters
function StatisticsSkeleton() {
  return (
    <section className="w-full py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              {/* Icon */}
              <Skeleton className="w-12 h-12 rounded-xl bg-white/20" />
              {/* Big number */}
              <Skeleton className="h-10 w-24 rounded-xl bg-white/20" />
              {/* Label */}
              <Skeleton className="h-4 w-20 rounded-lg bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Skeleton ────────────────────────────────────────────────────
// Mirrors: section heading + 3 review cards (avatar, name, stars, quote)
function TestimonialsSkeleton() {
  return (
    <section className="w-full py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-12 space-y-3">
          <Skeleton className="h-4 w-32 rounded-full mx-auto" />
          <Skeleton className="h-9 w-72 rounded-2xl mx-auto" />
          <Skeleton className="h-4 w-80 rounded-lg mx-auto" />
        </div>

        {/* Testimonial cards — 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4"
            >
              {/* Star rating row */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Skeleton key={s} className="w-4 h-4 rounded" />
                ))}
              </div>

              {/* Quote text — 4 lines */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>

              {/* Reviewer info */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-28 rounded-lg" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-2 rounded-full ${i === 0 ? "w-6" : "w-2"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Skeleton ─────────────────────────────────────────────────────────────
// Mirrors: section heading + 6 accordion rows (question + chevron)
function FAQSkeleton() {
  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-12 space-y-3">
          <Skeleton className="h-4 w-20 rounded-full mx-auto" />
          <Skeleton className="h-9 w-64 rounded-2xl mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 mx-auto rounded-lg" />
          </div>
        </div>

        {/* FAQ accordion rows */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50"
            >
              {/* Question text — varies in width */}
              <Skeleton
                className="h-4 rounded-lg"
                style={{ width: `${55 + (i % 4) * 10}%` }}
              />
              {/* Chevron icon */}
              <Skeleton className="w-5 h-5 rounded shrink-0 ml-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Skeleton ──────────────────────────────────────────────────────
// Mirrors: full-width CTA band — headline, sub-text, email input + button
function NewsletterSkeleton() {
  return (
    <section className="w-full py-16 sm:py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="max-w-2xl mx-auto px-4 sm:px-8 text-center space-y-6">
        {/* Badge */}
        <Skeleton className="h-6 w-32 rounded-full mx-auto bg-white/20" />

        {/* Headline */}
        <div className="space-y-3">
          <Skeleton className="h-9 w-4/5 mx-auto rounded-2xl bg-white/20" />
          <Skeleton className="h-9 w-3/5 mx-auto rounded-2xl bg-white/20" />
        </div>

        {/* Sub-text */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full mx-auto rounded-lg bg-white/20" />
          <Skeleton className="h-4 w-5/6 mx-auto rounded-lg bg-white/20" />
        </div>

        {/* Input + button row */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
          <Skeleton className="h-12 flex-1 rounded-xl bg-white/20" />
          <Skeleton className="h-12 w-36 rounded-xl bg-white/20" />
        </div>

        {/* Fine print */}
        <Skeleton className="h-3 w-56 mx-auto rounded bg-white/20" />
      </div>
    </section>
  );
}

// ─── Full Home Page Skeleton ──────────────────────────────────────────────────
export default function HomePageSkeleton() {
  return (
    <div className="w-full overflow-x-hidden">
      <HeroSkeleton />
      <BrandPartnersSkeleton />
      <OurServicesSkeleton />
      <HowItWorksSkeleton />
      <StatisticsSkeleton />
      <TestimonialsSkeleton />
      <FAQSkeleton />
      <NewsletterSkeleton />
    </div>
  );
}