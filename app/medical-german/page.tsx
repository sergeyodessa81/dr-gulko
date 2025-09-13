import { ChatLab } from "@/components/ChatLab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medical German - Clinical Vocabulary & Scenarios | Dr. Gulko",
  description:
    "Learn medical German for healthcare professionals. Practice clinical dialogues, terminology, and documentation phrases.",
}

export default function MedicalGermanPage() {
  return (
    <ChatLab
      lab="medical-german"
      title="Medical German"
      description="Clinical vocabulary & scenarios"
      helpText="Practice medical German with doctor-patient dialogues, clinical terminology, and documentation phrases. For language training only."
      defaultLevel="B2"
    />
  )
}
