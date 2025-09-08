import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SiteHeader } from "@/components/navigation/site-header"
import { SkipNav } from "@/components/accessibility/skip-nav"
import { OfflineIndicator } from "@/components/offline/offline-indicator"
import { Suspense } from "react"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

export const metadata: Metadata = {
  title: "Dr. Gulko - Trauma & Orthopedic Surgery Education",
  description:
    "Advanced medical education platform for trauma and orthopedic surgery with AI-powered learning experiences.",
  generator: "v0.app",
  keywords: ["trauma surgery", "orthopedics", "medical education", "AI learning", "Dr. Gulko"],
  authors: [{ name: "Dr. Gulko" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dr. Gulko",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Dr. Gulko - Medical Education Platform",
    description: "Advanced trauma and orthopedic surgery education with personalized AI learning.",
    type: "website",
    siteName: "Dr. Gulko Medical Education",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Gulko - Medical Education Platform",
    description: "Advanced trauma and orthopedic surgery education with personalized AI learning.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Dr. Gulko Medical Education Platform",
              description: "Advanced medical education platform for trauma and orthopedic surgery",
              url: "https://drgulko.com",
              founder: {
                "@type": "Person",
                name: "Dr. Gulko",
                jobTitle: "Trauma & Orthopedic Surgeon",
              },
              educationalCredentialAwarded: "Medical Education Certificate",
              hasCredential: "Medical Education",
            }),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
      <body className={`font-sans ${sourceSans.variable} ${playfairDisplay.variable} antialiased`}>
        <SkipNav />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
            </div>
          </Suspense>
          <OfflineIndicator />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
