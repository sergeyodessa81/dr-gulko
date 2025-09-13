import { ChatLab } from "@/components/ChatLab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Levels - German Placement & Study Plan | Dr. Gulko",
  description:
    "Find your German level and get a personalized 2-week study plan. From A0 beginner to C1 advanced with structured daily tasks.",
}

export default function AllLevelsPage() {
  return (
    <ChatLab
      lab="all-levels"
      title="All Levels"
      description="From A0 to C1 with structured path"
      helpText="Take a quick placement test and receive a personalized 2-week study plan with daily 15-25 minute tasks."
      defaultLevel="A1"
    />
  )
}
