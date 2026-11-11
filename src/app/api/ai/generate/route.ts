import { NextResponse } from "next/server";
import { z } from "zod";
import { generateDesign } from "@/server/ai/generate";

const Body = z.object({
  prompt: z.string().max(500),
  style: z.enum(["sticker", "cartoon", "pixel", "watercolor"]).optional(),
  referenceImage: z.object({ mimeType: z.string(), data: z.string() }).optional(),
});

const MESSAGES: Record<string, string> = {
  empty: "Tell us your idea first.",
  too_long: "Please keep your idea under 200 characters.",
  brand_or_character: "We can't print famous characters or brand logos. Try your own idea!",
  unsafe: "Let's keep it kid-friendly. Try another idea!",
  rate_limited: "You've used today's free designs. Come back tomorrow!",
  no_image: "We couldn't draw that one. Try describing it differently.",
};

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  // TODO (M4): read today's usage for this visitor/user from the generations table.
  const usedToday = 0;

  try {
    const result = await generateDesign({ ...parsed.data, usedToday });
    if (!result.ok) {
      const status = result.reason === "rate_limited" ? 429 : 422;
      return NextResponse.json({ error: MESSAGES[result.reason], reason: result.reason }, { status });
    }
    return NextResponse.json({ images: result.images });
  } catch (err) {
    console.error("AI generation failed", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
