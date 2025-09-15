import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserSubscription } from "@/lib/subscription.server"
import { SubscriptionManager } from "@/components/subscription/subscription-manager"

export default async function SubscriptionPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const subscription = await getUserSubscription(user.id)

  return (
    <div className="container py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage your subscription and billing preferences</p>
        </div>

        <SubscriptionManager subscription={subscription} />
      </div>
    </div>
  )
}
