"use client";

import { useCallback, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Icon } from "@/components/Icon";
import { Send } from "lucide-react";

type Status = "idle" | "sending" | "ok" | "error";

export function SecurityContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? "";
  const [token, setToken] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorDetail(null);
      if (honeypot) return;
      if (!siteKey) {
        setStatus("error");
        setErrorDetail("Turnstile is not configured (missing site key).");
        return;
      }
      if (!token) {
        setStatus("error");
        setErrorDetail("Complete the security check before sending.");
        return;
      }
      const trimmed = message.trim();
      if (trimmed.length < 12) {
        setStatus("error");
        setErrorDetail("Message must be at least 12 characters.");
        return;
      }
      if (trimmed.length > 8000) {
        setStatus("error");
        setErrorDetail("Message is too long (max 8000 characters).");
        return;
      }

      setStatus("sending");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            subject: subject.trim() || undefined,
            message: trimmed,
            website: honeypot,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          ok?: boolean;
        };
        if (!res.ok) {
          setStatus("error");
          setErrorDetail(data.error ?? `Request failed (${res.status})`);
          setToken(null);
          return;
        }
        setStatus("ok");
        setMessage("");
        setSubject("");
        setToken(null);
        setWidgetKey((k) => k + 1);
      } catch {
        setStatus("error");
        setErrorDetail("Network error. Try again.");
        setToken(null);
      }
    },
    [honeypot, message, siteKey, subject, token],
  );

  return (
    <form
      onSubmit={onSubmit}
      className="lab-panel flex flex-col gap-5 rounded-lg p-6 md:p-8"
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="contact-subject"
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-white/45"
          >
            Subject <span className="text-white/25">(optional)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            maxLength={200}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            autoComplete="off"
            className="w-full rounded border border-white/10 bg-black/50 px-3 py-2.5 font-mono text-sm text-white outline-none ring-sky-500/40 placeholder:text-white/25 focus:border-sky-500/50 focus:ring-1"
            placeholder="e.g. API access, partnership"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="contact-message"
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-white/45"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            maxLength={8000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
            className="w-full resize-y rounded border border-white/10 bg-black/50 px-3 py-2.5 font-mono text-sm text-white outline-none ring-sky-500/40 placeholder:text-white/25 focus:border-sky-500/50 focus:ring-1"
            placeholder="Describe your inquiry. Do not include secrets or credentials."
          />
        </div>
      </div>

      {/* Honeypot — must stay empty */}
      <div className="hidden" aria-hidden>
        <label htmlFor="contact-website">Company website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
        />
      </div>

      {siteKey ? (
        <div className="flex min-h-[65px] flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
            Verification
          </span>
          <Turnstile
            key={widgetKey}
            siteKey={siteKey}
            onSuccess={setToken}
            onExpire={() => setToken(null)}
            onError={() => setToken(null)}
            options={{ theme: "dark", size: "flexible" }}
          />
        </div>
      ) : (
        <p className="rounded border border-amber-500/25 bg-amber-500/5 px-3 py-2 font-mono text-xs text-amber-200/90">
          Set{" "}
          <code className="text-amber-100/90">NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY</code>{" "}
          to enable the widget.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending" || !siteKey}
          className="inline-flex items-center justify-center gap-2 rounded border border-sky-500/40 bg-sky-500/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-sky-200 transition-colors hover:border-sky-400/60 hover:bg-sky-500/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon icon={Send} size={14} />
          {status === "sending" ? "Sending…" : "Send securely"}
        </button>
        {status === "ok" ? (
          <p className="font-mono text-xs text-emerald-400/90">
            Message accepted. We will respond from the official channel.
          </p>
        ) : null}
        {status === "error" && errorDetail ? (
          <p className="font-mono text-xs text-red-400/90">{errorDetail}</p>
        ) : null}
      </div>
    </form>
  );
}
