"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string
  category?: { name: string; color: string }
}

interface AdvancedSearchProps {
  placeholder?: string
  className?: string
}

export function AdvancedSearch({ placeholder = "Search articles...", className }: AdvancedSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState(["trauma surgery", "orthopedic procedures", "medical research", "case studies"])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches")
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const searchPosts = async () => {
      setLoading(true)
      try {
        const { data } = await supabase
          .from("posts")
          .select(`
            id,
            title,
            slug,
            excerpt,
            category:categories(name, color)
          `)
          .eq("status", "published")
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
          .limit(5)

        setResults(data || [])
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchPosts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, supabase])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))

    // Navigate to search results
    router.push(`/blog?search=${encodeURIComponent(searchQuery)}`)
    setIsOpen(false)
    setQuery("")
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(`/blog/${result.slug}`)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSearch(query)
            }
          }}
          className="pl-9 pr-4"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-auto">
          <CardContent className="p-0">
            {/* Search Results */}
            {query.length >= 2 && (
              <div className="border-b">
                <div className="p-3 text-sm font-medium text-muted-foreground">Search Results</div>
                {loading ? (
                  <div className="p-3 text-sm text-muted-foreground">Searching...</div>
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full p-3 text-left hover:bg-accent transition-colors border-b last:border-b-0"
                    >
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{result.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{result.excerpt}</div>
                        {result.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${result.category.color}20`,
                              color: result.category.color,
                            }}
                          >
                            {result.category.name}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-sm text-muted-foreground">No results found</div>
                )}
                {query.length >= 2 && (
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full p-3 text-left hover:bg-accent transition-colors text-sm text-primary"
                  >
                    Search for "{query}"
                  </button>
                )}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="border-b">
                <div className="p-3 text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full p-3 text-left hover:bg-accent transition-colors text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <div className="p-3 text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popular Searches
              </div>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full p-3 text-left hover:bg-accent transition-colors text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
