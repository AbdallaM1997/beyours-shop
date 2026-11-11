/** Flat t-shirt outline used for product thumbnails and the studio canvas. */
export function TeeShape({ color = "#ffffff", className }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 420" className={className} aria-hidden="true">
      <path
        d="M125 22 L165 10 Q200 42 235 10 L275 22 L388 82 L350 162 L300 138 L300 408 L100 408 L100 138 L50 162 L12 82 Z"
        fill={color}
        stroke="#000"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M165 10 Q200 50 235 10" fill="none" stroke="#000" strokeWidth="5" />
    </svg>
  );
}
