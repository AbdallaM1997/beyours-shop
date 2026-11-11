import "server-only";
import { GoogleGenAI } from "@google/genai";
import { buildPrompt, checkPrompt, isOverDailyLimit, type GuardResult, type StudioStyle } from "./guard";

// Nano Banana 2. Check https://ai.google.dev/gemini-api/docs/nanobanana for current model ids.
export const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3.1-flash-image";

let client: GoogleGenAI | null = null;
function ai() {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

export type GenerateInput = {
  prompt: string;
  style?: StudioStyle;
  /** Optional reference photo (e.g. "Cartoon my photo"), base64 without the data: prefix. */
  referenceImage?: { mimeType: string; data: string };
  usedToday: number;
};

export type GenerateResult =
  | { ok: true; images: { mimeType: string; data: string }[] }
  | { ok: false; reason: Exclude<GuardResult, { ok: true }>["reason"] | "rate_limited" | "no_image" };

/**
 * The only place the app talks to the image model. Server-side only.
 * TODO (M4): moderation check on prompt and result, log to `generations` with cost, background removal.
 */
export async function generateDesign(input: GenerateInput): Promise<GenerateResult> {
  if (isOverDailyLimit(input.usedToday)) return { ok: false, reason: "rate_limited" };
  const guard = checkPrompt(input.prompt);
  if (!guard.ok) return guard;

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: buildPrompt(guard.prompt, input.style) },
  ];
  if (input.referenceImage) parts.push({ inlineData: input.referenceImage });

  const response = await ai().models.generateContent({
    model: IMAGE_MODEL,
    contents: [{ role: "user", parts }],
    config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1" } },
  });

  const images =
    response.candidates?.[0]?.content?.parts
      ?.filter((p) => p.inlineData?.data)
      .map((p) => ({ mimeType: p.inlineData!.mimeType ?? "image/png", data: p.inlineData!.data! })) ?? [];

  return images.length ? { ok: true, images } : { ok: false, reason: "no_image" };
}
