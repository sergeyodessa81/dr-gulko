import { ChatLab } from "@/components/ChatLab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Teacher - German Conversation Practice | Dr. Gulko",
  description:
    "Practice German conversation with AI teacher. Get personalized feedback, corrections, and follow-up questions adapted to your level (A0-C1).",
}

export default function AITeacherPage() {
  return (
    <ChatLab
      lab="ai-teacher"
      title="AI Teacher"
      description="Personalized conversations and feedback"
      helpText="Practice German conversation with an AI teacher who adapts to your level and provides gentle corrections."
      defaultLevel="B1"
    />
  )
}
