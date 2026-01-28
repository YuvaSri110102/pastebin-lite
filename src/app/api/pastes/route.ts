import { nanoid } from "nanoid";
import { createPasteSchema } from "@/lib/validation";
import { Paste } from "@/types/paste";
import { kv } from "node_modules/@vercel/kv/dist/index.cjs";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createPasteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = parsed.data;
  console.log("[CREATE] Input ttl_seconds:", ttl_seconds);

  const now = Date.now();
  console.log("[CREATE] now(ms):", now);


  const paste: Paste = {
    id: nanoid(8),
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views: 0,
  };
  console.log("[CREATE] expires_at(ms):", paste.expires_at);

  console.log("[CREATE] Saving paste JSON:", paste);

  await kv.set(`paste:${paste.id}`, JSON.stringify(paste));

  const raw = await kv.get(`paste:${paste.id}`);
  console.log("[CREATE] Stored raw value in Redis:", raw);

  return Response.json(
    {
      id: paste.id,
      url: `${new URL(req.url).origin}/p/${paste.id}`,
    },
    { status: 201 }
  );
}

