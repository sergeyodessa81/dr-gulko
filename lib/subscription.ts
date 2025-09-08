import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  price_monthly: number | null
  price_yearly: number | null
  stripe_price_id_monthly: string | null
  stripe_price_id_yearly: string | null
  features: string[]
  is_active: boolean
  sort_order: number
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  stripe_subscription_id: string | null
  status: "active" | "canceled" | "past_due" | "incomplete" | "trialing"
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  plan?: SubscriptionPlan
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
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

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
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

export async function createCheckoutSession(userId: string, planId: string, priceId: string, isYearly = false) {
  const supabase = await createClient()

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id")
    .eq("id", userId)
    .single()

  if (!profile) {
    throw new Error("User profile not found")
  }

  let customerId = profile.stripe_customer_id

  // Create Stripe customer if doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      metadata: {
        user_id: userId,
      },
    })

    customerId = customer.id

    // Update profile with customer ID
    await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId)
  }

  // Create checkout session
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

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })

  // Update database
  const supabase = await createClient()
  await supabase
    .from("user_subscriptions")
    .update({ cancel_at_period_end: true })
    .eq("stripe_subscription_id", subscriptionId)

  return subscription
}

export async function reactivateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })

  // Update database
  const supabase = await createClient()
  await supabase
    .from("user_subscriptions")
    .update({ cancel_at_period_end: false })
    .eq("stripe_subscription_id", subscriptionId)

  return subscription
}

export function hasAccess(userRole: string, requiredRole: string): boolean {
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
