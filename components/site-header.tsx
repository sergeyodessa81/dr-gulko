"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/free-guide", label: "Free Guide" },
  { href: "/pricing", label: "Pricing" },
  { href: "/learn", label: "Learn" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-semibold">
          Dr. Gulko
        </Link>
        <nav className="flex gap-4 text-sm">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={
                pathname === i.href ? "font-semibold" : "opacity-80 hover:opacity-100"
              }
            >
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex gap-2">
          <Link href="/login" className="text-sm">
            Login
          </Link>
          <Link href="/signup" className="text-sm">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
