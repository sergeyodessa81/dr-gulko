import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin, updateUserRole } from "@/lib/admin"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()

    const { role } = await request.json()
    await updateUserRole(params.id, role)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
