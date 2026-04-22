/**
 * UTF-16 code units for the public contact address — assembled at runtime only
 * so the literal string does not appear contiguous in shipped JS/HTML.
 */
export const CONTACT_EMAIL_CODE_UNITS: readonly number[] = [
  105, 110, 102, 111, 64, 109, 111, 110, 103, 111, 108, 115, 46, 97, 112, 112,
];

export function decodeContactEmail(): string {
  return String.fromCharCode(...CONTACT_EMAIL_CODE_UNITS);
}
