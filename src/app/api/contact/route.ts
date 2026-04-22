import { NextResponse } from "next/server";

const TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type Body = {
  token?: string;
  subject?: string;
  message?: string;
  /** Honeypot — must be empty */
  website?: string;
};

async function verifyTurnstile(token: string, remoteip?: string | null) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: false as const, reason: "Turnstile secret not configured" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) body.set("remoteip", remoteip);

  const res = await fetch(TURNSTILE_VERIFY, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
  if (!data.success) {
    return {
      ok: false as const,
      reason: data["error-codes"]?.join(", ") ?? "Verification failed",
    };
  }
  return { ok: true as const };
}

export async function POST(req: Request) {
  let json: Body;
  try {
    json = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (json.website) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const message = typeof json.message === "string" ? json.message.trim() : "";
  if (message.length < 12) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }
  if (message.length > 8000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const subject =
    typeof json.subject === "string" ? json.subject.trim().slice(0, 200) : "";

  const token = typeof json.token === "string" ? json.token : "";
  if (!token) {
    return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const remoteip = forwarded?.split(",")[0]?.trim() ?? null;

  const check = await verifyTurnstile(token, remoteip);
  if (!check.ok) {
    if (check.reason === "Turnstile secret not configured") {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 503 });
    }
    return NextResponse.json({ error: "Challenge failed" }, { status: 403 });
  }

  // Hook: forward to ticketing / email provider (Resend, SES, etc.).
  if (process.env.NODE_ENV === "development") {
    console.info("[contact] verified", {
      subjectLen: subject.length,
      bodyLen: message.length,
    });
  }

  return NextResponse.json({ ok: true });
}
