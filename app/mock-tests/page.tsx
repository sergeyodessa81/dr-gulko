import { ChatLab } from "@/components/ChatLab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mock Tests - Goethe & TELC Exam Preparation | Dr. Gulko",
  description:
    "Practice German exam tasks for Goethe and TELC certificates. Get scoring guidance and model answers for all 4 skills.",
}

export default function MockTestsPage() {
  return (
    <ChatLab
      lab="mock-tests"
      title="Mock Tests"
      description="Goethe/TELC prep with scoring"
      helpText="Practice exam tasks for reading, listening, writing, and speaking. Get scoring guidance and model answers."
      defaultLevel="B1"
    />
  )
}
