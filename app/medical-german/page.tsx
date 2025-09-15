import { ChatLab } from "@/components/chat-lab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medical German - Dr. Gulko German Learning",
  description: "Learn clinical German vocabulary and practice medical scenarios for healthcare professionals.",
}

export default function MedicalGermanPage() {
  return (
    <ChatLab
      lab="medical-german"
      title="Medical German"
      description="Master clinical German with medical vocabulary, patient dialogues, and documentation phrases for healthcare professionals."
    />
  )
}
