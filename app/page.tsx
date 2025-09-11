import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Brain, Users, Award, Stethoscope, Globe } from "lucide-react"
import { InstallPrompt } from "@/components/pwa/install-prompt"

export default function HomePage() {
  return (
    <div className="flex flex-col">
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
            <Link href="/blog" className="text-sm font-medium hover:text-primary">
              Blog
            </Link>
            <Link href="/guide" className="text-sm font-medium hover:text-primary">
              Free Guide
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4">
                A0 → C1 + Medical German
              </Badge>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-balance lg:text-6xl">
                Master German with <span className="text-primary">AI-Powered Learning</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                From beginner to advanced, including specialized medical German. Built by Dr. Gulko for healthcare
                professionals and German learners worldwide.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/lab/german/demo">Try German Demo</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/guide">Get Free B2→C1 Guide</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold mb-6">About Dr. Gulko</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I'm Dr. Sergey Gulko, a trauma and orthopedics physician from Odesa, now based in Zürich. I'm rebuilding
                my medical career in Switzerland while completing C1 German and preparing for hospitation/Assistenzarzt
                placements. Along the way I'm building an AI-powered learning platform that turns real clinical language
                needs into daily practice—mock tests, feedback on speaking and writing, and smart vocabulary.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="https://instagram.com/dr_gulko" target="_blank">
                    Instagram
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://www.youtube.com/@dr_gulko" target="_blank">
                    YouTube
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://www.linkedin.com/in/sergey-g-a2a3a3119/" target="_blank">
                    LinkedIn
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="mailto:contact@drgulko.org">Email</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-serif text-3xl font-bold text-balance">Everything You Need to Master German</h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                From A0 beginner to C1 advanced, with specialized medical German for healthcare professionals
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI Teacher</CardTitle>
                  <CardDescription>Personalized conversations and feedback powered by advanced AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time conversation practice</li>
                    <li>• Pronunciation feedback</li>
                    <li>• Adaptive difficulty levels</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Writing Lab</CardTitle>
                  <CardDescription>Essay and email training with detailed feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Level-appropriate topics</li>
                    <li>• Vocabulary suggestions</li>
                    <li>• Grammar corrections</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Mock Tests</CardTitle>
                  <CardDescription>Goethe and TELC exam preparation with scoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• All four skills tested</li>
                    <li>• Realistic exam conditions</li>
                    <li>• Detailed score analysis</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Stethoscope className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Medical German</CardTitle>
                  <CardDescription>Specialized vocabulary and scenarios for healthcare</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Clinical terminology</li>
                    <li>• Patient communication</li>
                    <li>• Medical documentation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Error Tracking</CardTitle>
                  <CardDescription>Learn from mistakes with personalized error analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Common error patterns</li>
                    <li>• Targeted practice</li>
                    <li>• Progress visualization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Globe className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>All Levels</CardTitle>
                  <CardDescription>Complete journey from A0 beginner to C1 advanced</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Structured progression</li>
                    <li>• Level assessments</li>
                    <li>• Personalized paths</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold text-balance">Ready to Master German?</h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Join thousands learning German with AI-powered personalization
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Start Free Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/lab/german/demo">Try German Demo</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/guide">Download Free Guide</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-4">
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
                  <Link href="/lab/teacher" className="hover:text-primary">
                    AI Teacher
                  </Link>
                </li>
                <li>
                  <Link href="/lab/writing" className="hover:text-primary">
                    Writing Lab
                  </Link>
                </li>
                <li>
                  <Link href="/lab/mock-test" className="hover:text-primary">
                    Mock Tests
                  </Link>
                </li>
                <li>
                  <Link href="/medical" className="hover:text-primary">
                    Medical German
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guide" className="hover:text-primary">
                    Free Guide
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="https://instagram.com/dr_gulko" className="hover:text-primary">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="https://www.youtube.com/@dr_gulko" className="hover:text-primary">
                    YouTube
                  </Link>
                </li>
                <li>
                  <Link href="https://www.linkedin.com/in/sergey-g-a2a3a3119/" className="hover:text-primary">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="mailto:contact@drgulko.org" className="hover:text-primary">
                    Email
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
