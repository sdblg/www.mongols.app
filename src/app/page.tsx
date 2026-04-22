"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Box,
  Cpu,
  GitBranch,
  Layers,
  Network,
  Shield,
  Zap,
} from "lucide-react";
import { Icon } from "@/components/Icon";

const SecurityContactSection = dynamic(
  () =>
    import("@/components/SecurityContactSection").then((m) => ({
      default: m.SecurityContactSection,
    })),
  { ssr: false },
);

/* ------------------------------------------------------------------ motion */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

/* ------------------------------------------------------------------ logo */
function NetworkMLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="m-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* edges — network M */}
      <path
        d="M12 52 L12 12 L32 36 L52 12 L52 52"
        stroke="url(#m-edge)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="12"
        x2="52"
        y2="12"
        stroke="url(#m-edge)"
        strokeWidth="1"
        strokeOpacity="0.35"
      />
      <line
        x1="20"
        y1="36"
        x2="44"
        y2="36"
        stroke="url(#m-edge)"
        strokeWidth="1"
        strokeOpacity="0.25"
      />
      {/* nodes */}
      {[
        [12, 52],
        [12, 12],
        [32, 36],
        [52, 12],
        [52, 52],
        [32, 12],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i === 2 ? 3.25 : 2.5}
          fill="#0a0a0a"
          stroke="#e8e8ec"
          strokeWidth="1.25"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ particles */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let particles: P[] = [];

    function resize() {
      const surface = canvasRef.current;
      const context = surface?.getContext("2d");
      if (!surface || !context) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      surface.width = Math.floor(w * dpr);
      surface.height = Math.floor(h * dpr);
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(72, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.35,
        a: Math.random() * 0.35 + 0.08,
      }));
    }

    function tick() {
      const surface = canvasRef.current;
      const context = surface?.getContext("2d");
      if (!surface || !context) return;

      const w = surface.clientWidth;
      const h = surface.clientHeight;
      context.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(200,220,255,${p.a})`;
        context.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(56,189,248,0.15), transparent 55%)",
        }}
        aria-hidden
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[2] opacity-50"
      aria-hidden
    />
  );
}

/* ------------------------------------------------------------------ architecture */
function SystemArchitectureDiagram() {
  return (
    <figure className="lab-panel relative overflow-hidden rounded-lg p-6 md:p-8">
      <figcaption className="sr-only">
        Abstract system architecture: microservices connect to a central core.
      </figcaption>
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-lab-muted">
          topology · live
        </span>
        <span className="font-mono text-[10px] text-sky-400/80">μsvc mesh</span>
      </div>
      <svg
        viewBox="0 0 720 280"
        className="h-auto w-full max-h-[220px] text-lab-muted"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="wire" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* faint mesh */}
        <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.75" fill="none">
          <path d="M40 200 L360 140 L680 200" />
          <path d="M120 40 L360 140 L600 40" />
        </g>
        {/* satellites */}
        {[
          { x: 80, y: 60, label: "INGRESS" },
          { x: 360, y: 28, label: "AUTH" },
          { x: 640, y: 60, label: "STREAM" },
          { x: 48, y: 200, label: "INDEX" },
          { x: 672, y: 200, label: "GPU" },
          { x: 360, y: 248, label: "RELAY" },
        ].map((n) => (
          <g key={n.label}>
            <line
              x1={n.x}
              y1={n.y}
              x2="360"
              y2="140"
              stroke="url(#wire)"
              strokeWidth="1.25"
            />
            <rect
              x={n.x - 36}
              y={n.y - 14}
              width="72"
              height="28"
              rx="4"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="0.75"
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fill="rgba(232,232,236,0.75)"
              fontSize="9"
              fontFamily="var(--font-jetbrains-mono), monospace"
            >
              {n.label}
            </text>
          </g>
        ))}
        {/* core */}
        <polygon
          points="360,108 388,124 388,156 360,172 332,156 332,124"
          fill="rgba(56,189,248,0.08)"
          stroke="#38bdf8"
          strokeWidth="1.25"
        />
        <text
          x="360"
          y="144"
          textAnchor="middle"
          fill="#e8e8ec"
          fontSize="11"
          fontWeight="600"
          fontFamily="var(--font-geist-sans), system-ui, sans-serif"
        >
          CORE
        </text>
        <text
          x="360"
          y="158"
          textAnchor="middle"
          fill="rgba(232,232,236,0.45)"
          fontSize="8"
          fontFamily="var(--font-jetbrains-mono), monospace"
        >
          v0.9.4
        </text>
      </svg>
    </figure>
  );
}

/* ------------------------------------------------------------------ bento data */
type ProductCard = {
  kind: "product";
  code: string;
  role: string;
  blurb: string;
  icon: typeof Shield;
  span: string;
};

type PlaceholderCard = {
  kind: "placeholder";
  status: string;
  detail?: string;
  span: string;
};

const PRODUCTS: ProductCard[] = [
  {
    kind: "product",
    code: "HEDGE",
    role: "ZTNA",
    blurb: "Zero-trust perimeter enforcement. Policy-as-code, device posture, split tunneling.",
    icon: Shield,
    span: "col-span-12 md:col-span-5 md:row-span-2 min-h-[200px]",
  },
  {
    kind: "product",
    code: "GODGE",
    role: "eBPF",
    blurb: "Kernel observability and programmable datapath without userland overhead.",
    icon: Activity,
    span: "col-span-12 md:col-span-3 md:col-start-6 md:row-start-1 min-h-[120px]",
  },
  {
    kind: "product",
    code: "GEN3",
    role: "Engine",
    blurb: "Deterministic execution runtime for high-throughput event synthesis.",
    icon: Cpu,
    span: "col-span-12 md:col-span-4 md:col-start-9 md:row-start-1 min-h-[120px]",
  },
  {
    kind: "product",
    code: "GUUR",
    role: "Bridge",
    blurb: "Protocol translation and backpressure-aware bridging across heterogeneous clusters.",
    icon: GitBranch,
    span: "col-span-12 md:col-span-3 md:col-start-6 md:row-start-2 min-h-[120px]",
  },
  {
    kind: "product",
    code: "L2C",
    role: "Processor",
    blurb: "Stream processor with exactly-once semantics and cold-tier spillover.",
    icon: Layers,
    span: "col-span-12 md:col-span-4 md:col-start-9 md:row-start-2 min-h-[120px]",
  },
];

const PLACEHOLDERS: PlaceholderCard[] = [
  { kind: "placeholder", status: "STATUS: DEVELOPING", detail: "PRJ-Ω-14", span: "col-span-6 md:col-span-2" },
  { kind: "placeholder", status: "STATUS: RESEARCHING", detail: "R&D / KV", span: "col-span-6 md:col-span-2" },
  { kind: "placeholder", status: "[ + ] NEW PROJECT", detail: "slot open", span: "col-span-12 md:col-span-2" },
  { kind: "placeholder", status: "STATUS: DEVELOPING", detail: "NET-Δ-02", span: "col-span-6 md:col-span-2" },
  { kind: "placeholder", status: "STATUS: RESEARCHING", detail: "LLM edge", span: "col-span-6 md:col-span-2" },
  { kind: "placeholder", status: "[ + ] NEW PROJECT", detail: "queue", span: "col-span-12 md:col-span-2" },
];

/* ------------------------------------------------------------------ page */
export default function Page() {
  return (
    <div className="relative min-h-screen bg-lab-bg text-lab-fg">
      <div className="lab-grid pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <ParticleField />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-8 md:px-6 md:pt-12">
        {/* header */}
        <motion.header
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mb-14 flex flex-col gap-6 border-b border-white/[0.06] pb-10 md:mb-20 md:flex-row md:items-center md:justify-between"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            <NetworkMLogo className="h-11 w-11 shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-lab-muted">
                mongols.app
              </p>
              <p className="font-sans text-sm font-medium tracking-tight text-white/90">
                Infrastructure Hub
              </p>
            </div>
          </motion.div>
          <motion.nav
            variants={fadeUp}
            className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-wider text-lab-muted"
          >
            <span className="inline-flex items-center gap-2 text-white/50">
              <Icon icon={Network} size={14} />
              systems
            </span>
            <span className="inline-flex items-center gap-2 text-white/50">
              <Icon icon={Zap} size={14} />
              latency
            </span>
            <span className="inline-flex items-center gap-2 text-white/50">
              <Icon icon={Box} size={14} />
              scale
            </span>
          </motion.nav>
        </motion.header>

        {/* hero — animate on mount so above-the-fold content is never stuck "hidden" */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mb-20 md:mb-28"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-sky-400/90"
          >
            high-throughput · low-latency · cold precision
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-5xl font-sans text-[clamp(2rem,6vw,4.25rem)] font-bold leading-[0.95] tracking-tight text-white"
          >
            SCALING THE
            <br />
            DIGITAL FRONTIER
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-3xl font-mono text-sm leading-relaxed text-lab-muted"
          >
            {
              "Software Engineering, Networking, Cyber Security & Inference Infrastructure. Abstract control planes. Observable data paths. Built for global load."
            }
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] text-white/70">
              <Icon icon={Activity} size={14} />
              SLO: 99.99%
            </span>
            <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] text-white/70">
              <Icon icon={Cpu} size={14} />
              multi-region
            </span>
          </motion.div>
        </motion.section>

        {/* architecture */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="mb-16 md:mb-24"
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-sans text-xl font-semibold tracking-tight text-white md:text-2xl">
                System architecture
              </h2>
              <p className="mt-1 font-mono text-xs text-lab-muted">
                abstract topology — not geographic
              </p>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-white/30 sm:inline">
              ref: mesh-v3
            </span>
          </motion.div>
          <motion.div variants={fadeUp}>
            <SystemArchitectureDiagram />
          </motion.div>
        </motion.section>

        {/* bento projects */}
        <section className="mb-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <h2 className="font-sans text-xl font-semibold tracking-tight text-white md:text-2xl">
                Project grid
              </h2>
              <p className="font-mono text-xs text-lab-muted">
                bento layout · active + roadmap
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 self-start font-mono text-[11px] uppercase tracking-wider text-sky-400/90 hover:text-sky-300"
            >
              view registry
              <Icon icon={ArrowRight} size={14} />
            </button>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-20px" }}
            variants={stagger}
            className="grid grid-cols-12 gap-3 md:gap-4"
          >
            {[...PRODUCTS, ...PLACEHOLDERS].map((item, i) => (
              <motion.article
                key={
                  item.kind === "product"
                    ? item.code
                    : `placeholder-${i}-${item.status}`
                }
                variants={fadeUp}
                className={`lab-panel group relative flex flex-col rounded-lg p-5 transition-colors md:p-6 ${item.span}`}
              >
                {item.kind === "product" ? (
                  <>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded border border-white/10 bg-white/[0.02] text-sky-400/90">
                          <Icon icon={item.icon} size={18} />
                        </span>
                        <div>
                          <h3 className="font-sans text-lg font-semibold tracking-tight text-white">
                            {item.code}
                          </h3>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-400/70">
                            {item.role}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] text-white/25">v0.x</span>
                    </div>
                    <p className="font-mono text-[12px] leading-relaxed text-lab-muted">
                      {item.blurb}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-6">
                      <span className="border border-white/[0.07] bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/45">
                        prod
                      </span>
                      <span className="border border-white/[0.07] bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/45">
                        api
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full min-h-[100px] flex-col items-center justify-center gap-2 text-center md:min-h-[88px]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                      {item.status}
                    </p>
                    {item.detail ? (
                      <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                        {item.detail}
                      </p>
                    ) : null}
                  </div>
                )}
              </motion.article>
            ))}
          </motion.div>
        </section>

        <SecurityContactSection />

        <footer className="mt-20 border-t border-white/[0.06] pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
            © {new Date().getFullYear()} mongols.app · infrastructure
          </p>
        </footer>
      </div>
    </div>
  );
}
