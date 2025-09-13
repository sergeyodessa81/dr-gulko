import { ChatLab } from "@/components/ChatLab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Writing Lab - German Essay & Email Training | Dr. Gulko",
  description:
    "Improve your German writing skills with AI-powered feedback. Get corrections, style tips, and detailed notes for emails and essays.",
}

export default function WritingLabPage() {
  return (
    <ChatLab
      lab="writing-lab"
      title="Writing Lab"
      description="Essay & email training with detailed feedback"
      helpText="Submit your German texts and receive corrected versions with grammar notes and style suggestions."
      defaultLevel="B1"
    />
  )
}
