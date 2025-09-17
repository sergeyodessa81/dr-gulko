import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { cards } = await req.json() as { cards: { front: string; back: string; tags?: string[] }[] };
  const csvRows = ["Front,Back,Tags"];
  for (const card of cards) {
    const tags = (card.tags || []).join(" ");
    const front = card.front.replace(/"/g, '""');
    const back = card.back.replace(/"/g, '""');
    csvRows.push(`"${front}","${back}","${tags}"`);
  }
  const csv = csvRows.join("\n");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="anki-export.csv"',
    }
  });
}
