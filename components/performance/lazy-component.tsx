import type React from "react"
import { Suspense, lazy } from "react"

interface LazyComponentProps {
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function LazyComponent({
  fallback = <div className="animate-pulse bg-muted h-32 rounded" />,
  children,
}: LazyComponentProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

// Lazy load heavy components
export const LazyChart = lazy(() => import("@/components/ui/chart").then((mod) => ({ default: mod.Chart })))
export const LazyEditor = lazy(() => import("@/components/editor/mdx-editor"))
export const LazyAnalytics = lazy(() => import("@/components/analytics/dashboard"))
