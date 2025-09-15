import { NextResponse } from "next/server"
import { requireAdmin, getAdminStats } from "@/lib/admin"

export async function GET() {
  try {
    await requireAdmin()

    const stats = await getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
