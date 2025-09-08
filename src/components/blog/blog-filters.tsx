"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import type { Category, Tag } from "@/lib/mdx"
import { AdvancedSearch } from "@/components/ux/advanced-search"

interface BlogFiltersProps {
  categories: Category[]
  tags: Tag[]
}

export function BlogFilters({ categories, tags }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const selectedCategory = searchParams.get("category")
  const selectedTag = searchParams.get("tag")

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Reset to first page when filtering
    params.delete("page")

    router.push(`/blog?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters("search", searchQuery || null)
  }

  const clearFilters = () => {
    setSearchQuery("")
    router.push("/blog")
  }

  const hasActiveFilters = selectedCategory || selectedTag || searchQuery

  return (
    <div className="space-y-4">
      <AdvancedSearch placeholder="Search medical articles, procedures, research..." />

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedCategory || "all"} onValueChange={(value) => updateFilters("category", value || null)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTag || "all"} onValueChange={(value) => updateFilters("tag", value || null)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.slug}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => updateFilters("category", null)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedTag && selectedTag !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Tag: {tags.find((t) => t.slug === selectedTag)?.name}
              <button onClick={() => updateFilters("tag", null)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery("")
                  updateFilters("search", null)
                }}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
