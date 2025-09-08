import "server-only"
import { Client } from "@notionhq/client"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export interface NotionPage {
  id: string
  title: string
  content: string
  tags: string[]
  status: string
  lastEdited: string
}

export async function syncNotionDatabase(databaseId: string) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
    })

    const supabase = createServerClient(cookies())
    const syncResults = []

    for (const page of response.results) {
      if ("properties" in page) {
        const title = extractTitle(page.properties)
        const tags = extractTags(page.properties)
        const content = await getPageContent(page.id)

        // Convert Notion blocks to MDX
        const mdxContent = await convertNotionToMDX(content)

        // Check if post exists
        const { data: existingPost } = await supabase
          .from("posts")
          .select("id, updated_at")
          .eq("notion_id", page.id)
          .single()

        if (existingPost) {
          // Update existing post
          const { error } = await supabase
            .from("posts")
            .update({
              title,
              content: mdxContent,
              tags,
              updated_at: new Date().toISOString(),
            })
            .eq("notion_id", page.id)

          if (!error) {
            syncResults.push({ id: page.id, action: "updated", title })
          }
        } else {
          // Create new post
          const { error } = await supabase.from("posts").insert({
            title,
            slug: generateSlug(title),
            content: mdxContent,
            tags,
            status: "published",
            notion_id: page.id,
            language: "en",
          })

          if (!error) {
            syncResults.push({ id: page.id, action: "created", title })
          }
        }
      }
    }

    return { success: true, results: syncResults }
  } catch (error) {
    console.error("Notion sync error:", error)
    return { success: false, error: error.message }
  }
}

function extractTitle(properties: any): string {
  const titleProp = Object.values(properties).find((prop: any) => prop.type === "title")
  return titleProp?.title?.[0]?.plain_text || "Untitled"
}

function extractTags(properties: any): string[] {
  const tagsProp = properties.Tags || properties.tags
  if (tagsProp?.type === "multi_select") {
    return tagsProp.multi_select.map((tag: any) => tag.name)
  }
  return []
}

async function getPageContent(pageId: string) {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  })
  return blocks.results
}

async function convertNotionToMDX(blocks: any[]): Promise<string> {
  let mdx = ""

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        mdx += `${block.paragraph.rich_text.map((text: any) => text.plain_text).join("")}\n\n`
        break
      case "heading_1":
        mdx += `# ${block.heading_1.rich_text.map((text: any) => text.plain_text).join("")}\n\n`
        break
      case "heading_2":
        mdx += `## ${block.heading_2.rich_text.map((text: any) => text.plain_text).join("")}\n\n`
        break
      case "heading_3":
        mdx += `### ${block.heading_3.rich_text.map((text: any) => text.plain_text).join("")}\n\n`
        break
      case "bulleted_list_item":
        mdx += `- ${block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join("")}\n`
        break
      case "numbered_list_item":
        mdx += `1. ${block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join("")}\n`
        break
      case "code":
        const language = block.code.language || "text"
        const code = block.code.rich_text.map((text: any) => text.plain_text).join("")
        mdx += `\`\`\`${language}\n${code}\n\`\`\`\n\n`
        break
    }
  }

  return mdx.trim()
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
