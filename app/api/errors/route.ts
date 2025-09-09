import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const resolved = searchParams.get("resolved")

    let query = supabase
      .from("learning_errors")
      .select("*")
      .eq("user_id", user.id)
      .order("last_occurred", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (resolved !== null) {
      query = query.eq("is_resolved", resolved === "true")
    }

    const { data: errors, error } = await query

    if (error) {
      console.error("Error fetching errors:", error)
      return NextResponse.json({ error: "Failed to fetch errors" }, { status: 500 })
    }

    return NextResponse.json({ errors: errors || [] })
  } catch (error) {
    console.error("Error in GET /api/errors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { errorType, category, description, correctAnswer, userAnswer, context } = body

    if (!errorType || !category || !description || !correctAnswer || !userAnswer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use the increment_error_frequency function to handle duplicates
    const { data, error } = await supabase.rpc("increment_error_frequency", {
      p_user_id: user.id,
      p_error_type: errorType,
      p_category: category,
      p_description: description,
      p_correct_answer: correctAnswer,
      p_user_answer: userAnswer,
      p_context: context || null,
    })

    if (error) {
      console.error("Error creating error:", error)
      return NextResponse.json({ error: "Failed to create error" }, { status: 500 })
    }

    return NextResponse.json({ id: data }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/errors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
