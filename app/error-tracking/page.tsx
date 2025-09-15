import { ChatLab } from "@/components/chat-lab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Error Tracking - Dr. Gulko German Learning",
  description: "Identify and practice your most common German mistakes with targeted exercises.",
}

export default function ErrorTrackingPage() {
  return (
    <ChatLab
      lab="error-tracking"
      title="Error Tracking"
      description="Analyze your German mistakes and get targeted practice exercises to improve your weak areas (session-only tracking)."
    />
  )
}
