import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        // Get user ID from customer metadata
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (customer.deleted) break

        const userId = customer.metadata?.user_id
        if (!userId) break

        // Update or create subscription record
        const subscriptionData = {
          user_id: userId,
          stripe_subscription_id: subscription.id,
          status: subscription.status as any,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        }

        // Find plan by price ID
        const priceId = subscription.items.data[0]?.price.id
        if (priceId) {
          const { data: plan } = await supabase
            .from("subscription_plans")
            .select("id")
            .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`)
            .single()

          if (plan) {
            subscriptionData.plan_id = plan.id
          }
        }

        await supabase.from("user_subscriptions").upsert(subscriptionData, { onConflict: "stripe_subscription_id" })

        // Update user role based on subscription status
        if (subscription.status === "active") {
          const { data: plan } = await supabase
            .from("subscription_plans")
            .select("name")
            .eq("id", subscriptionData.plan_id)
            .single()

          if (plan) {
            const role = plan.name.toLowerCase() === "premium" ? "premium" : "member"
            await supabase.from("profiles").update({ role, subscription_status: "active" }).eq("id", userId)
          }
        } else {
          await supabase.from("profiles").update({ subscription_status: subscription.status }).eq("id", userId)
        }

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status
        await supabase
          .from("user_subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)

        // Get user ID and update role to free
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (!customer.deleted && customer.metadata?.user_id) {
          await supabase
            .from("profiles")
            .update({ role: "free", subscription_status: "canceled" })
            .eq("id", customer.metadata.user_id)
        }

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription && invoice.customer) {
          const customer = await stripe.customers.retrieve(invoice.customer as string)
          if (!customer.deleted && customer.metadata?.user_id) {
            // Record payment in history
            await supabase.from("payment_history").insert({
              user_id: customer.metadata.user_id,
              stripe_payment_intent_id: invoice.payment_intent as string,
              amount: invoice.amount_paid / 100, // Convert from cents
              currency: invoice.currency,
              status: "succeeded",
              description: invoice.description || "Subscription payment",
            })
          }
        }

        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription && invoice.customer) {
          const customer = await stripe.customers.retrieve(invoice.customer as string)
          if (!customer.deleted && customer.metadata?.user_id) {
            // Update subscription status
            await supabase
              .from("user_subscriptions")
              .update({ status: "past_due" })
              .eq("stripe_subscription_id", invoice.subscription as string)

            // Update user profile
            await supabase
              .from("profiles")
              .update({ subscription_status: "past_due" })
              .eq("id", customer.metadata.user_id)

            // Record failed payment
            await supabase.from("payment_history").insert({
              user_id: customer.metadata.user_id,
              stripe_payment_intent_id: invoice.payment_intent as string,
              amount: invoice.amount_due / 100,
              currency: invoice.currency,
              status: "failed",
              description: "Failed subscription payment",
            })
          }
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
