export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: process.env.GEMINI_MODEL ?? null,
    nodeEnv: process.env.NODE_ENV,
  });
}