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
            MSU medical graduate and future orthopedic surgeon
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
           With clinical, surgical, and teaching experience; a surgical competition winner with publications, committed to evidence-based learning.
            
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Clinical Experience</CardTitle>
              <CardDescription>Hands-on training in trauma and orthopedic surgery</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 6 years of medical education (MSU)</li>
                <li>• Clinical internships in trauma & orthopedics</li>
                <li>• Assisted in surgeries and patient care</li>
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
                <li>• Teaching experience for medical students</li>
                <li>• Winner of surgical Olympiads</li>
                <li>• Experience in USMLE preparation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Research & Innovation</CardTitle>
              <CardDescription>Contributing to scientific knowledge in medicine through research and technology</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Research on biomaterials and tissue regeneration</li>
                <li>• Active participation in academic conferences</li>
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
              <CardDescription>Building an international medical career</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Experience in Ukraine, Russia, and Turkey</li>
                <li>• Multilingual: Russian, Ukrainian, English, German</li>
                <li>• Future plans: residency in Europe, international collaboration</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
