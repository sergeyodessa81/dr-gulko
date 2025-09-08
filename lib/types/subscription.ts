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
