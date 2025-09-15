import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIChatClient from "@/components/AIChatClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Learning Hub - German A1-C1 | Dr. Gulko",
  description:
    "Comprehensive German learning with AI: conversation practice, text editing, content creation, and exam assessment.",
}

export default function AIPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Learning Hub</h1>
          <p className="text-muted-foreground">
            Comprehensive German learning tools powered by AI - from A1 to C1 level
          </p>
        </div>

        <Tabs defaultValue="german" className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-2xl p-1">
            <TabsTrigger value="german" className="rounded-xl">
              German
            </TabsTrigger>
            <TabsTrigger value="editor" className="rounded-xl">
              Editor
            </TabsTrigger>
            <TabsTrigger value="caption" className="rounded-xl">
              Caption
            </TabsTrigger>
            <TabsTrigger value="script" className="rounded-xl">
              Script
            </TabsTrigger>
            <TabsTrigger value="exam-assessor" className="rounded-xl">
              Examiner
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="german" className="space-y-4">
              <div className="rounded-2xl border p-4">
                <h2 className="text-xl font-semibold mb-2">German Tutor</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Practice German with explanations, examples, and exercises. Get Anki cards for vocabulary building.
                </p>
                <AIChatClient mode="german" tier="pro" />
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4">
              <div className="rounded-2xl border p-4">
                <h2 className="text-xl font-semibold mb-2">Text Editor</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit German text for corrections and improvements. Get detailed explanations for each change.
                </p>
                <AIChatClient mode="editor" tier="pro" />
              </div>
            </TabsContent>

            <TabsContent value="caption" className="space-y-4">
              <div className="rounded-2xl border p-4">
                <h2 className="text-xl font-semibold mb-2">Caption Creator</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate engaging German captions for social media with hashtags and variations.
                </p>
                <AIChatClient mode="caption" tier="pro" />
              </div>
            </TabsContent>

            <TabsContent value="script" className="space-y-4">
              <div className="rounded-2xl border p-4">
                <h2 className="text-xl font-semibold mb-2">Script Writer</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Create German video scripts with hooks, beats, and call-to-actions. Perfect for content creators.
                </p>
                <AIChatClient mode="script" tier="pro" />
              </div>
            </TabsContent>

            <TabsContent value="exam-assessor" className="space-y-4">
              <div className="rounded-2xl border p-4">
                <h2 className="text-xl font-semibold mb-2">Exam Assessor</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit your German writing for telc/Goethe exam assessment with detailed scoring and feedback.
                </p>
                <AIChatClient mode="exam-assessor" tier="pro" />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
