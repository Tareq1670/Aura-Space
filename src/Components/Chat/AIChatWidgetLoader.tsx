"use client"

import { Component, type ReactNode, useEffect, useState, lazy, Suspense } from "react"

const AIChatWidget = lazy(() => import("./AIChatWidget"))

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default function AIChatWidgetLoader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
    </ErrorBoundary>
  )
}
