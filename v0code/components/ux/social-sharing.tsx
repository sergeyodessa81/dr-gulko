"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Twitter, Linkedin, Facebook, Link, Check } from "lucide-react"

interface SocialSharingProps {
  title: string
  url: string
  description?: string
}

export function SocialSharing({ title, url, description }: SocialSharingProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    url: typeof window !== "undefined" ? `${window.location.origin}${url}` : url,
    text: description || title,
  }

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Share cancelled")
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "width=600,height=400,scrollbars=yes,resizable=yes")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.twitter)} className="flex items-center gap-2">
          <Twitter className="h-4 w-4" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.linkedin)} className="flex items-center gap-2">
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.facebook)} className="flex items-center gap-2">
          <Facebook className="h-4 w-4" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink} className="flex items-center gap-2">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
