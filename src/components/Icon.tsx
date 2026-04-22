import * as React from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

/**
 * Project-wide icon wrapper.
 * Pins stroke-width to 1.5 (per design spec) so we can't accidentally mix
 * 1, 1.5, and 2 across the UI. Override via `strokeWidth` only when truly needed.
 */
type IconProps = LucideProps & { icon: LucideIcon };

export function Icon({
  icon: LucideIconCmp,
  size = 16,
  strokeWidth = 1.5,
  className,
  ...rest
}: IconProps) {
  return (
    <LucideIconCmp
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      {...rest}
    />
  );
}
