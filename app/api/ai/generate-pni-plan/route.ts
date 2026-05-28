import { GoogleGenAI, Type } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                "Tu es un médecin responsable PNI / vaccination.",
                "Analyse les données d’un centre de santé.",
                "Génère en français des problèmes identifiés et des activités planifiées.",
                "Utilise uniquement les données fournies.",
                "N’invente pas de faits absents.",
                "Sois concret, court, professionnel, comme dans une présentation provinciale PNI.",
                "Mentionne les antigènes avec couverture faible, les ruptures ou risques de stock, les pertes, les expirations, et les problèmes de suivi si les données les suggèrent.",
                "",
                "Données JSON :",
                JSON.stringify(body, null, 2),
              ].join("\n"),
            },
          ],
        },
      ],
      config: {
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

    const text = response.text;

    if (!text) {
      return Response.json(
        {
          error: "Gemini n’a retourné aucun texte.",
        },
        {
          status: 500,
        }
      );
    }

    const result = JSON.parse(text);

    return Response.json({
      problems: Array.isArray(result.problems) ? result.problems : [],
      activities: Array.isArray(result.activities) ? result.activities : [],
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