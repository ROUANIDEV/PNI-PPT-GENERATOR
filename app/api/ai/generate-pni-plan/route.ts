import { GoogleGenAI, Type } from "@google/genai";

export const runtime = "nodejs";

const MAX_ITEMS = 4;
const MAX_ITEM_CHARS = 105;
const MAX_JSON_INPUT_CHARS = 12000;

type GeminiPniPlan = {
  problems?: unknown;
  activities?: unknown;
};

type GeminiCallResult = {
  plan: GeminiPniPlan;
  model: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unknown Gemini error";
}

function getSafeErrorName(error: unknown): string {
  if (error instanceof Error) return error.name;
  return "UnknownError";
}

function getReportData(body: unknown): unknown {
  if (!isRecord(body)) return body;

  const report = body.report;

  if (isRecord(report) && "values" in report) {
    return report.values;
  }

  if ("values" in body) {
    return body.values;
  }

  if ("report" in body) {
    return body.report;
  }

  return body;
}

function safeStringify(value: unknown): string {
  const json = JSON.stringify(value, null, 2) ?? "{}";

  if (json.length <= MAX_JSON_INPUT_CHARS) {
    return json;
  }

  return `${json.slice(0, MAX_JSON_INPUT_CHARS)}

[JSON tronqué pour limiter la taille du prompt]`;
}

function cleanBullet(value: unknown): string {
  return String(value ?? "")
    .replace(/^[\s•\-–—*]+/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:%)])/g, "$1")
    .trim();
}

function shortenText(text: string, maxChars = MAX_ITEM_CHARS): string {
  if (text.length <= maxChars) return text;

  const slice = text.slice(0, maxChars + 1);

  const breakAt = Math.max(
    slice.lastIndexOf(";"),
    slice.lastIndexOf(","),
    slice.lastIndexOf("."),
    slice.lastIndexOf(" ")
  );

  const end = breakAt > maxChars * 0.6 ? breakAt : maxChars;

  return `${slice.slice(0, end).trim()}…`;
}

function normalizeItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const items: string[] = [];

  for (const rawItem of value) {
    const cleaned = cleanBullet(rawItem);
    const shortened = shortenText(cleaned);

    if (!shortened) continue;

    const key = shortened.toLowerCase();

    if (seen.has(key)) continue;

    seen.add(key);
    items.push(shortened);

    if (items.length >= MAX_ITEMS) break;
  }

  return items;
}

function parseGeminiJson(text: string): GeminiPniPlan {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as GeminiPniPlan;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as GeminiPniPlan;
    }

    throw new Error(`Gemini returned invalid JSON: ${cleaned.slice(0, 300)}`);
  }
}

function buildPrompt(reportData: unknown): string {
  return [
    "Tu es un médecin responsable PNI / vaccination.",
    "Analyse les données d’un centre de santé.",
    "Génère une synthèse française très courte pour un tableau PowerPoint.",
    "",
    "OBJECTIF:",
    "Produire un contenu compact qui tient dans une cellule de tableau PowerPoint.",
    "",
    "RÈGLES STRICTES:",
    `- problems: maximum ${MAX_ITEMS} puces.`,
    `- activities: maximum ${MAX_ITEMS} puces.`,
    `- Chaque puce: maximum ${MAX_ITEM_CHARS} caractères, espaces inclus.`,
    "- Une puce = une seule idée prioritaire.",
    "- Pas de sous-puces.",
    "- Pas de markdown.",
    "- Pas de texte avant ou après le JSON.",
    "- Pas de longues phrases.",
    "- Pas de longues listes entre parenthèses.",
    "- Ne cite pas tous les antigènes un par un si plusieurs sont faibles.",
    "- Regroupe les antigènes faibles dans une seule puce.",
    "- Utilise un style court, professionnel, PNI provincial.",
    "",
    "PRIORITÉ D’ANALYSE:",
    "1. Rupture ou risque de stock.",
    "2. Couverture vaccinale faible.",
    "3. Pertes, doses expirées ou mauvaise gestion.",
    "4. Abandons, suivi incomplet ou carnets perdus.",
    "",
    "INTERDICTIONS:",
    "- Ne pas inventer de données.",
    "- Ne pas expliquer la méthode.",
    "- Ne pas répéter le même problème.",
    "- Ne pas écrire des paragraphes.",
    "",
    "FORMAT JSON OBLIGATOIRE:",
    '{ "problems": ["...", "..."], "activities": ["...", "..."] }',
    "",
    "EXEMPLE DU STYLE ATTENDU:",
    JSON.stringify(
      {
        problems: [
          "Taux PNEUMO4 très faible (22,9 %) + rupture de stock.",
          "Couverture BCG modérée malgré stock disponible.",
          "HPV: couverture très faible et risque d’abandon.",
          "Perte de carnets de vaccination.",
        ],
        activities: [
          "Renforcer le suivi des enfants incomplets.",
          "Suivre les stocks PNEUMO4 et alerter avant rupture.",
          "Organiser rattrapage ciblé HPV/PN.",
          "Contrôler pertes, expirations et carnets.",
        ],
      },
      null,
      2
    ),
    "",
    "Données JSON à analyser:",
    safeStringify(reportData),
  ].join("\n");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getErrorStatus(error: unknown): number | undefined {
  if (!isRecord(error)) return undefined;

  const status = error.status;

  if (typeof status === "number") return status;

  const response = error.response;

  if (isRecord(response) && typeof response.status === "number") {
    return response.status;
  }

  return undefined;
}

function isRetryableGeminiError(error: unknown): boolean {
  const status = getErrorStatus(error);

  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function getModelCandidates(): string[] {
  const preferredModel = process.env.GEMINI_MODEL?.trim();

  const candidates = [
    preferredModel,
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
  ].filter(Boolean) as string[];

  return Array.from(new Set(candidates));
}

async function callGeminiOnce(params: {
  client: GoogleGenAI;
  model: string;
  prompt: string;
  attempt: number;
}) {
  const { client, model, prompt, attempt } = params;

  return client.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              attempt === 1
                ? prompt
                : `${prompt}

IMPORTANT:
Ta réponse précédente était invalide, tronquée ou le service était occupé.
Retourne uniquement un JSON valide.
Aucun markdown.
Aucun texte avant ou après le JSON.
Maximum ${MAX_ITEMS} problems.
Maximum ${MAX_ITEMS} activities.
Chaque élément doit être très court.`,
          },
        ],
      },
    ],
    config: {
      temperature: 0.1,
      topP: 0.7,
      maxOutputTokens: attempt === 1 ? 1024 : 2048,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["problems", "activities"],
        properties: {
          problems: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    },
  });
}

async function generatePniPlan(prompt: string, apiKey: string): Promise<GeminiCallResult> {
  const client = new GoogleGenAI({
    apiKey,
  });

  const models = getModelCandidates();
  let lastError: unknown = null;
  let lastText = "";

  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await callGeminiOnce({
          client,
          model,
          prompt,
          attempt,
        });

        lastText = response.text ?? "";

        if (!lastText.trim()) {
          throw new Error("Gemini returned empty text.");
        }

        const plan = parseGeminiJson(lastText);

        return {
          plan,
          model,
        };
      } catch (error) {
        lastError = error;

        console.warn(`Gemini call failed`, {
          model,
          attempt,
          status: getErrorStatus(error),
          retryable: isRetryableGeminiError(error),
          preview: lastText.slice(0, 300),
          error,
        });

        const shouldRetrySameModel = isRetryableGeminiError(error) && attempt < 3;

        if (!shouldRetrySameModel) {
          break;
        }

        const delayMs = 800 * 2 ** (attempt - 1);

        await sleep(delayMs);
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini generation failed.");
}

function buildLocalFallbackPlan(): GeminiPniPlan {
  return {
    problems: [
      "Couverture vaccinale faible pour certains antigènes.",
      "Risque de rupture ou insuffisance de stock à surveiller.",
      "Pertes, expirations ou écarts de gestion à contrôler.",
      "Suivi incomplet des enfants et abandons à réduire.",
    ],
    activities: [
      "Renforcer le suivi des enfants incomplets.",
      "Organiser un rattrapage ciblé selon les antigènes faibles.",
      "Suivre les stocks et alerter avant rupture.",
      "Contrôler pertes, expirations et carnets.",
    ],
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error: "Clé GEMINI_API_KEY manquante.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();
    const reportData = getReportData(body);
    const prompt = buildPrompt(reportData);

    let result: GeminiPniPlan;
    let modelUsed: string | null = null;
    let usedFallback = false;

    try {
  const geminiResult = await generatePniPlan(prompt, apiKey);

  result = geminiResult.plan;
  modelUsed = geminiResult.model;
} catch (error) {
  console.error("Gemini unavailable:", {
    name: getSafeErrorName(error),
    message: getSafeErrorMessage(error),
    status: getErrorStatus(error),
  });

  return Response.json(
    {
      error: "Gemini unavailable on server.",
      details: {
        name: getSafeErrorName(error),
        message: getSafeErrorMessage(error),
        status: getErrorStatus(error),
      },
      meta: {
        usedFallback: false,
      },
    },
    { status: 502 }
  );
}

    const problems = normalizeItems(result.problems);
    const activities = normalizeItems(result.activities);

    if (problems.length === 0 || activities.length === 0) {
      throw new Error("Gemini returned empty problems or activities.");
    }

    return Response.json({
      problems,
      activities,
      meta: {
        modelUsed,
        usedFallback,
      },
    });
  } catch (error) {
    console.error("Gemini generation error:", error);

    return Response.json(
      {
        error:
          "Une erreur est survenue pendant la génération Gemini des problèmes et activités.",
      },
      {
        status: 500,
      }
    );
  }
}