import type { AGE_SIZES } from "./products";

/**
 * Garment measurements per age size, in cm.
 * TODO: replace with the measurements from BeYours' own tee pattern before launch.
 */
export const sizeChart: { size: (typeof AGE_SIZES)[number]; height: string; chest: number; length: number }[] = [
  { size: "2-3", height: "92–98", chest: 31, length: 40 },
  { size: "4-5", height: "104–110", chest: 33, length: 44 },
  { size: "6-7", height: "116–122", chest: 35, length: 48 },
  { size: "8-9", height: "128–134", chest: 38, length: 52 },
  { size: "10-11", height: "140–146", chest: 41, length: 56 },
  { size: "12-14", height: "152–164", chest: 44, length: 61 },
];
