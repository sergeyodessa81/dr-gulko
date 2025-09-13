import { ChatLab } from "@/components/ChatLab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Error Tracking - Learn from German Mistakes | Dr. Gulko",
  description:
    "Identify and fix recurring German grammar mistakes. Get personalized error analysis and targeted practice drills.",
}

export default function ErrorTrackingPage() {
  return (
    <ChatLab
      lab="error-tracking"
      title="Error Tracking"
      description="Learn from mistakes (session-only)"
      helpText="Analyze your recurring German errors and get targeted micro-drills to improve specific grammar areas."
      defaultLevel="B1"
    />
  )
}
