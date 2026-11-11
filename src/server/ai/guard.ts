/**
 * Prompt checks for the AI Design Studio. Kept free of network calls so it can be unit-tested.
 * The block list is a first line of defence; a moderation model check is added in M4.
 */

export const BRAND_STYLE_PROMPT =
  "Kids' t-shirt print. Bold sticker style, thick black outline, flat bright colors, " +
  "plain white background, single centered subject, no text unless asked, no logos, friendly and age-appropriate.";

export const MAX_PROMPT_LENGTH = 200;

// Real brands and well-known characters we must not print (extend from the admin settings in M5).
const BLOCKED_TERMS = [
  "disney", "marvel", "pixar", "mickey", "elsa", "spiderman", "spider-man", "batman", "superman",
  "pokemon", "pikachu", "mario", "sonic", "barbie", "hello kitty", "paw patrol", "bluey",
  "nike", "adidas", "puma", "real madrid", "barcelona", "al ahly", "zamalek", "logo",
];

// Unsafe content for a kids' brand (keep short here; the moderation check covers the rest).
const UNSAFE_TERMS = ["blood", "gun", "weapon", "knife", "nude", "naked", "sexy", "kill", "drugs", "alcohol", "cigarette"];

export type GuardResult = { ok: true; prompt: string } | { ok: false; reason: "empty" | "too_long" | "brand_or_character" | "unsafe" };

export function checkPrompt(raw: string): GuardResult {
  const prompt = raw.trim().replace(/\s+/g, " ");
  if (!prompt) return { ok: false, reason: "empty" };
  if (prompt.length > MAX_PROMPT_LENGTH) return { ok: false, reason: "too_long" };
  const lower = prompt.toLowerCase();
  if (BLOCKED_TERMS.some((t) => lower.includes(t))) return { ok: false, reason: "brand_or_character" };
  if (UNSAFE_TERMS.some((t) => new RegExp(`\\b${t}\\b`).test(lower))) return { ok: false, reason: "unsafe" };
  return { ok: true, prompt };
}

export function buildPrompt(userPrompt: string, style: StudioStyle = "sticker"): string {
  return `${BRAND_STYLE_PROMPT} Style: ${STYLE_HINTS[style]}. Idea: ${userPrompt}`;
}

export type StudioStyle = "sticker" | "cartoon" | "pixel" | "watercolor";

const STYLE_HINTS: Record<StudioStyle, string> = {
  sticker: "die-cut sticker with white border",
  cartoon: "cheerful cartoon illustration",
  pixel: "chunky pixel art",
  watercolor: "soft watercolor with a clean outline",
};

/** Simple fixed-window limit: N generations per key per day. Backed by the generations table in production. */
export function isOverDailyLimit(usedToday: number, limit = 10): boolean {
  return usedToday >= limit;
}
