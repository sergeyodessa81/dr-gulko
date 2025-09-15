import { ChatLab } from "@/components/chat-lab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mock Tests - Dr. Gulko German Learning",
  description: "Practice Goethe and TELC exam tasks with scoring and model answers.",
}

export default function MockTestsPage() {
  return (
    <ChatLab
      lab="mock-tests"
      title="German Mock Tests"
      description="Practice official German exam tasks (Goethe/TELC) with scoring guidance and model answers for all four skills."
    />
  )
}
