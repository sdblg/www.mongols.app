import * as React from "react";

type Props = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * Stylized rendition of the Soyombo (Соёмбо) — the national symbol of Mongolia.
 * Top-to-bottom: flame, sun, crescent, triangle, bar, yin-yang fish, bar,
 * triangle, with two vertical "fortress wall" bars flanking the column.
 *
 * Visual treatment per spec:
 *   - golden-to-orange linear gradient fill
 *   - 20px outer glow applied by the parent via the .soyombo-glow utility
 */
export function SoyomboSymbol({ size = 96, className, title = "Soyombo" }: Props) {
  return (
    <svg
      role="img"
      aria-label={title}
      width={size}
      height={size}
      viewBox="0 0 100 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="soyombo-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE6A8" />
          <stop offset="35%" stopColor="#FFD27A" />
          <stop offset="70%" stopColor="#F4B042" />
          <stop offset="100%" stopColor="#C45A0E" />
        </linearGradient>
      </defs>

      <g fill="url(#soyombo-gold)">
        {/* Flame — three tongues */}
        <path d="M50 4 C 47 14, 42 18, 40 24 C 44 22, 47 20, 50 16 C 53 20, 56 22, 60 24 C 58 18, 53 14, 50 4 Z" />
        <path d="M37 22 C 35 28, 32 30, 30 34 C 34 33, 36 32, 38 30 Z" />
        <path d="M63 22 C 65 28, 68 30, 70 34 C 66 33, 64 32, 62 30 Z" />

        {/* Sun (disk) */}
        <circle cx="50" cy="42" r="6" />

        {/* Crescent moon */}
        <path d="M50 56 a 7 7 0 1 0 6 5 a 5 5 0 1 1 -6 -5 Z" />

        {/* Top triangle (point down) */}
        <path d="M30 70 L 70 70 L 50 86 Z" />

        {/* Top horizontal bar */}
        <rect x="28" y="89" width="44" height="4" rx="1" />

        {/* Yin-yang fish (taijitu) — central element */}
        <g>
          <circle cx="50" cy="106" r="9.5" />
          {/* carve out the S-curve in the background color */}
          <path
            d="M50 96.5
               a 4.75 4.75 0 0 1 0 9.5
               a 4.75 4.75 0 0 0 0 9.5
               a 9.5 9.5 0 0 1 0 -19 Z"
            fill="#05060f"
          />
          <circle cx="50" cy="101.25" r="1.4" fill="url(#soyombo-gold)" />
          <circle cx="50" cy="110.75" r="1.4" fill="#05060f" />
        </g>

        {/* Bottom horizontal bar */}
        <rect x="28" y="119" width="44" height="4" rx="1" />

        {/* Bottom triangle (point up) */}
        <path d="M30 142 L 70 142 L 50 126 Z" />

        {/* Two vertical fortress-wall bars flanking the entire column */}
        <rect x="14" y="34" width="4" height="114" rx="1" />
        <rect x="82" y="34" width="4" height="114" rx="1" />

        {/* Caps on the wall bars */}
        <rect x="11" y="148" width="10" height="4" rx="1" />
        <rect x="79" y="148" width="10" height="4" rx="1" />
      </g>
    </svg>
  );
}
