"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface BookmarkItem {
  id: string
  post_id: string
  user_id: string
  created_at: string
  post: {
    title: string
    slug: string
    excerpt: string
    category?: { name: string; color: string }
  }
}

interface BookmarkButtonProps {
  postId: string
  userId?: string
}

export function BookmarkButton({ postId, userId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    const checkBookmark = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .single()

      setIsBookmarked(!!data)
    }

    checkBookmark()
  }, [userId, postId, supabase])

  const toggleBookmark = async () => {
    if (!userId || loading) return

    setLoading(true)
    try {
      if (isBookmarked) {
        await supabase.from("bookmarks").delete().eq("user_id", userId).eq("post_id", postId)
        setIsBookmarked(false)
      } else {
        await supabase.from("bookmarks").insert({ user_id: userId, post_id: postId })
        setIsBookmarked(true)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  return (
    <Button variant="ghost" size="sm" onClick={toggleBookmark} disabled={loading} className="gap-1 hover:bg-accent/50">
      {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
      {isBookmarked ? "Saved" : "Save"}
    </Button>
  )
}

export function BookmarksList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select(`
          *,
          post:posts(
            title,
            slug,
            excerpt,
            category:categories(name, color)
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      setBookmarks(data || [])
      setLoading(false)
    }

    fetchBookmarks()
  }, [userId, supabase])

  const removeBookmark = async (bookmarkId: string) => {
    await supabase.from("bookmarks").delete().eq("id", bookmarkId)
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId))
  }

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
          <p className="text-muted-foreground">Save articles you want to read later by clicking the bookmark icon.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-lg">
                  <Link href={`/blog/${bookmark.post.slug}`} className="hover:text-primary transition-colors">
                    {bookmark.post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-pretty">{bookmark.post.excerpt}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBookmark(bookmark.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              {bookmark.post.category && (
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: `${bookmark.post.category.color}20`, color: bookmark.post.category.color }}
                >
                  {bookmark.post.category.name}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                Saved {new Date(bookmark.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
