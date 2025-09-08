"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface FocusTrapProps {
  children: React.ReactNode
  active: boolean
}

export function FocusTrap({ children, active }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Let parent components handle escape
        e.stopPropagation()
      }
    }

    document.addEventListener("keydown", handleTabKey)
    document.addEventListener("keydown", handleEscapeKey)

    // Focus first element when trap becomes active
    firstElement?.focus()

    return () => {
      document.removeEventListener("keydown", handleTabKey)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [active])

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  )
}
