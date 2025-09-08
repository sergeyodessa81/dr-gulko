import { compileMDX } from "next-mdx-remote/rsc"
import { createClient } from "@/lib/supabase/server"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string | null
  status: "draft" | "published" | "archived"
  language: "en" | "de" | "ru" | "uk"
  author_id: string
  category_id: string | null
  published_at: string | null
  reading_time: number | null
  view_count: number
  like_count: number
  is_premium: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    slug: string
    color: string
  }
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
  author?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  language: "en" | "de" | "ru" | "uk"
}

export interface Tag {
  id: string
  name: string
  slug: string
  language: "en" | "de" | "ru" | "uk"
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeHighlight,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
}

export async function compileMDXContent(content: string) {
  try {
    const { content: compiledContent, frontmatter } = await compileMDX({
      source: content,
      options: mdxOptions,
    })
    return { content: compiledContent, frontmatter }
  } catch (error) {
    console.error("Error compiling MDX:", error)
    throw new Error("Failed to compile MDX content")
  }
}

export async function getBlogPosts(
  options: {
    language?: string
    category?: string
    tag?: string
    limit?: number
    offset?: number
    includePrivate?: boolean
  } = {},
): Promise<{ posts: BlogPost[]; total: number }> {
  const supabase = await createClient()
  const { language = "en", category, tag, limit = 10, offset = 0, includePrivate = false } = options

  let query = supabase
    .from("posts")
    .select(`
      *,
      category:categories(id, name, slug, color),
      author:profiles(id, full_name, avatar_url),
      tags:post_tags(tag:tags(id, name, slug))
    `)
    .eq("language", language)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (!includePrivate) {
    query = query.eq("is_premium", false)
  }

  if (category) {
    query = query.eq("category.slug", category)
  }

  if (tag) {
    query = query.contains("tags.tag.slug", [tag])
  }

  const { data: posts, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching posts:", error)
    throw new Error("Failed to fetch blog posts")
  }

  // Transform the data to flatten tags
  const transformedPosts =
    posts?.map((post) => ({
      ...post,
      tags: post.tags?.map((tagRelation: any) => tagRelation.tag) || [],
    })) || []

  return {
    posts: transformedPosts,
    total: count || 0,
  }
}

export async function getBlogPost(slug: string, language = "en"): Promise<BlogPost | null> {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(id, name, slug, color),
      author:profiles(id, full_name, avatar_url),
      tags:post_tags(tag:tags(id, name, slug))
    `)
    .eq("slug", slug)
    .eq("language", language)
    .eq("status", "published")
    .single()

  if (error || !post) {
    return null
  }

  // Transform tags
  const transformedPost = {
    ...post,
    tags: post.tags?.map((tagRelation: any) => tagRelation.tag) || [],
  }

  // Increment view count
  await supabase
    .from("posts")
    .update({ view_count: post.view_count + 1 })
    .eq("id", post.id)

  return transformedPost
}

export async function getCategories(language = "en"): Promise<Category[]> {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("language", language)
    .order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return categories || []
}

export async function getTags(language = "en"): Promise<Tag[]> {
  const supabase = await createClient()

  const { data: tags, error } = await supabase.from("tags").select("*").eq("language", language).order("name")

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  return tags || []
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function formatDate(date: string, locale = "en-US"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
