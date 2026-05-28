import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function errorToJson(error: unknown) {
  const err = error as {
    name?: string;
    message?: string;
    status?: number;
    code?: number;
    response?: { status?: number };
  };

  return {
    name: err?.name ?? "UnknownError",
    message: err?.message ?? String(error),
    status: err?.status ?? err?.response?.status ?? err?.code ?? null,
  };
}

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return Response.json(
        { ok: false, error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model,
      contents: "Réponds uniquement: OK",
      config: {
        temperature: 0,
        maxOutputTokens: 20,
      },
    });

    return Response.json({
      ok: true,
      model,
      text: response.text,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: errorToJson(error),
      },
      { status: 500 }
    );
  }
}