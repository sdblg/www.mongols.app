import type { Metadata } from "next";
import fs from "node:fs/promises";
import path from "node:path";

export const metadata: Metadata = {
  title: "Data Deletion | Mongols.app",
  description: "How to request deletion of your data from mongols.app",
};

function inlineMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function renderMarkdown(content: string): React.ReactNode[] {
  const lines = content.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let numberItems: string[] = [];
  let bulletItems: string[] = [];

  const flushNumberItems = () => {
    if (numberItems.length === 0) return;
    nodes.push(
      <ol key={`ol-${nodes.length}`} className="mb-4 list-decimal space-y-2 pl-6">
        {numberItems.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
        ))}
      </ol>,
    );
    numberItems = [];
  };

  const flushBulletItems = () => {
    if (bulletItems.length === 0) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="mb-4 list-disc space-y-2 pl-6">
        {bulletItems.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
        ))}
      </ul>,
    );
    bulletItems = [];
  };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushNumberItems();
      flushBulletItems();
      return;
    }

    const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      flushBulletItems();
      numberItems.push(numbered[1]);
      return;
    }

    const bullet = trimmed.match(/^\*\s+(.+)$/);
    if (bullet) {
      flushNumberItems();
      bulletItems.push(bullet[1]);
      return;
    }

    flushNumberItems();
    flushBulletItems();

    if (trimmed === "---") {
      nodes.push(
        <hr key={`hr-${lineIndex}`} className="my-6 border-white/15" />,
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      nodes.push(
        <h1
          key={`h1-${lineIndex}`}
          className="mb-6 text-3xl font-bold tracking-tight text-white"
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed.slice(2)) }}
        />,
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h2
          key={`h2-${lineIndex}`}
          className="mb-3 mt-6 text-xl font-semibold text-white"
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed.slice(4)) }}
        />,
      );
      return;
    }

    nodes.push(
      <p
        key={`p-${lineIndex}`}
        className="mb-4 leading-7 text-white/85"
        dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed) }}
      />,
    );
  });

  flushNumberItems();
  flushBulletItems();

  return nodes;
}

export default async function DataDeletionPage() {
  const filePath = path.join(process.cwd(), "data-deletion-instructions.md");
  const markdownContent = await fs.readFile(filePath, "utf-8");

  return (
    <main className="min-h-screen bg-lab-bg px-4 py-10 text-lab-fg md:px-6 md:py-14">
      <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
        {renderMarkdown(markdownContent)}
      </div>
    </main>
  );
}
