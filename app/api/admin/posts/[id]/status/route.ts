import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin, updatePostStatus } from "@/lib/admin"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()

    const { status } = await request.json()
    await updatePostStatus(params.id, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating post status:", error)
    return NextResponse.json({ error: "Failed to update post status" }, { status: 500 })
  }
}
