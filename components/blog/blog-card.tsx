import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Heart, Crown } from "lucide-react"
import { formatDate } from "@/lib/mdx"
import type { BlogPost } from "@/lib/mdx"

interface BlogCardProps {
  post: BlogPost
  showAuthor?: boolean
  className?: string
}

export function BlogCard({ post, showAuthor = true, className }: BlogCardProps) {
  const authorInitials =
    post.author?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "A"

  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-lg ${className}`}>
      {post.featured_image && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.featured_image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {post.is_premium && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Crown className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2">
          {post.category && (
            <Badge
              variant="secondary"
              style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
            >
              {post.category.name}
            </Badge>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.reading_time} min</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{post.view_count}</span>
            </div>
            {post.like_count > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{post.like_count}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <Link href={`/blog/${post.slug}`} className="group">
            <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors text-balance">
              {post.title}
            </h3>
          </Link>
          {post.excerpt && <p className="mt-2 text-muted-foreground text-pretty line-clamp-2">{post.excerpt}</p>}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          {showAuthor && post.author && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar_url || ""} alt={post.author.full_name || ""} />
                <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{post.author.full_name || "Anonymous"}</span>
            </div>
          )}

          {post.published_at && <time className="text-sm text-muted-foreground">{formatDate(post.published_at)}</time>}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <Badge variant="outline" className="text-xs hover:bg-accent hover:text-accent-foreground">
                  {tag.name}
                </Badge>
              </Link>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
