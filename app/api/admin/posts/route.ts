import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin, getPostsForAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") || undefined

    const result = await getPostsForAdmin(page, limit, status)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching admin posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
