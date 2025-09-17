import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();
  const token = process.env.NOTION_TOKEN!;
  const db = process.env.NOTION_DB_ID!;
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: db },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title || "DrG Result",
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      ],
    }),
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
}
