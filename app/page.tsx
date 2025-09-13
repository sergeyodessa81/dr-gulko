import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, PenTool, Award, Stethoscope, TrendingUp, BarChart3 } from "lucide-react"
import { FeatureCard } from "@/components/FeatureCard"
import { InstallPrompt } from "@/components/pwa/install-prompt"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-bold">Dr. Gulko German</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/guide" className="text-sm font-medium hover:text-primary">
              Free Guide
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Learn Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h2 className="font-semibold text-lg mb-4">Learn</h2>
                <nav className="space-y-2">
                  <Link
                    href="/ai-teacher"
                    className="block px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    AI Teacher
                  </Link>
                  <Link
                    href="/writing-lab"
                    className="block px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    Writing Lab
                  </Link>
                  <Link
                    href="/mock-tests"
                    className="block px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    Mock Tests
                  </Link>
                  <Link
                    href="/medical-german"
                    className="block px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    Medical German
                  </Link>
                  <Link
                    href="/error-tracking"
                    className="block px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    Error Tracking
                  </Link>
                  <Link
                    href="/all-levels"
                    className="block px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    All Levels
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Hero Section */}
              <section className="text-center mb-16">
                <h1 className="font-serif text-4xl font-bold tracking-tight text-balance lg:text-5xl mb-6">
                  Everything You Need to Master German
                </h1>
                <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
                  AI-powered German learning from A0 to C1, with specialized medical German. Free practice with 10 daily
                  AI responses - no login required.
                </p>
                <Button size="lg" asChild>
                  <Link href="/ai-teacher">Start Learning Now</Link>
                </Button>
              </section>

              {/* Feature Cards Grid */}
              <section>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    icon={Brain}
                    title="AI Teacher"
                    description="Personalized conversations and feedback"
                    href="/ai-teacher"
                  />
                  <FeatureCard
                    icon={PenTool}
                    title="Writing Lab"
                    description="Essay & email training with detailed feedback"
                    href="/writing-lab"
                  />
                  <FeatureCard
                    icon={Award}
                    title="Mock Tests"
                    description="Goethe/TELC prep with scoring"
                    href="/mock-tests"
                  />
                  <FeatureCard
                    icon={Stethoscope}
                    title="Medical German"
                    description="Clinical vocabulary & scenarios"
                    href="/medical-german"
                  />
                  <FeatureCard
                    icon={BarChart3}
                    title="Error Tracking"
                    description="Learn from mistakes (session-only)"
                    href="/error-tracking"
                  />
                  <FeatureCard
                    icon={TrendingUp}
                    title="All Levels"
                    description="From A0 to C1 with structured path"
                    href="/all-levels"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-16">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-bold">Dr. Gulko German</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered German learning from A0 to C1, with medical specialization.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Learn</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/ai-teacher" className="hover:text-primary">
                    AI Teacher
                  </Link>
                </li>
                <li>
                  <Link href="/writing-lab" className="hover:text-primary">
                    Writing Lab
                  </Link>
                </li>
                <li>
                  <Link href="/mock-tests" className="hover:text-primary">
                    Mock Tests
                  </Link>
                </li>
                <li>
                  <Link href="/medical-german" className="hover:text-primary">
                    Medical German
                  </Link>
                </li>
                <li>
                  <Link href="/error-tracking" className="hover:text-primary">
                    Error Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/all-levels" className="hover:text-primary">
                    All Levels
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/guide" className="hover:text-primary">
                    Free Guide
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="mailto:contact@drgulko.org" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Dr. Gulko German Learning Platform. All rights reserved.
          </div>
        </div>
      </footer>

      <InstallPrompt />
    </div>
  )
}
