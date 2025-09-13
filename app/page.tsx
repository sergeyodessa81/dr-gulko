import Link from "next/link"
import { FeatureCard } from "@/components/feature-card"
import { MessageCircle, PenTool, FileText, Stethoscope, Target, GraduationCap } from "lucide-react"

const features = [
  {
    icon: MessageCircle,
    title: "AI Teacher",
    description: "Personalized conversations and feedback",
    href: "/ai-teacher",
  },
  {
    icon: PenTool,
    title: "Writing Lab",
    description: "Essay & email training with detailed feedback",
    href: "/writing-lab",
  },
  {
    icon: FileText,
    title: "Mock Tests",
    description: "Goethe/TELC prep with scoring",
    href: "/mock-tests",
  },
  {
    icon: Stethoscope,
    title: "Medical German",
    description: "Clinical vocabulary & scenarios",
    href: "/medical-german",
  },
  {
    icon: Target,
    title: "Error Tracking",
    description: "Learn from mistakes (session-only)",
    href: "/error-tracking",
  },
  {
    icon: GraduationCap,
    title: "All Levels",
    description: "From A0 to C1 with structured path",
    href: "/all-levels",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left sidebar navigation */}
          <div className="lg:w-64 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Learn</h2>
              <nav className="space-y-2">
                {features.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {feature.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-12">
            {/* Hero section */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance">Everything You Need to Master German</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                AI-powered German learning with personalized feedback, practice tests, and specialized training for all
                levels.
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.href}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  href={feature.href}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
