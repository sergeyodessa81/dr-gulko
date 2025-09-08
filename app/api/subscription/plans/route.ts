import { NextResponse } from "next/server"
import { getSubscriptionPlans } from "@/lib/subscription.server"

export async function GET() {
  try {
    const plans = await getSubscriptionPlans()
    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching subscription plans:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
