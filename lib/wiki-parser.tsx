import React from "react";
import { Pencil } from "lucide-react";

/**
 * Rendu "Wikitext" façon Fandom dark : liens [[...]] jaunes, titres gras
 * avec petit crayon jaune + filet, paragraphes aérés gris clair sur noir.
 */
export function renderWikiMarkdown(
  markdown: string,
  onNavigate: (slug: string) => void
): React.ReactNode[] {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={key} className="my-4 list-disc pl-6 space-y-2 text-[16px] leading-7 text-neutral-200 marker:text-[#ffc500]">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed === "---" || trimmed === "***") {
      flushList(`flush-${index}`);
      elements.push(<hr key={`hr-${index}`} className="my-6 border-neutral-800" />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList(`flush-${index}`);
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg font-bold text-white mt-6 mb-2">
          {renderInline(trimmed.slice(4), onNavigate)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(`flush-${index}`);
      elements.push(
        <div key={`h2-${index}`} className="mt-9 mb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {renderInline(trimmed.slice(3), onNavigate)}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <Pencil className="w-3.5 h-3.5 text-[#ffc500]" />
            <div className="flex-1 h-px bg-neutral-700" />
          </div>
        </div>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(`flush-${index}`);
      elements.push(
        <h1 key={`h1-${index}`} className="text-3xl font-extrabold text-white mt-6 mb-4">
          {renderInline(trimmed.slice(2), onNavigate)}
        </h1>
      );
      return;
    }

    if (trimmed.startsWith("> ")) {
      flushList(`flush-${index}`);
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-4 border-l-4 border-[#ffc500]/70 pl-4 italic text-neutral-300 text-[16px] leading-7"
        >
          {renderInline(trimmed.slice(2), onNavigate)}
        </blockquote>
      );
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(
        <li key={`li-${index}`}>{renderInline(trimmed.slice(2), onNavigate)}</li>
      );
      return;
    }

    if (trimmed === "") {
      flushList(`flush-${index}`);
      return;
    }

    flushList(`flush-${index}`);
    elements.push(
      <p key={`p-${index}`} className="my-4 text-[17px] leading-8 text-neutral-200">
        {renderInline(line, onNavigate)}
      </p>
    );
  });

  flushList("flush-end");
  return elements;
}

export function renderInline(text: string, onNavigate: (slug: string) => void): React.ReactNode[] {
  const wikiRegex = /\[\[([a-zA-Z0-9_-]+)(?:\|([^\]]+))?\]\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = wikiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...formatBasic(text.slice(lastIndex, match.index)));
    }
    const slug = match[1].toLowerCase();
    const alias = match[2] || formatSlugTitle(slug);
    parts.push(
      <button
        key={`wiki-${match.index}-${slug}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(slug);
        }}
        className="text-[#ffc500] underline decoration-[#ffc500]/50 underline-offset-2 hover:text-[#ffd54a] hover:decoration-[#ffd54a] font-medium transition-colors cursor-pointer"
      >
        {alias}
      </button>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(...formatBasic(text.slice(lastIndex)));
  }
  return parts;
}

function formatBasic(raw: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) tokens.push(raw.slice(lastIndex, match.index));
    if (match[2]) {
      tokens.push(
        <strong key={`b-${match.index}`} className="font-bold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      tokens.push(
        <em key={`i-${match.index}`} className="italic text-neutral-300">
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      tokens.push(
        <code key={`c-${match.index}`} className="px-1.5 py-0.5 rounded bg-neutral-800 text-[#ffc500] font-mono text-[14px]">
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < raw.length) tokens.push(raw.slice(lastIndex));
  return tokens;
}

export function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Extrait les titres ## pour le Sommaire. */
export function extractHeadings(markdown: string): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("## ")) {
      const label = t.slice(3).replace(/\[\[([a-zA-Z0-9_-]+)(?:\|([^\]]+))?\]\]/g, (_m, a, b) => b || a);
      out.push({ id: `h-${out.length}`, label });
    }
  }
  return out;
}
