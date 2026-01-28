import kv from "@/lib/redis";

export async function GET() {
  try {
    await kv.get("health_check");
    return Response.json({ ok: true });
  } catch {
    return new Response(
      JSON.stringify({ ok: false }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
