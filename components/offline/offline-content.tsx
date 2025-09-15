"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Clock, Crown } from "lucide-react"

interface OfflinePost {
  id: string
  title: string
  excerpt: string
  content: string
  category?: { name: string; color: string }
  reading_time?: number
  is_premium: boolean
  cached_at: string
}

export function OfflineContent() {
  const [offlinePosts, setOfflinePosts] = useState<OfflinePost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOfflineContent = () => {
      try {
        const cached = localStorage.getItem("offline_posts")
        if (cached) {
          setOfflinePosts(JSON.parse(cached))
        }
      } catch (error) {
        console.error("Error loading offline content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOfflineContent()
  }, [])

  const downloadForOffline = async (postId: string) => {
    try {
      // In a real implementation, this would fetch and cache the post
      const response = await fetch(`/api/posts/${postId}`)
      const post = await response.json()

      const cached = localStorage.getItem("offline_posts")
      const existing = cached ? JSON.parse(cached) : []

      const updated = [
        ...existing.filter((p: OfflinePost) => p.id !== postId),
        { ...post, cached_at: new Date().toISOString() },
      ]

      localStorage.setItem("offline_posts", JSON.stringify(updated))
      setOfflinePosts(updated)
    } catch (error) {
      console.error("Error downloading for offline:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading offline content...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Offline Reading</h2>
        <p className="text-muted-foreground">Access your downloaded articles even without an internet connection.</p>
      </div>

      {offlinePosts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Offline Content</h3>
            <p className="text-muted-foreground">
              Download articles for offline reading by clicking the download button on any article.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {offlinePosts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription className="text-pretty">{post.excerpt}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <Download className="mr-1 h-3 w-3" />
                    Offline
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.category && (
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: `${post.category.color}20`,
                          color: post.category.color,
                          borderColor: post.category.color,
                        }}
                      >
                        {post.category.name}
                      </Badge>
                    )}
                    {post.reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.reading_time}min read</span>
                      </div>
                    )}
                    {post.is_premium && (
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Downloaded {new Date(post.cached_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
