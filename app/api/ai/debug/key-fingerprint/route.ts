import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.GEMINI_API_KEY?.trim() ?? "";

  return Response.json({
    exists: Boolean(key),
    length: key.length,
    startsWithAIza: key.startsWith("AIza"),
    fingerprint: crypto
      .createHash("sha256")
      .update(key)
      .digest("hex")
      .slice(0, 12),
  });
}