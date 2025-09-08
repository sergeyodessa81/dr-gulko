import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Dr. Gulko - German Learning Platform",
  description:
    "Master German from A0 to C1 with AI-powered learning. Medical German specialization for healthcare professionals.",
  generator: "Next.js",
  keywords: ["German learning", "medical German", "A0 to C1", "AI language learning", "Dr. Gulko"],
  authors: [{ name: "Dr. Gulko", url: "https://drgulko.org" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dr. Gulko German",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Dr. Gulko - German Learning Platform",
    description: "Master German from A0 to C1 with AI-powered learning and medical specialization.",
    type: "website",
    siteName: "Dr. Gulko German Learning",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Gulko - German Learning Platform",
    description: "Master German from A0 to C1 with AI-powered learning and medical specialization.",
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`font-sans ${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <div className="relative flex min-h-screen flex-col">{children}</div>
            <Toaster />
          </Suspense>
        </ThemeProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[PWA] Service Worker registered successfully:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('[PWA] Service Worker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
