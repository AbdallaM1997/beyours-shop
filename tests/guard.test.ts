import { describe, expect, it } from "vitest";
import { buildPrompt, checkPrompt, isOverDailyLimit } from "@/server/ai/guard";

describe("AI prompt guard", () => {
  it("accepts a normal kid idea", () => {
    expect(checkPrompt("  a happy dinosaur   playing football ")).toEqual({ ok: true, prompt: "a happy dinosaur playing football" });
  });

  it("blocks brands and known characters", () => {
    expect(checkPrompt("Spiderman eating pizza")).toEqual({ ok: false, reason: "brand_or_character" });
    expect(checkPrompt("zamalek logo")).toEqual({ ok: false, reason: "brand_or_character" });
  });

  it("blocks unsafe words but not innocent words containing them", () => {
    expect(checkPrompt("a cat with a gun")).toEqual({ ok: false, reason: "unsafe" });
    expect(checkPrompt("a penguin playing")).toMatchObject({ ok: true });
  });

  it("rejects empty and long prompts", () => {
    expect(checkPrompt("   ")).toEqual({ ok: false, reason: "empty" });
    expect(checkPrompt("a".repeat(201))).toEqual({ ok: false, reason: "too_long" });
  });

  it("wraps the prompt with the brand style", () => {
    expect(buildPrompt("rocket", "pixel")).toContain("thick black outline");
    expect(buildPrompt("rocket", "pixel")).toContain("pixel art");
  });

  it("enforces the daily limit", () => {
    expect(isOverDailyLimit(9)).toBe(false);
    expect(isOverDailyLimit(10)).toBe(true);
  });
});
