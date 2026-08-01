"use client";

import React, { useState } from "react";
import { X, Save, Eye, FileCode2, Bold, Italic, Link2, Heading2, List } from "lucide-react";
import type { Article } from "@/lib/types";
import { renderWikiMarkdown } from "@/lib/wiki-parser";

export function WikitextEditor({
  initial,
  initialTitle,
  defaultWorld,
  worlds,
  onClose,
  onSaved,
}: {
  initial: Article | null;
  initialTitle?: string;
  defaultWorld: string;
  worlds: { slug: string; name: string }[];
  onClose: () => void;
  onSaved: (slug: string, world: string) => void;
}) {
  const [title, setTitle] = useState(initial?.title || initialTitle || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [category, setCategory] = useState(initial?.category || "inbox");
  const [worldSlug, setWorldSlug] = useState(initial?.worldSlug || defaultWorld);
  const [content, setContent] = useState(initial?.markdownContent || "");
  const [tab, setTab] = useState<"visuel" | "wikitext">("wikitext");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const insert = (before: string, after = "", placeholder = "") => {
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => c + before + placeholder + after);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + before + sel + after + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + sel.length;
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldSlug,
          slug: finalSlug,
          title: title.trim(),
          category,
          infobox: initial?.infobox || undefined,
          markdownContent: content,
          excerpt: initial?.excerpt || content.replace(/[#*`>\-\[\]]/g, "").slice(0, 140),
          tags: initial?.tags || [],
          isFeatured: initial?.isFeatured || false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSaved(finalSlug, worldSlug);
      } else {
        setError(data.error || "Échec de l'enregistrement.");
      }
    } catch (e: any) {
      setError(e.message || "Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] flex flex-col">
      {/* Barre du haut */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-900 shrink-0">
        <button type="button" onClick={onClose} className="text-neutral-300 hover:text-white cursor-pointer" aria-label="Fermer">
          <X className="w-6 h-6" />
        </button>
        <span className="text-[15px] font-bold text-white truncate px-3">
          {initial ? `Modifier : ${initial.title}` : "Nouvelle page"}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 text-[#ffc500] font-bold text-sm uppercase tracking-wide disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? "…" : "Enregistrer"}
        </button>
      </div>

      {/* Onglets Visuel / Wikitext */}
      <div className="flex border-b border-neutral-900 shrink-0">
        <TabBtn active={tab === "visuel"} onClick={() => setTab("visuel")} icon={<Eye className="w-4 h-4" />} label="Visuel" />
        <TabBtn active={tab === "wikitext"} onClick={() => setTab("wikitext")} icon={<FileCode2 className="w-4 h-4" />} label="Wikitext" />
      </div>

      {tab === "wikitext" && (
        <>
          {/* Barre d'outils wikitext */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-neutral-900 overflow-x-auto no-scrollbar shrink-0">
            <ToolBtn icon={<Bold className="w-4 h-4" />} onClick={() => insert("**", "**", "gras")} />
            <ToolBtn icon={<Italic className="w-4 h-4" />} onClick={() => insert("*", "*", "italique")} />
            <ToolBtn icon={<Heading2 className="w-4 h-4" />} onClick={() => insert("\n## ", "\n", "Titre de section")} />
            <ToolBtn icon={<Link2 className="w-4 h-4" />} onClick={() => insert("[[", "]]", "slug-de-la-page")} />
            <ToolBtn icon={<List className="w-4 h-4" />} onClick={() => insert("\n- ", "", "élément")} />
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 py-3 border-b border-neutral-900 shrink-0">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la page"
              className="col-span-2 px-3 py-2 rounded-lg bg-[#1c1c1e] border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ffc500]"
            />
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="slug (auto)"
              className="px-3 py-2 rounded-lg bg-[#1c1c1e] border border-neutral-800 text-sm text-[#ffc500] font-mono placeholder-neutral-600 focus:outline-none focus:border-[#ffc500]"
            />
            <select
              value={worldSlug}
              onChange={(e) => setWorldSlug(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#1c1c1e] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#ffc500]"
            >
              {worlds.map((w) => (
                <option key={w.slug} value={w.slug}>
                  {w.name}
                </option>
              ))}
            </select>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="catégorie"
              className="col-span-2 sm:col-span-4 px-3 py-2 rounded-lg bg-[#1c1c1e] border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ffc500]"
            />
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Rédigez en Wikitext…\n\n[[autre-page]] crée un lien interne jaune.\n## Titre de section\n**gras**, *italique*, - listes."}
            className="flex-1 w-full p-4 bg-[#111112] text-[14px] leading-7 text-neutral-200 font-mono focus:outline-none resize-none fd-scrollbar"
          />
        </>
      )}

      {tab === "visuel" && (
        <div className="flex-1 overflow-y-auto fd-scrollbar px-5 sm:px-8 py-6 max-w-3xl mx-auto w-full">
          <h1 className="text-3xl font-extrabold text-white mb-6">{title || "Aperçu"}</h1>
          {content.trim() ? (
            renderWikiMarkdown(content, () => {})
          ) : (
            <p className="text-neutral-500">Rien à prévisualiser pour l'instant.</p>
          )}
        </div>
      )}

      {/* Aide syntaxe */}
      {tab === "wikitext" && (
        <div className="px-4 py-2.5 border-t border-neutral-900 text-[12px] text-neutral-500 shrink-0 overflow-x-auto no-scrollbar whitespace-nowrap">
          Wikitext : <code className="text-[#ffc500]">[[page]]</code> lien · <code className="text-[#ffc500]">[[page|alias]]</code> lien personnalisé ·{" "}
          <code className="text-[#ffc500]">## Titre</code> · <code className="text-[#ffc500]">**gras**</code> ·{" "}
          <code className="text-[#ffc500]">*italique*</code> · <code className="text-[#ffc500]">- liste</code> ·{" "}
          <code className="text-[#ffc500]">&gt; citation</code>
        </div>
      )}

      {error && (
        <div className="px-4 py-2 bg-red-900/60 text-red-200 text-sm shrink-0">{error}</div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wide border-b-2 cursor-pointer ${
        active ? "text-[#ffc500] border-[#ffc500]" : "text-neutral-400 border-transparent hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ToolBtn({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-300 hover:text-[#ffc500] hover:bg-neutral-900 shrink-0 cursor-pointer"
    >
      {icon}
    </button>
  );
}
