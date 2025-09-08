import { google } from "googleapis"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

const drive = google.drive({
  version: "v3",
  auth: new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  }),
})

export async function syncGoogleDriveFolder(folderId: string) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='text/markdown'`,
      fields: "files(id, name, modifiedTime, webViewLink)",
    })

    const supabase = createServerClient(cookies())
    const syncResults = []

    for (const file of response.data.files || []) {
      const content = await getFileContent(file.id!)
      const title = file.name!.replace(".md", "")
      const slug = generateSlug(title)

      // Check if post exists
      const { data: existingPost } = await supabase
        .from("posts")
        .select("id, updated_at")
        .eq("drive_id", file.id)
        .single()

      if (existingPost) {
        // Update if file was modified after last sync
        const fileModified = new Date(file.modifiedTime!)
        const lastSync = new Date(existingPost.updated_at)

        if (fileModified > lastSync) {
          const { error } = await supabase
            .from("posts")
            .update({
              title,
              content,
              updated_at: new Date().toISOString(),
            })
            .eq("drive_id", file.id)

          if (!error) {
            syncResults.push({ id: file.id, action: "updated", title })
          }
        }
      } else {
        // Create new post
        const { error } = await supabase.from("posts").insert({
          title,
          slug,
          content,
          status: "published",
          drive_id: file.id,
          language: "en",
        })

        if (!error) {
          syncResults.push({ id: file.id, action: "created", title })
        }
      }
    }

    return { success: true, results: syncResults }
  } catch (error) {
    console.error("Google Drive sync error:", error)
    return { success: false, error: error.message }
  }
}

async function getFileContent(fileId: string): Promise<string> {
  const response = await drive.files.get({
    fileId,
    alt: "media",
  })
  return response.data as string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
