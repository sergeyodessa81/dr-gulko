"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap } from "lucide-react"
import type { SubscriptionPlan } from "@/lib/types/subscription"

interface PricingCardProps {
  plan: SubscriptionPlan
  isYearly: boolean
  isCurrentPlan?: boolean
  isPopular?: boolean
  onSelectPlan: (planId: string, isYearly: boolean) => void
  loading?: boolean
}

export function PricingCard({
  plan,
  isYearly,
  isCurrentPlan = false,
  isPopular = false,
  onSelectPlan,
  loading = false,
}: PricingCardProps) {
  const price = isYearly ? plan.price_yearly : plan.price_monthly
  const yearlyPrice = plan.price_yearly
  const monthlyPrice = plan.price_monthly

  const monthlyEquivalent = yearlyPrice ? yearlyPrice / 12 : 0
  const savings =
    monthlyPrice && yearlyPrice ? Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100) : 0

  const getIcon = () => {
    if (plan.name === "Premium") return Crown
    if (plan.name === "Member") return Zap
    return null
  }

  const Icon = getIcon()

  return (
    <Card
      className={`relative ${isPopular ? "border-primary shadow-lg scale-105" : ""} ${isCurrentPlan ? "border-accent" : ""}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          <CardTitle className="text-xl">{plan.name}</CardTitle>
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold">
            {price === 0 ? (
              "Free"
            ) : (
              <>
                ${price}
                <span className="text-base font-normal text-muted-foreground">/{isYearly ? "year" : "month"}</span>
              </>
            )}
          </div>

          {isYearly && yearlyPrice && monthlyPrice && savings > 0 && (
            <div className="text-sm text-muted-foreground">
              ${monthlyEquivalent.toFixed(2)}/month • Save {savings}%
            </div>
          )}
        </div>

        <CardDescription className="text-pretty">{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={isCurrentPlan ? "secondary" : isPopular ? "default" : "outline"}
          onClick={() => onSelectPlan(plan.id, isYearly)}
          disabled={loading || isCurrentPlan}
        >
          {loading
            ? "Processing..."
            : isCurrentPlan
              ? "Current Plan"
              : plan.name === "Free"
                ? "Get Started"
                : `Choose ${plan.name}`}
        </Button>
      </CardContent>
    </Card>
  )
}
