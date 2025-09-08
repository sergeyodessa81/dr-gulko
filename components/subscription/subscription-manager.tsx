"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Crown, Calendar, CreditCard, AlertTriangle } from "lucide-react"
import { cancelSubscription, reactivateSubscription } from "@/lib/subscription.server"
import type { UserSubscription } from "@/lib/subscription.server"

interface SubscriptionManagerProps {
  subscription: UserSubscription | null
}

export function SubscriptionManager({ subscription }: SubscriptionManagerProps) {
  const [loading, setLoading] = useState(false)

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return

    setLoading(true)
    try {
      await cancelSubscription(subscription.stripe_subscription_id)
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error("Error canceling subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return

    setLoading(true)
    try {
      await reactivateSubscription(subscription.stripe_subscription_id)
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error("Error reactivating subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      case "past_due":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            You're currently on the free plan. Upgrade to access premium content and features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{subscription.plan?.name}</h3>
              <p className="text-muted-foreground">{subscription.plan?.description}</p>
            </div>
            <Badge className={getStatusColor(subscription.status)}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            {subscription.current_period_start && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Billing Period</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(subscription.current_period_start)} -{" "}
                    {subscription.current_period_end && formatDate(subscription.current_period_end)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Next Billing</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.current_period_end ? formatDate(subscription.current_period_end) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {subscription.cancel_at_period_end && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Subscription Ending</p>
                <p className="text-sm text-yellow-700">
                  Your subscription will end on{" "}
                  {subscription.current_period_end && formatDate(subscription.current_period_end)}. You'll still have
                  access until then.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
          <CardDescription>Update your subscription or billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href="/pricing">Change Plan</a>
            </Button>

            {subscription.cancel_at_period_end ? (
              <Button
                onClick={handleReactivateSubscription}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Processing..." : "Reactivate Subscription"}
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleCancelSubscription} disabled={loading}>
                {loading ? "Processing..." : "Cancel Subscription"}
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team for assistance with your subscription.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
