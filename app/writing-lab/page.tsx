import { ChatLab } from "@/components/chat-lab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Writing Lab - Dr. Gulko German Learning",
  description: "Improve your German writing skills with detailed feedback on emails and essays.",
}

export default function WritingLabPage() {
  return (
    <ChatLab
      lab="writing-lab"
      title="German Writing Lab"
      description="Get detailed feedback on your German writing. Submit emails, essays, or any text for corrections and style improvements."
    />
  )
}
