"use client";

import React, { useState } from "react";
import { X, ChevronUp, ChevronDown, ChevronRight, Map as MapIcon, BookOpen } from "lucide-react";
import type { World, Article } from "@/lib/types";

/**
 * Tiroir de page de projet (image 2) : sections repliables
 * « En vedette », « Menu Wiki » (catégories = navigation) et « Sommaire ».
 * App solo : pas d'éléments communautaires (pas de « Discuter »).
 */
export function ProjectDrawer({
  open,
  onClose,
  world,
  categories,
  articleTitle,
  headings,
  important,
  onExplore,
  onOpenCategory,
  onOpenArticle,
  onMaps,
}: {
  open: boolean;
  onClose: () => void;
  world: World;
  categories: string[];
  articleTitle?: string | null;
  headings: { id: string; label: string }[];
  important: Article[];
  onExplore: () => void;
  onOpenCategory: (cat: string) => void;
  onOpenArticle: (slug: string, world: string) => void;
  onMaps: () => void;
}) {
  if (!open) return null;

  const showArticleToc = !!articleTitle && headings.length > 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-[#3a3a3a] rounded-r-2xl fd-slide-in overflow-y-auto fd-scrollbar">
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">{world.name}</h2>
          <button type="button" onClick={onClose} className="text-neutral-200 hover:text-white cursor-pointer" aria-label="Fermer">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="px-4 pb-8 space-y-4">
          {/* En vedette */}
          <Section title="En vedette" defaultOpen>
            <Row icon={<MapIcon className="w-5 h-5" />} label="Cartes interactives" onClick={() => { onMaps(); onClose(); }} />
          </Section>

          {/* Menu Wiki : catégories = navigation */}
          <Section title="Menu Wiki" defaultOpen>
            <Row icon={<BookOpen className="w-5 h-5" />} label="Explorer" chevron onClick={() => { onExplore(); onClose(); }} />
            {categories.map((c) => (
              <Row key={c} label={capitalize(c)} chevron onClick={() => { onOpenCategory(c); onClose(); }} />
            ))}
            {categories.length === 0 && (
              <p className="px-5 py-2 text-[14px] text-neutral-400">Aucune catégorie pour l'instant.</p>
            )}
          </Section>

          {/* Sommaire */}
          <Section title="Sommaire" defaultOpen>
            {showArticleToc ? (
              <ol className="px-5 py-2 space-y-3">
                {headings.map((h, i) => (
                  <li key={h.id} className="flex gap-3 text-[17px] text-neutral-100">
                    <span className="text-neutral-300">{i + 1}.</span>
                    <span>{h.label}</span>
                  </li>
                ))}
              </ol>
            ) : important.length > 0 ? (
              <ol className="px-5 py-2 space-y-3">
                {important.map((a, i) => (
                  <li key={a.slug} className="flex gap-3 text-[17px]">
                    <span className="text-neutral-300">{i + 1}.</span>
                    <button
                      type="button"
                      onClick={() => { onOpenArticle(a.slug, a.worldSlug); onClose(); }}
                      className="text-neutral-100 hover:text-[#ffc500] text-left cursor-pointer"
                    >
                      {a.title}
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="px-5 py-2 text-[14px] text-neutral-400">Rien à lister pour le moment.</p>
            )}
          </Section>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#4a4a4a] text-white font-extrabold text-[17px] cursor-pointer"
      >
        {title}
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

function Row({
  icon,
  label,
  chevron,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  chevron?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3.5 text-[17px] text-neutral-100 hover:bg-[#454545] rounded-lg cursor-pointer"
    >
      {icon && <span className="text-neutral-200">{icon}</span>}
      <span className="flex-1 text-left">{label}</span>
      {chevron && <ChevronRight className="w-5 h-5 text-neutral-300" />}
    </button>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
