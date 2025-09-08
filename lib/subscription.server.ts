import "server-only"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import type { SubscriptionPlan, UserSubscription } from "./types/subscription"

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const supabase = await createClient()

  const { data: plans, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")

  if (error) {
    console.error("Error fetching subscription plans:", error)
    return []
  }

  return plans || []
}

export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  const supabase = await createClient()

  const { data: subscription, error } = await supabase
    .from("user_subscriptions")
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  if (error || !subscription) {
    return null
  }

  return subscription
}

export const createCheckoutSession = async (userId: string, planId: string, priceId: string, isYearly = false) => {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id")
    .eq("id", userId)
    .single()

  if (!profile) {
    throw new Error("User profile not found")
  }

  let customerId = profile.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      metadata: {
        user_id: userId,
      },
    })

    customerId = customer.id

    await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      user_id: userId,
      plan_id: planId,
      is_yearly: isYearly.toString(),
    },
  })

  return session
}

export const cancelSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })

  const supabase = await createClient()
  await supabase
    .from("user_subscriptions")
    .update({ cancel_at_period_end: true })
    .eq("stripe_subscription_id", subscriptionId)

  return subscription
}

export const reactivateSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })

  const supabase = await createClient()
  await supabase
    .from("user_subscriptions")
    .update({ cancel_at_period_end: false })
    .eq("stripe_subscription_id", subscriptionId)

  return subscription
}

export const hasAccess = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    free: 0,
    member: 1,
    premium: 2,
    admin: 3,
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

  return userLevel >= requiredLevel
}
