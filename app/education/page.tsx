import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Users, Award } from "lucide-react"

export default function EducationPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Medical Education
          </Badge>
          <h1 className="font-serif text-4xl font-bold text-balance mb-6">Comprehensive Learning Experience</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Explore our comprehensive medical education platform designed for trauma and orthopedic surgery
            professionals at every level.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Blog & Articles</CardTitle>
              <CardDescription>
                In-depth articles on surgical techniques, case studies, and medical insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/blog">Explore Articles</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                <Brain className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>AI Language-Lab</CardTitle>
              <CardDescription>Personalized learning paths powered by artificial intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/language-lab">Start Learning</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Premium Membership</CardTitle>
              <CardDescription>Access exclusive content, advanced courses, and direct mentorship</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/pricing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Certification</CardTitle>
              <CardDescription>Earn certificates and CME credits for your professional development</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
