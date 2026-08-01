"use client";

import React, { useMemo, useState } from "react";
import { Star, Pencil, MoreVertical, List, Link2, Download, FileCode2 } from "lucide-react";
import type { Article, World } from "@/lib/types";
import { renderWikiMarkdown, extractHeadings } from "@/lib/wiki-parser";

export function ArticleView({
  article,
  world,
  allArticles,
  onNavigate,
  onEdit,
  onTogglePin,
}: {
  article: Article;
  world?: World;
  allArticles: Article[];
  onNavigate: (slug: string) => void;
  onEdit: () => void;
  onTogglePin: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(true);

  const headings = useMemo(() => extractHeadings(article.markdownContent), [article.markdownContent]);

  const backlinks = useMemo(
    () =>
      allArticles.filter(
        (a) =>
          a.slug !== article.slug &&
          new RegExp(`\\[\\[${article.slug}(\\||\\])`).test(a.markdownContent)
      ),
    [allArticles, article.slug]
  );

  const cover = article.infobox?.image;

  const handleExportMd = () => {
    const fm = `---\ntitle: "${article.title}"\ncategory: "${article.category}"\nworld: "${article.worldSlug}"\n---\n\n`;
    const blob = new Blob([fm + article.markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  return (
    <div className="fd-fade-up pb-24">
      {/* Image de couverture pleine largeur */}
      {cover && (
        <div className="w-full h-64 sm:h-80 bg-[#1c1c1e]">
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-5 sm:px-8">
        {/* Titre centré */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight mt-7">
          {article.title}
        </h1>

        {/* Rangée d'actions : ÉPINGLÉ / MODIFIER / ⋮ */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mt-8 mb-10 relative">
          <button
            type="button"
            onClick={onTogglePin}
            className="flex items-center gap-2.5 text-[15px] font-extrabold uppercase tracking-wide text-neutral-100 hover:text-[#ffc500] cursor-pointer"
          >
            <Star className={`w-5 h-5 ${article.isFeatured ? "text-[#ffc500] fill-[#ffc500]" : ""}`} />
            Épinglé
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2.5 text-[15px] font-extrabold uppercase tracking-wide text-neutral-100 hover:text-[#ffc500] cursor-pointer"
          >
            <Pencil className="w-5 h-5" />
            Modifier
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-neutral-100 hover:text-[#ffc500] cursor-pointer"
            aria-label="Plus d'options"
          >
            <MoreVertical className="w-6 h-6" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-50 w-56 rounded-lg bg-[#2e2e2e] shadow-2xl border border-neutral-700 py-2 fd-fade-up">
                <MenuBtn icon={<FileCode2 className="w-4 h-4" />} label="Source Wikitext" onClick={() => { setMenuOpen(false); onEdit(); }} />
                <MenuBtn icon={<Download className="w-4 h-4" />} label="Exporter en .md" onClick={handleExportMd} />
              </div>
            </>
          )}
        </div>

        {/* Sommaire + corps */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start max-w-5xl mx-auto">
          <div>
            {/* Corps de l'article */}
            <article>{renderWikiMarkdown(article.markdownContent, onNavigate)}</article>

            {/* Étiquettes */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {article.tags.map((t) => (
                  <span key={t} className="text-[12px] text-[#ffc500] bg-[#ffc500]/10 border border-[#ffc500]/30 rounded-full px-3 py-1">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Renvois (backlinks façon Obsidian) */}
            <div className="mt-10 rounded-lg bg-[#161618] border border-neutral-800 p-4">
              <p className="flex items-center gap-2 text-[13px] font-bold text-white uppercase tracking-wide mb-3">
                <Link2 className="w-4 h-4 text-[#ffc500]" /> Pages liées à celle-ci
              </p>
              {backlinks.length === 0 ? (
                <p className="text-[14px] text-neutral-500">Aucun renvoi entrant pour le moment.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {backlinks.map((b) => (
                    <button
                      key={b.slug}
                      type="button"
                      onClick={() => onNavigate(b.slug)}
                      className="text-[13px] text-[#ffc500] underline decoration-[#ffc500]/40 underline-offset-2 hover:text-[#ffd54a] cursor-pointer"
                    >
                      {b.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sommaire latéral */}
          {headings.length > 0 && (
            <aside className="rounded-lg border border-neutral-700 bg-[#161618] lg:sticky lg:top-20">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700">
                <span className="flex items-center gap-2 text-[15px] font-bold text-white">
                  <List className="w-4 h-4" /> Sommaire
                </span>
                <button type="button" onClick={() => setTocOpen(!tocOpen)} className="text-[#ffc500] text-[13px] cursor-pointer">
                  [{tocOpen ? "masquer" : "afficher"}]
                </button>
              </div>
              {tocOpen && (
                <ol className="px-5 py-3 space-y-2 text-[14px] text-neutral-200">
                  {headings.map((h, i) => (
                    <li key={h.id} className="flex gap-2">
                      <span className="text-neutral-400">{i + 1}.</span>
                      <span>{h.label}</span>
                    </li>
                  ))}
                </ol>
              )}
            </aside>
          )}
        </div>

        {/* Fil d'ariane bas de page */}
        <div className="mt-10 flex items-center gap-2 text-[13px] text-neutral-400">
          <span>dans :</span>
          <span className="text-[#ffc500] capitalize">{article.category}</span>
          <span>,</span>
          <span className="text-[#ffc500]">{world?.name || article.worldSlug}</span>
        </div>
      </div>
    </div>
  );
}

function MenuBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-neutral-200 hover:bg-neutral-700/50 cursor-pointer"
    >
      <span className="text-[#ffc500]">{icon}</span>
      {label}
    </button>
  );
}
