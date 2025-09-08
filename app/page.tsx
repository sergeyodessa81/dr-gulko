import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Stethoscope, Brain, BookOpen, Users, Award, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              Swiss Medical Futurism
            </Badge>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-balance lg:text-6xl">
              Advanced Medical Education for the <span className="text-primary">Future of Surgery</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Join Dr. Gulko&apos;s comprehensive platform for trauma and orthopedic surgery education. Experience
              personalized AI-powered learning paths designed for medical professionals.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn About Dr. Gulko</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-balance">Precision Learning for Medical Excellence</h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Our platform combines cutting-edge medical knowledge with innovative learning technologies
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Expert Medical Content</CardTitle>
                <CardDescription>
                  Comprehensive trauma and orthopedic surgery education from a leading specialist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Advanced surgical techniques</li>
                  <li>• Real case studies</li>
                  <li>• Evidence-based practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>AI Language-Lab</CardTitle>
                <CardDescription>Personalized learning paths powered by artificial intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Adaptive learning algorithms</li>
                  <li>• Personalized recommendations</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription>Access content in English, German, Russian, and Ukrainian</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Native language learning</li>
                  <li>• Cultural context</li>
                  <li>• Global accessibility</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Premium Content</CardTitle>
                <CardDescription>Exclusive articles, research, and advanced learning materials</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Latest research findings</li>
                  <li>• Exclusive case studies</li>
                  <li>• Advanced techniques</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community Learning</CardTitle>
                <CardDescription>Connect with fellow medical professionals worldwide</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Professional networking</li>
                  <li>• Discussion forums</li>
                  <li>• Peer collaboration</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Certification Ready</CardTitle>
                <CardDescription>Prepare for medical certifications and continuing education</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• CME credits available</li>
                  <li>• Certification prep</li>
                  <li>• Progress certificates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-balance">Ready to Advance Your Medical Career?</h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Join thousands of medical professionals who trust Dr. Gulko&apos;s expertise
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/education">Explore Content</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
