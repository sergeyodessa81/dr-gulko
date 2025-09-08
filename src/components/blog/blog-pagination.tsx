"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  totalPosts: number
  postsPerPage: number
}

export function BlogPagination({ currentPage, totalPages, totalPosts, postsPerPage }: BlogPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page > 1) {
      params.set("page", page.toString())
    } else {
      params.delete("page")
    }
    router.push(`/blog?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const startPost = (currentPage - 1) * postsPerPage + 1
  const endPost = Math.min(currentPage * postsPerPage, totalPosts)

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {startPost}-{endPost} of {totalPosts} articles
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show first page, last page, current page, and pages around current
              return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
            })
            .map((page, index, array) => {
              // Add ellipsis if there's a gap
              const showEllipsis = index > 0 && page - array[index - 1] > 1

              return (
                <div key={page} className="flex items-center gap-1">
                  {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => navigateToPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                </div>
              )
            })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
