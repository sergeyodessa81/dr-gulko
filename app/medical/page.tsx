import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  Brain,
  BookOpen,
  Award,
  ArrowRight,
  Activity,
  FileText,
  MessageSquare,
  Target,
  Clock,
} from "lucide-react"

export default function MedicalGermanPage() {
  const medicalSpecialties = [
    {
      title: "Traumachirurgie",
      description: "Trauma surgery terminology and procedures",
      level: "B2-C1",
      duration: "180 min",
      topics: ["Frakturen", "Notfallchirurgie", "Orthopädie", "Rehabilitation"],
      icon: "🦴",
    },
    {
      title: "Innere Medizin",
      description: "Internal medicine vocabulary and diagnostics",
      level: "B1-B2",
      duration: "150 min",
      topics: ["Kardiologie", "Gastroenterologie", "Pneumologie", "Endokrinologie"],
      icon: "❤️",
    },
    {
      title: "Notfallmedizin",
      description: "Emergency medicine communication",
      level: "B2-C1",
      duration: "120 min",
      topics: ["Triage", "Reanimation", "Akutversorgung", "Patientenkommunikation"],
      icon: "🚑",
    },
    {
      title: "Anästhesie",
      description: "Anesthesiology and perioperative care",
      level: "B2-C1",
      duration: "90 min",
      topics: ["Narkose", "Schmerztherapie", "Intensivmedizin", "Monitoring"],
      icon: "💉",
    },
  ]

  const clinicalScenarios = [
    {
      title: "Patientenaufnahme",
      description: "Patient admission and history taking",
      difficulty: "Intermediate",
      duration: "30 min",
      skills: ["Anamnese", "Körperliche Untersuchung", "Dokumentation"],
    },
    {
      title: "Visite",
      description: "Ward rounds and patient discussions",
      difficulty: "Advanced",
      duration: "45 min",
      skills: ["Befundbesprechung", "Therapieplanung", "Teamkommunikation"],
    },
    {
      title: "Aufklärungsgespräch",
      description: "Patient education and informed consent",
      difficulty: "Advanced",
      duration: "40 min",
      skills: ["Risikoaufklärung", "Einverständniserklärung", "Empathie"],
    },
    {
      title: "Notfallsituation",
      description: "Emergency communication and coordination",
      difficulty: "Expert",
      duration: "25 min",
      skills: ["Schnelle Kommunikation", "Teamführung", "Stressmanagement"],
    },
  ]

  const certificationPaths = [
    {
      title: "Approbation Vorbereitung",
      description: "German medical license preparation",
      modules: 12,
      duration: "6 months",
      level: "C1",
      features: ["Fachsprachenprüfung", "Kenntnisprüfung", "Mock Exams"],
    },
    {
      title: "Fachsprachenprüfung",
      description: "Medical language proficiency test prep",
      modules: 8,
      duration: "3 months",
      level: "B2-C1",
      features: ["Arzt-Patient-Gespräch", "Dokumentation", "Fallpräsentation"],
    },
    {
      title: "Assistenzarzt Training",
      description: "Resident physician communication skills",
      modules: 15,
      duration: "8 months",
      level: "C1",
      features: ["Klinische Kommunikation", "Führungskompetenzen", "Fortbildung"],
    },
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
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/language-lab" className="text-sm font-medium hover:text-primary">
              Language Lab
            </Link>
            <Link href="/medical" className="text-sm font-medium text-primary">
              Medical German
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
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
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-white">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-red-100">
                  <Stethoscope className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-left">
                  <Badge variant="secondary" className="mb-2">
                    Specialized Medical Training
                  </Badge>
                  <h1 className="font-serif text-4xl font-bold tracking-tight text-balance lg:text-6xl">
                    Medical German <span className="text-primary">Mastery</span>
                  </h1>
                </div>
              </div>
              <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Master German medical terminology, patient communication, and clinical documentation. Designed for
                healthcare professionals working in German-speaking countries.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Start Medical Training
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/medical/assessment">Take Assessment</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-serif text-3xl font-bold text-balance">Medical Specialties</h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Comprehensive German language training for different medical specialties
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {medicalSpecialties.map((specialty, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{specialty.icon}</span>
                        <div>
                          <CardTitle className="text-xl">{specialty.title}</CardTitle>
                          <CardDescription>{specialty.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{specialty.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {specialty.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {specialty.topics.length} Topics
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {specialty.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Clinical Scenarios */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-serif text-3xl font-bold text-balance">Clinical Scenarios</h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Practice real-world medical situations with AI-powered role-playing
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {clinicalScenarios.map((scenario, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{scenario.title}</CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          scenario.difficulty === "Expert"
                            ? "destructive"
                            : scenario.difficulty === "Advanced"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {scenario.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {scenario.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4" />
                        {scenario.skills.length} Skills
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scenario.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                      Practice Scenario
                      <MessageSquare className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Preparation */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-serif text-3xl font-bold text-balance">Certification Preparation</h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Comprehensive preparation for German medical certification exams
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {certificationPaths.map((path, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-primary" />
                      <Badge variant="outline">{path.level}</Badge>
                    </div>
                    <CardTitle className="text-xl">{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Modules:</span>
                        <div className="text-muted-foreground">{path.modules}</div>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <div className="text-muted-foreground">{path.duration}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Includes:</h4>
                      <ul className="space-y-1">
                        {path.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full">
                      Start Preparation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Integration */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-serif text-3xl font-bold text-balance">AI-Powered Medical Learning</h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Leverage our advanced AI tools specifically for medical German learning
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">AI Medical Tutor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Practice medical conversations with AI specialized in healthcare terminology
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/lab/teacher">Try Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mx-auto">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Medical Writing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get feedback on medical documentation and patient reports
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/lab/writing">Practice Writing</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Medical Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Take specialized medical German proficiency tests
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/lab/mock-test">Take Test</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mx-auto">
                    <Activity className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor your medical German learning progress and errors
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/lab/error-tracker">View Progress</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold text-balance">Ready to Master Medical German?</h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Join healthcare professionals advancing their careers in German-speaking countries
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Start Medical Training
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/pricing">View Plans</Link>
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
              <h3 className="font-semibold mb-4">Medical German</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/medical/terminology" className="hover:text-primary">
                    Medical Terminology
                  </Link>
                </li>
                <li>
                  <Link href="/medical/scenarios" className="hover:text-primary">
                    Clinical Scenarios
                  </Link>
                </li>
                <li>
                  <Link href="/medical/certification" className="hover:text-primary">
                    Certification Prep
                  </Link>
                </li>
                <li>
                  <Link href="/medical/resources" className="hover:text-primary">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Learning Tools</h3>
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
                  <Link href="/lab/error-tracker" className="hover:text-primary">
                    Error Tracker
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About Dr. Gulko
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
    </div>
  )
}
