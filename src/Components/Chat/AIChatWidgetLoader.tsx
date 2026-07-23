"use client"

import { useEffect, useState, lazy, Suspense } from "react"

const AIChatWidget = lazy(() => import("./AIChatWidget"))

export default function AIChatWidgetLoader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Suspense fallback={null}>
      <AIChatWidget />
    </Suspense>
  )
}
