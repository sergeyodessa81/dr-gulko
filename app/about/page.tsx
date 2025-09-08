import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, GraduationCap, Award, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            About Dr. Gulko
          </Badge>
          <h1 className="font-serif text-4xl font-bold text-balance mb-6">
            Leading Expert in Trauma & Orthopedic Surgery
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            With over 15 years of experience in trauma and orthopedic surgery, Dr. Gulko combines clinical excellence
            with innovative educational approaches to advance medical knowledge.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Clinical Excellence</CardTitle>
              <CardDescription>Specialized in complex trauma cases and advanced orthopedic procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 15+ years surgical experience</li>
                <li>• 1000+ successful procedures</li>
                <li>• Trauma center leadership</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Medical Education</CardTitle>
              <CardDescription>Passionate educator developing next-generation medical professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Medical school faculty</li>
                <li>• Residency program director</li>
                <li>• International speaker</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Research & Innovation</CardTitle>
              <CardDescription>Contributing to medical advancement through research and technology</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 50+ peer-reviewed publications</li>
                <li>• Medical device innovation</li>
                <li>• AI in surgery research</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Global Impact</CardTitle>
              <CardDescription>Serving medical communities worldwide through education and mentorship</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• International collaborations</li>
                <li>• Medical mission work</li>
                <li>• Multilingual education</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
