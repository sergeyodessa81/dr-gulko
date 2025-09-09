import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, Heart, Brain, Stethoscope } from "lucide-react"

export default function MedicalTerminologyPage() {
  const anatomyTerms = [
    { german: "das Herz", english: "heart", pronunciation: "haɛʁts", category: "Cardiovascular" },
    { german: "die Lunge", english: "lung", pronunciation: "ˈlʊŋə", category: "Respiratory" },
    { german: "die Leber", english: "liver", pronunciation: "ˈleːbɐ", category: "Digestive" },
    { german: "die Niere", english: "kidney", pronunciation: "ˈniːʁə", category: "Urinary" },
    { german: "das Gehirn", english: "brain", pronunciation: "ɡəˈhiʁn", category: "Nervous" },
    { german: "der Knochen", english: "bone", pronunciation: "ˈknɔxn̩", category: "Skeletal" },
  ]

  const procedureTerms = [
    { german: "die Operation", english: "surgery", pronunciation: "ˌopeʁaˈt͡si̯oːn", category: "Surgery" },
    { german: "die Untersuchung", english: "examination", pronunciation: "ˈʊntɐˌzuːxʊŋ", category: "Diagnostics" },
    { german: "die Behandlung", english: "treatment", pronunciation: "bəˈhandlʊŋ", category: "Therapy" },
    { german: "die Diagnose", english: "diagnosis", pronunciation: "ˌdi̯aɡˈnoːzə", category: "Diagnostics" },
    { german: "die Therapie", english: "therapy", pronunciation: "teʁaˈpiː", category: "Therapy" },
    {
      german: "die Rehabilitation",
      english: "rehabilitation",
      pronunciation: "ˌʁehabilitaˈt͡si̯oːn",
      category: "Recovery",
    },
  ]

  const specialtyCategories = [
    { name: "Kardiologie", icon: "❤️", termCount: 45, description: "Heart and cardiovascular system" },
    { name: "Neurologie", icon: "🧠", termCount: 38, description: "Brain and nervous system" },
    { name: "Orthopädie", icon: "🦴", termCount: 52, description: "Bones, joints, and muscles" },
    { name: "Gastroenterologie", icon: "🫁", termCount: 41, description: "Digestive system" },
    { name: "Pneumologie", icon: "🫁", termCount: 33, description: "Respiratory system" },
    { name: "Urologie", icon: "🫘", termCount: 29, description: "Urinary system" },
  ]

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
            <Link href="/medical" className="text-sm font-medium hover:text-primary">
              Medical German
            </Link>
            <Link href="/medical/terminology" className="text-sm font-medium text-primary">
              Terminology
            </Link>
            <Link href="/medical/scenarios" className="text-sm font-medium hover:text-primary">
              Scenarios
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">Start Learning</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/30">
          <div className="container py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/medical" className="hover:text-primary">
                Medical German
              </Link>
              <span>/</span>
              <span className="text-foreground">Medical Terminology</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-serif text-3xl font-bold tracking-tight text-balance lg:text-4xl">
                    Medical Terminology
                  </h1>
                  <p className="text-muted-foreground">Master German medical vocabulary with pronunciation guides</p>
                </div>
              </div>

              {/* Search */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search medical terms..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialty Categories */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="font-serif text-2xl font-bold text-center mb-12">Medical Specialties</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {specialtyCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{category.termCount} terms</Badge>
                      <Button variant="outline" size="sm">
                        Study Terms
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Terminology Tables */}
        <section className="py-16">
          <div className="container">
            <Tabs defaultValue="anatomy" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="anatomy">Anatomy</TabsTrigger>
                <TabsTrigger value="procedures">Procedures</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              </TabsList>

              <TabsContent value="anatomy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Anatomical Terms
                    </CardTitle>
                    <CardDescription>Essential body parts and organ terminology</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">German</th>
                            <th className="text-left py-3 px-4">English</th>
                            <th className="text-left py-3 px-4">Pronunciation</th>
                            <th className="text-left py-3 px-4">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {anatomyTerms.map((term, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{term.german}</td>
                              <td className="py-3 px-4">{term.english}</td>
                              <td className="py-3 px-4 text-muted-foreground font-mono text-sm">
                                /{term.pronunciation}/
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="text-xs">
                                  {term.category}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="procedures" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-blue-500" />
                      Medical Procedures
                    </CardTitle>
                    <CardDescription>Common medical procedures and treatments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">German</th>
                            <th className="text-left py-3 px-4">English</th>
                            <th className="text-left py-3 px-4">Pronunciation</th>
                            <th className="text-left py-3 px-4">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {procedureTerms.map((term, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{term.german}</td>
                              <td className="py-3 px-4">{term.english}</td>
                              <td className="py-3 px-4 text-muted-foreground font-mono text-sm">
                                /{term.pronunciation}/
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="text-xs">
                                  {term.category}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="symptoms" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      Symptoms & Conditions
                    </CardTitle>
                    <CardDescription>Common symptoms and medical conditions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Symptoms terminology coming soon...</p>
                      <Button variant="outline" className="mt-4 bg-transparent">
                        Request Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Practice Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-bold text-balance mb-4">Practice Your Medical German</h2>
              <p className="text-muted-foreground mb-8">
                Use our AI-powered tools to practice medical terminology in context
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/lab/teacher">Practice with AI Teacher</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/lab/mock-test">Take Medical Test</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
