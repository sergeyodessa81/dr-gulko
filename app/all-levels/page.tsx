import { ChatLab } from "@/components/chat-lab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Levels - Dr. Gulko German Learning",
  description: "Structured German learning path from A0 to C1 with placement testing and personalized plans.",
}

export default function AllLevelsPage() {
  return (
    <ChatLab
      lab="all-levels"
      title="All Levels"
      description="Get a personalized German learning plan based on your current level. From complete beginner (A0) to advanced (C1)."
    />
  )
}
