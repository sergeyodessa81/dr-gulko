"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Check, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface NewsletterSignupProps {
  variant?: "card" | "inline"
  className?: string
}

export function NewsletterSignup({ variant = "card", className }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: email.trim(),
        subscribed_at: new Date().toISOString(),
        is_active: true,
      })

      if (error) {
        if (error.code === "23505") {
          // Duplicate email
          setMessage("You're already subscribed!")
          setStatus("success")
        } else {
          throw error
        }
      } else {
        setMessage("Successfully subscribed!")
        setStatus("success")
        setEmail("")
      }
    } catch (error) {
      console.error("Newsletter signup error:", error)
      setMessage("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  if (variant === "inline") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Stay Updated
          </h3>
          <p className="text-sm text-muted-foreground">
            Get the latest medical insights and educational content delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="flex-1"
          />
          <Button type="submit" disabled={status === "loading" || status === "success"}>
            {status === "loading" ? "..." : status === "success" ? <Check className="h-4 w-4" /> : "Subscribe"}
          </Button>
        </form>

        {message && (
          <p className={`text-sm ${status === "error" ? "text-destructive" : "text-green-600"}`}>{message}</p>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Medical Education Newsletter
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Curated
          </Badge>
        </CardTitle>
        <CardDescription>
          Get personalized medical insights, latest research, and educational content curated by AI and delivered
          weekly.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">What you'll receive:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Weekly curated medical articles</li>
            <li>• Latest trauma and orthopedic research</li>
            <li>• AI-powered learning recommendations</li>
            <li>• Exclusive educational content</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
          />
          <Button type="submit" className="w-full" disabled={status === "loading" || status === "success"}>
            {status === "loading" ? (
              "Subscribing..."
            ) : status === "success" ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Subscribed!
              </>
            ) : (
              "Subscribe to Newsletter"
            )}
          </Button>
        </form>

        {message && (
          <p className={`text-sm text-center ${status === "error" ? "text-destructive" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <p className="text-xs text-muted-foreground text-center">Unsubscribe at any time. We respect your privacy.</p>
      </CardContent>
    </Card>
  )
}
