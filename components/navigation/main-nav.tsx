"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { User, BookOpen, Stethoscope, Brain } from "lucide-react"

const navigationItems = [
  {
    title: "About",
    href: "/about",
    icon: User,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: BookOpen,
  },
  {
    title: "Medical Education",
    href: "/education",
    icon: Stethoscope,
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
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center space-x-2">
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            {item.children ? (
              <>
                <NavigationMenuTrigger className="flex items-center gap-2 text-sm font-medium">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    {item.children.map((child) => (
                      <NavigationMenuLink key={child.href} asChild>
                        <Link
                          href={child.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{child.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{child.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                    pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
