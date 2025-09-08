import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  return { user, profile }
}

export async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: publishedPosts },
    { count: activeSubscriptions },
    { data: recentUsers },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("posts")
      .select("id, title, status, created_at, author:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return {
    totalUsers: totalUsers || 0,
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    activeSubscriptions: activeSubscriptions || 0,
    recentUsers: recentUsers || [],
    recentPosts: recentPosts || [],
  }
}

export async function getUsers(page = 1, limit = 20) {
  const supabase = await createClient()
  const offset = (page - 1) * limit

  const {
    data: users,
    error,
    count,
  } = await supabase
    .from("profiles")
    .select(`
      *,
      subscription:user_subscriptions(
        status,
        plan:subscription_plans(name)
      )
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching users:", error)
    return { users: [], total: 0 }
  }

  return {
    users: users || [],
    total: count || 0,
  }
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

  if (error) {
    throw new Error("Failed to update user role")
  }
}

export async function getPostsForAdmin(page = 1, limit = 20, status?: string) {
  const supabase = await createClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from("posts")
    .select(`
      *,
      author:profiles(full_name),
      category:categories(name, color)
    `)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data: posts, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching posts:", error)
    return { posts: [], total: 0 }
  }

  return {
    posts: posts || [],
    total: count || 0,
  }
}

export async function updatePostStatus(postId: string, status: string) {
  const supabase = await createClient()

  const updateData: any = { status }
  if (status === "published") {
    updateData.published_at = new Date().toISOString()
  }

  const { error } = await supabase.from("posts").update(updateData).eq("id", postId)

  if (error) {
    throw new Error("Failed to update post status")
  }
}
