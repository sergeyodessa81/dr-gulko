import { ChatLab } from "@/components/chat-lab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Teacher - Dr. Gulko German Learning",
  description: "Practice German conversation with AI-powered personalized feedback and corrections.",
}

export default function AITeacherPage() {
  return (
    <ChatLab
      lab="ai-teacher"
      title="AI German Teacher"
      description="Practice German conversation with personalized feedback. Your AI teacher will correct mistakes and guide you through natural conversations."
    />
  )
}
