"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getSubscriptionPlans, getUserSubscription, createCheckoutSession } from "@/lib/subscription"
import { PricingCard } from "@/components/subscription/pricing-card"
import { BillingToggle } from "@/components/subscription/billing-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Shield, Clock, Users } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { SubscriptionPlan, UserSubscription } from "@/lib/subscription"

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        // Get subscription plans
        const plansData = await getSubscriptionPlans()
        setPlans(plansData)

        // Get user subscription if logged in
        if (user) {
          const subscription = await getUserSubscription(user.id)
          setUserSubscription(subscription)
        }
      } catch (error) {
        console.error("Error loading pricing data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  const handleSelectPlan = async (planId: string, isYearlyPlan: boolean) => {
    if (!user) {
      router.push("/auth/signup")
      return
    }

    const plan = plans.find((p) => p.id === planId)
    if (!plan) return

    // Handle free plan
    if (plan.name === "Free") {
      // TODO: Implement free plan assignment
      return
    }

    const priceId = isYearlyPlan ? plan.stripe_price_id_yearly : plan.stripe_price_id_monthly
    if (!priceId) {
      console.error("Price ID not found for plan")
      return
    }

    setProcessingPlan(planId)

    try {
      const session = await createCheckoutSession(user.id, planId, priceId, isYearlyPlan)

      // Redirect to Stripe Checkout
      if (session.url) {
        window.location.href = session.url
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      setProcessingPlan(null)
    }
  }

  if (loading) {
    return (
      <div className="container py-16 space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-24 mx-auto" />
                <Skeleton className="h-8 w-32 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-balance">Choose Your Learning Path</h1>
        <p className="text-xl text-muted-foreground text-pretty">
          Access world-class medical education content tailored to your professional needs
        </p>
      </div>

      {/* Billing Toggle */}
      <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isYearly={isYearly}
            isCurrentPlan={userSubscription?.plan_id === plan.id}
            isPopular={plan.name === "Member"}
            onSelectPlan={handleSelectPlan}
            loading={processingPlan === plan.id}
          />
        ))}
      </div>

      {/* Features Comparison */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Why Choose Dr. Gulko's Platform?</h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Join thousands of medical professionals advancing their careers with our comprehensive education platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Expert Content</h3>
              <p className="text-sm text-muted-foreground">
                Learn from a leading trauma and orthopedic surgery specialist with years of experience
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mx-auto">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Flexible Learning</h3>
              <p className="text-sm text-muted-foreground">
                Access content anytime, anywhere with our mobile-friendly platform and offline capabilities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Community Support</h3>
              <p className="text-sm text-muted-foreground">
                Connect with fellow medical professionals and get support from our expert community
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-6 bg-muted/50 rounded-lg p-8">
        <h2 className="font-serif text-2xl font-bold">Ready to Advance Your Medical Career?</h2>
        <p className="text-muted-foreground">
          Start with our free plan and upgrade anytime to access premium content and features
        </p>
        {!user && (
          <Button size="lg" onClick={() => router.push("/auth/signup")} className="gap-2">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
