import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, Eye, BookOpen, Target, Volume2, Map, Zap, Clock, FileText, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Free Guide to Smart German Learning (A1–B2) | Dr. Gulko",
  description:
    "Master German A1-B2 with proven tools, drills, and routines. No fluff. Download our comprehensive guide for Goethe and TELC exam preparation.",
  keywords:
    "learn German A1 A2 B1 B2, German study routine, Goethe exam preparation, TELC German test, German grammar guide, German pronunciation, German learning methods",
  openGraph: {
    title: "Free Guide to Smart German Learning (A1–B2)",
    description: "Tools, drills, routines. No fluff. Master German with our proven methodology.",
    type: "article",
  },
}

const tocItems = [
  {
    icon: Target,
    title: "Goal Setting",
    description: "Define clear, measurable objectives for each proficiency level",
  },
  {
    icon: Zap,
    title: "Input→Output Loop",
    description: "Systematic approach to consuming and producing German content",
  },
  {
    icon: Volume2,
    title: "Pronunciation Basics",
    description: "Master German sounds, stress patterns, and intonation rules",
  },
  {
    icon: Map,
    title: "Core Grammar Map",
    description: "Essential Artikel, Fälle, and Satzbau structures simplified",
  },
  {
    icon: BookOpen,
    title: "Minimal Pairs & Chunks",
    description: "Efficient vocabulary building through pattern recognition",
  },
  {
    icon: Clock,
    title: "Daily 20-min Routine",
    description: "Structured practice schedule for consistent progress",
  },
  {
    icon: FileText,
    title: "Error Notebook",
    description: "Track and eliminate recurring mistakes systematically",
  },
  {
    icon: Award,
    title: "Exam Tips (Goethe/TELC)",
    description: "Strategic preparation for official German certifications",
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Free Guide to Smart German Learning
            <span className="block text-blue-600 mt-2">(A1–B2)</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">Tools, drills, routines. No fluff.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Eye className="w-5 h-5 mr-2" />
              Read Preview
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 bg-transparent"
              asChild
            >
              <Link href="/auth/login?redirect=/guide/download">
                <Download className="w-5 h-5 mr-2" />
                Download (Login Required)
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">What You'll Learn</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Eight proven strategies to accelerate your German learning from beginner to upper-intermediate level.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tocItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-center">{item.title}</h3>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Preview the Guide</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Get a glimpse of the comprehensive methodology and practical tools inside our German learning guide.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/guide/preview-1.jpg"
                  alt="Goal Setting Framework - Define clear learning objectives for each German proficiency level"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Goal Setting Framework</h3>
              <p className="text-sm text-gray-600">
                Learn how to set SMART goals for each proficiency level and track your progress effectively.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/guide/preview-2.jpg"
                  alt="Grammar Map Visualization - Core German grammar structures simplified"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Grammar Map</h3>
              <p className="text-sm text-gray-600">
                Visual breakdown of essential German grammar: Artikel, Fälle, and Satzbau made simple.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/guide/preview-3.jpg"
                  alt="Daily Routine Schedule - 20-minute structured German practice plan"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Daily Routine</h3>
              <p className="text-sm text-gray-600">
                Structured 20-minute daily practice schedule designed for maximum retention and progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Why This Guide Works</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Evidence-Based Methods</h3>
                  <p className="text-gray-600">
                    Based on cognitive science research and proven language acquisition principles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Exam-Focused</h3>
                  <p className="text-gray-600">Specifically designed for Goethe and TELC certification success.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time-Efficient</h3>
                  <p className="text-gray-600">Maximize learning with just 20 minutes of focused daily practice.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Practical Tools</h3>
                  <p className="text-gray-600">Ready-to-use templates, checklists, and tracking systems.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Error Prevention</h3>
                  <p className="text-gray-600">Systematic approach to identifying and eliminating common mistakes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Level-Specific</h3>
                  <p className="text-gray-600">Tailored strategies for A1, A2, B1, and B2 proficiency levels.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Smart German Learning Journey</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of learners who have successfully mastered German using our proven methodology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                <Eye className="w-5 h-5 mr-2" />
                Read Preview Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 bg-transparent"
                asChild
              >
                <Link href="/auth/login?redirect=/guide/download">
                  <Download className="w-5 h-5 mr-2" />
                  Get Full Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
