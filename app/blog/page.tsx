import { Suspense } from "react"
import { getBlogPosts, getCategories, getTags } from "@/lib/mdx"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogFilters } from "@/components/blog/blog-filters"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    tag?: string
    search?: string
  }>
}

function BlogSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <div className="aspect-video">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = Number.parseInt(params.page || "1")
  const postsPerPage = 12
  const offset = (page - 1) * postsPerPage

  const [{ posts, total }, categories, tags] = await Promise.all([
    getBlogPosts({
      category: params.category,
      tag: params.tag,
      limit: postsPerPage,
      offset,
    }),
    getCategories(),
    getTags(),
  ])

  const totalPages = Math.ceil(total / postsPerPage)

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold">Medical Education Blog</h1>
          <p className="text-muted-foreground text-pretty">
            Insights, research, and expertise in trauma and orthopedic surgery
          </p>
        </div>

        <BlogFilters categories={categories} tags={tags} />
      </div>

      {posts.length > 0 ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <BlogPagination currentPage={page} totalPages={totalPages} totalPosts={total} postsPerPage={postsPerPage} />
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No articles found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or browse all articles.</p>
        </div>
      )}
    </div>
  )
}

export default function BlogPage(props: BlogPageProps) {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogContent {...props} />
    </Suspense>
  )
}
