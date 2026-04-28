import { NextResponse } from "next/server";

/**
 * Turnstile site keys are public, but must not be baked in at build time for
 * cluster-only secrets. Prefer CLOUDFLARE_TURNSTILE_SITE_KEY at runtime; fall
 * back to NEXT_PUBLIC_* for local dev / docker --build-arg flows.
 */
export async function GET() {
  const siteKey =
    process.env.CLOUDFLARE_TURNSTILE_SITE_KEY ??
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ??
    "";
  return NextResponse.json({ siteKey });
}
