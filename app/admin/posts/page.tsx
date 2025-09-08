"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPostsForAdmin, updatePostStatus } from "@/lib/admin"
import { formatDistanceToNow } from "date-fns"
import { Plus, Eye, Edit, Crown } from "lucide-react"

interface PostData {
  id: string
  title: string
  status: string
  is_premium: boolean
  created_at: string
  published_at: string | null
  view_count: number
  author: { full_name: string | null } | null
  category: { name: string; color: string } | null
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [statusFilter])

  const loadPosts = async () => {
    try {
      const { posts: postsData } = await getPostsForAdmin(1, 50, statusFilter === "all" ? undefined : statusFilter)
      setPosts(postsData)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (postId: string, newStatus: string) => {
    setUpdatingStatus(postId)
    try {
      await updatePostStatus(postId, newStatus)
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                status: newStatus,
                published_at: newStatus === "published" ? new Date().toISOString() : post.published_at,
              }
            : post,
        ),
      )
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <AdminHeader title="Posts" description="Manage blog posts and content" />
        <div className="flex-1 p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading posts...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Posts" description="Manage blog posts and content" />

      <div className="flex-1 overflow-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Posts ({posts.length})</CardTitle>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button asChild>
                  <Link href="/admin/posts/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{post.title}</div>
                          {post.is_premium && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Crown className="h-3 w-3" />
                              Premium
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge
                          variant="outline"
                          style={{ borderColor: post.category.color, color: post.category.color }}
                        >
                          {post.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">No category</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{post.author?.full_name || "Unknown"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.view_count}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={post.status}
                          onValueChange={(value) => handleStatusUpdate(post.id, value)}
                          disabled={updatingStatus === post.id}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
