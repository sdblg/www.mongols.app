"use client";

import { useEffect, useMemo, useState } from "react";
import { decodeContactEmail } from "@/lib/contact-email-codes";

/**
 * Human-readable address as SVG text, decoded only after mount so the initial
 * HTML/SSR payload does not contain the contiguous address string.
 */
export function ProtectedContactEmail() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(decodeContactEmail());
  }, []);

  const tspans = useMemo(() => {
    if (!label) return null;
    const chars = [...label];
    const charW = 9.1;
    return chars.map((ch, i) => (
      <tspan key={i} x={2 + i * charW} y="22">
        {ch}
      </tspan>
    ));
  }, [label]);

  if (!label) {
    return (
      <div
        className="h-9 max-w-[19rem] animate-pulse rounded bg-white/[0.06]"
        aria-hidden
      />
    );
  }

  return (
    <div className="contact-email-protected flex flex-col gap-2">
      <svg
        viewBox="0 0 280 32"
        className="h-9 w-full max-w-[19rem] text-sky-300/95"
        role="img"
        aria-label={label}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{label}</title>
        <text
          fill="currentColor"
          fontSize="15"
          fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
          letterSpacing="0.02em"
          className="select-all"
        >
          {tspans}
        </text>
      </svg>

      <a
        href={`mailto:${label}`}
        className="w-fit font-mono text-[10px] uppercase tracking-wider text-white/35 underline-offset-4 hover:text-sky-400/90 hover:underline"
        rel="noopener noreferrer"
      >
        open in mail client
      </a>
    </div>
  );
}
