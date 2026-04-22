import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Icon } from "./Icon";

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  repo?: string;
  status?: "shipping" | "beta" | "experiment";
};

const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  shipping: "shipping",
  beta: "beta",
  experiment: "experiment",
};

export function ProjectCard({ project }: { project: Project }) {
  const { title, description, tags, href, repo, status = "shipping" } = project;

  return (
    <article
      className="
        glass glass-hover
        rounded-card
        p-card-p
        flex flex-col gap-stack-md
        h-full
      "
    >
      {/* Header row */}
      <header className="flex items-start justify-between gap-stack-sm">
        <h3 className="font-sans text-lg font-medium tracking-tight text-white">
          {title}
        </h3>
        <span className="tag" aria-label={`status: ${STATUS_LABEL[status]}`}>
          <span
            className={`size-1.5 rounded-full ${
              status === "shipping"
                ? "bg-emerald-400"
                : status === "beta"
                ? "bg-amber-400"
                : "bg-sky-400"
            }`}
          />
          {STATUS_LABEL[status]}
        </span>
      </header>

      {/* Body */}
      <p className="text-sm leading-relaxed text-white/70">{description}</p>

      {/* Tags — JetBrains Mono via .tag */}
      <ul className="flex flex-wrap gap-stack-sm">
        {tags.map((t) => (
          <li key={t} className="tag">
            {t}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <footer className="mt-auto flex items-center justify-between pt-stack-sm">
        {href ? (
          <Link
            href={href}
            className="
              inline-flex items-center gap-1.5
              font-mono text-xs uppercase tracking-wider
              text-gold-400 hover:text-gold-500 transition-colors
            "
          >
            visit
            <Icon icon={ArrowUpRight} size={14} />
          </Link>
        ) : (
          <span className="font-mono text-xs uppercase tracking-wider text-white/30">
            internal
          </span>
        )}

        {repo ? (
          <Link
            href={repo}
            aria-label={`${title} source on GitHub`}
            className="text-white/50 hover:text-white transition-colors"
          >
            <Icon icon={Github} size={16} />
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
