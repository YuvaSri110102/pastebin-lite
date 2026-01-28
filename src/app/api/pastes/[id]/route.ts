import { fetchPasteAtomic } from "@/lib/pasteService";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log("Fetched ID:", id);
  let result;
  try {
    result = await fetchPasteAtomic(req, id);
    console.log("[API GET] fetch success:", result);
  } catch (e: any) {
    console.log("[API GET] fetch failed (expired or missing)");
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (!result) {
     console.log("Fetched paste:", result);
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const data = result as {
    content: string;
    remaining_views: number | null;
    expires_at: number | null;
  };

  return Response.json({
    content: data.content,
    remaining_views: data.remaining_views === undefined ? null : data.remaining_views,
    expires_at: data.expires_at
      ? new Date(data.expires_at).toISOString()
      : null,
  });
}
