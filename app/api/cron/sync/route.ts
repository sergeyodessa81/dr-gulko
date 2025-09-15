import { NextResponse } from "next/server"
import { syncNotionDatabase } from "@/lib/sync/notion"
import { syncGoogleDriveFolder } from "@/lib/sync/drive"

export async function GET() {
  try {
    const results = []

    // Sync from Notion if configured
    if (process.env.NOTION_DATABASE_ID) {
      const notionResult = await syncNotionDatabase(process.env.NOTION_DATABASE_ID)
      results.push({ source: "notion", ...notionResult })
    }

    // Sync from Google Drive if configured
    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
      const driveResult = await syncGoogleDriveFolder(process.env.GOOGLE_DRIVE_FOLDER_ID)
      results.push({ source: "drive", ...driveResult })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Cron sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
