import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getBlogPost, compileMDXContent, formatDate } from "@/lib/mdx"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Eye, Heart, Crown } from "lucide-react"
import type { Metadata } from "next"
import { SocialSharing } from "@/components/ux/social-sharing"
import { BookmarkButton } from "@/components/ux/bookmark-system"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.featured_image ? [post.featured_image] : [],
      type: "article",
      publishedTime: post.published_at || undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const { content } = await compileMDXContent(post.content)

  const authorInitials =
    post.author?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "A"

  return (
    <article className="container py-8 max-w-4xl">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="space-y-6 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {post.category && (
            <Badge
              variant="secondary"
              style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
            >
              {post.category.name}
            </Badge>
          )}
          {post.is_premium && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <Crown className="mr-1 h-3 w-3" />
              Premium Content
            </Badge>
          )}
        </div>

        <h1 className="font-serif text-4xl font-bold leading-tight text-balance">{post.title}</h1>

        {post.excerpt && <p className="text-xl text-muted-foreground text-pretty">{post.excerpt}</p>}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {post.author && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar_url || ""} alt={post.author.full_name || ""} />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.full_name || "Anonymous"}</div>
                  {post.published_at && (
                    <div className="text-sm text-muted-foreground">{formatDate(post.published_at)}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.view_count} views</span>
            </div>
            {post.like_count > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{post.like_count}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BookmarkButton postId={post.id} />
              <SocialSharing title={post.title} url={`/blog/${post.slug}`} description={post.excerpt || ""} />
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-8">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <Separator className="mb-8" />

      {/* Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">{content}</div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <Badge variant="outline" className="hover:bg-accent hover:text-accent-foreground">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
