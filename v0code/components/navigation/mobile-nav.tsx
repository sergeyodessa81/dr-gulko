"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Menu, User, BookOpen, Stethoscope, Brain, ChevronRight, Crown } from "lucide-react"

const navigationItems = [
  {
    title: "About",
    href: "/about",
    icon: User,
    description: "Learn about Dr. Gulko's expertise and background",
  },
  {
    title: "Blog",
    href: "/blog",
    icon: BookOpen,
    description: "Medical insights and educational content",
  },
  {
    title: "Medical Education",
    href: "/education",
    icon: Stethoscope,
    description: "Comprehensive medical learning resources",
    children: [
      {
        title: "Trauma Surgery",
        href: "/education/trauma",
        description: "Advanced trauma surgery techniques and case studies",
      },
      {
        title: "Orthopedics",
        href: "/education/orthopedics",
        description: "Orthopedic surgery principles and innovations",
      },
      {
        title: "Research",
        href: "/education/research",
        description: "Latest research and clinical studies",
      },
    ],
  },
  {
    title: "AI Language-Lab",
    href: "/language-lab",
    icon: Brain,
    description: "Personalized AI-powered medical education",
    isPremium: true,
  },
]

interface MobileNavProps {
  user?: any
  profile?: any
}

export function MobileNav({ user, profile }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const pathname = usePathname()

  const handleLinkClick = () => {
    setOpen(false)
    setExpandedItem(null)
  }

  const toggleExpanded = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 px-0 md:hidden" aria-label="Open navigation menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0" aria-describedby="mobile-nav-description">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-left">Navigation</SheetTitle>
          <p id="mobile-nav-description" className="sr-only">
            Mobile navigation menu for Dr. Gulko's medical education platform
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            {/* User Info */}
            {user && (
              <div className="mb-6 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    {profile?.role && profile.role !== "free" && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        <Crown className="mr-1 h-3 w-3" />
                        {profile.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <nav role="navigation" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.title)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-accent focus:bg-accent focus:outline-none",
                          expandedItem === item.title && "bg-accent",
                        )}
                        aria-expanded={expandedItem === item.title}
                        aria-controls={`${item.title}-submenu`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                        <ChevronRight
                          className={cn("h-4 w-4 transition-transform", expandedItem === item.title && "rotate-90")}
                        />
                      </button>

                      {expandedItem === item.title && (
                        <div
                          id={`${item.title}-submenu`}
                          className="ml-8 mt-2 space-y-1"
                          role="group"
                          aria-labelledby={`${item.title}-button`}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={handleLinkClick}
                              className={cn(
                                "block rounded-md p-2 text-sm transition-colors hover:bg-accent focus:bg-accent focus:outline-none",
                                pathname === child.href && "bg-accent text-accent-foreground",
                              )}
                            >
                              <div className="font-medium">{child.title}</div>
                              <div className="text-xs text-muted-foreground">{child.description}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent focus:bg-accent focus:outline-none",
                        pathname === item.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.title}</span>
                          {item.isPremium && (
                            <Badge variant="secondary" className="text-xs">
                              <Crown className="mr-1 h-3 w-3" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <Separator className="my-4" />

            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground px-3">Quick Actions</h4>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                  <Link
                    href="/bookmarks"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                  >
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Saved Articles</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Sign In</span>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 rounded-lg p-3 bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:bg-primary/90 focus:outline-none"
                  >
                    <span className="text-sm font-medium">Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
