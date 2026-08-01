"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  Map as MapIcon,
  Plus,
  Pencil,
  Bookmark,
  ChevronDown,
  BookOpen,
  FileCode2,
} from "lucide-react";
import type { World, Article } from "@/lib/types";
import { Fab } from "./ui";

const PLACEHOLDER_CAPTIONS = [
  "Une page sur votre sujet",
  "Un personnage principal",
  "Le premier épisode",
  "Un lieu important",
  "Un événement clé",
  "Un objet crucial",
];

/**
 * Page d'accueil de projet (image 1) : bannière étoilée + icônes d'action,
 * barre de menu EXPLORER/catégories, titre « Accueil » léger avec actions,
 * cercles flottants, grille « Articles importants » (ou placeholders), aide.
 */
export function ProjectView({
  world,
  articles,
  onOpenArticle,
  onOpenCategory,
  onNewNote,
  onExplore,
  onEditHome,
}: {
  world: World;
  articles: Article[];
  allWorlds: World[];
  onOpenArticle: (slug: string, world: string) => void;
  onOpenCategory: (cat: string) => void;
  onNewNote: () => void;
  onExplore: () => void;
  onEditHome: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = world.themeColor || "#7a0050";
  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const important = [...articles]
    .sort((a, b) => Number(b.isFeatured || false) - Number(a.isFeatured || false))
    .slice(0, 6);

  const slots = Array.from({ length: 6 }, (_, i) => important[i] || null);

  const scrollToMaps = () => {
    document.getElementById("project-cartes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fd-fade-up pb-28">
      {/* Bannière */}
      <div className="relative h-44 overflow-hidden">
        {world.bannerUrl ? (
          <img src={world.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 70% 30%, ${theme}99, #05010a 70%)` }}
          />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 fd-triangles opacity-60" />

        <div className="relative z-10 h-full flex items-end px-4 pb-3 gap-3">
          <span
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg ring-2 ring-white/20 shrink-0 -mb-7 bg-[#0d0d0d]"
            style={{ borderColor: theme }}
          >
            {world.iconEmoji || "📚"}
          </span>
          <div className="min-w-0 flex-1 pb-1">
            <h1 className="text-xl font-extrabold text-white tracking-tight truncate">{world.name}</h1>
          </div>
          <div className="text-right pb-1 shrink-0">
            <p className="text-lg font-extrabold text-white leading-none">{articles.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/80 font-bold">Pages</p>
          </div>
          <div className="flex items-center gap-1.5 pb-1 shrink-0">
            <IconSquare onClick={scrollToMaps} label="Cartes interactives">
              <MapIcon className="w-4 h-4" />
            </IconSquare>
            <IconSquare onClick={onNewNote} label="Nouvelle page">
              <Plus className="w-4 h-4" />
            </IconSquare>
            <IconSquare onClick={onEditHome} label="Options">
              <MoreVertical className="w-4 h-4" />
            </IconSquare>
          </div>
        </div>
      </div>

      {/* Barre de menu : EXPLORER + catégories */}
      <div className="bg-black/60 backdrop-blur px-2 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-white/10">
        <button
          type="button"
          onClick={onExplore}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-white hover:text-[#ffc500] whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-4 h-4" /> Explorer <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {categories.slice(0, 5).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onOpenCategory(c)}
            className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-white hover:text-[#ffc500] whitespace-nowrap cursor-pointer"
          >
            {c} <ChevronDown className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      {/* Contenu teinté de la couleur du wiki */}
      <div
        className="px-4 sm:px-6 pt-6"
        style={{ background: `linear-gradient(180deg, ${theme}30 0%, rgba(13,13,13,0) 520px)` }}
      >
        {/* Cercles flottants + titre Accueil */}
        <div className="flex items-start gap-3">
          <div className="hidden sm:flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={onEditHome}
              className="w-10 h-10 rounded-full bg-[#2e2e2e] text-[#ffc500] flex items-center justify-center hover:bg-[#3a3a3a] cursor-pointer"
              aria-label="Modifier l'accueil"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSaved(!saved)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                saved ? "bg-[#ffc500] text-black" : "bg-[#2e2e2e] text-[#ffc500] hover:bg-[#3a3a3a]"
              }`}
              aria-label="Enregistrer"
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-black" : ""}`} />
            </button>
          </div>

          <div className="flex-1 flex items-start justify-between gap-3 flex-wrap">
            <h2 className="text-3xl font-light text-white tracking-tight">Accueil</h2>
            <div className="flex items-center gap-4 text-[#ffc500] text-xs font-bold uppercase tracking-wide relative">
              <button type="button" onClick={() => setSaved(!saved)} className="flex items-center gap-1.5 cursor-pointer">
                <Bookmark className={`w-4 h-4 ${saved ? "fill-[#ffc500]" : ""}`} /> Enregistrer
              </button>
              <span className="text-neutral-600">|</span>
              <button type="button" onClick={onEditHome} className="flex items-center gap-1.5 cursor-pointer">
                <Pencil className="w-4 h-4" /> Modifier
              </button>
              <span className="text-neutral-600">|</span>
              <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer" aria-label="Plus">
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-7 z-50 w-52 rounded-lg bg-[#2e2e2e] border border-neutral-700 shadow-2xl py-2 fd-fade-up">
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); onEditHome(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-neutral-200 hover:bg-neutral-700/50 cursor-pointer"
                    >
                      <FileCode2 className="w-4 h-4 text-[#ffc500]" /> Wikitext de l'accueil
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); onNewNote(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-neutral-200 hover:bg-neutral-700/50 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#ffc500]" /> Nouvelle page
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bienvenue */}
        <div className="mt-8">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white text-center">
            Bienvenue sur le wiki {world.name}&nbsp;!
          </h3>
          {world.description && (
            <p className="text-[16px] leading-8 text-neutral-200 mt-6">{world.description}</p>
          )}
          {world.tagline && (
            <p className="text-[15px] leading-7 text-neutral-300 mt-3">{world.tagline}</p>
          )}
        </div>

        {/* Articles importants */}
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">Articles importants</h3>
            <Pencil className="w-4 h-4 text-[#ffc500]" />
          </div>
          <div className="h-px bg-neutral-600/70 mt-2 mb-6" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-6">
            {slots.map((a, i) =>
              a ? (
                <button key={a.slug} type="button" onClick={() => onOpenArticle(a.slug, a.worldSlug)} className="text-center group cursor-pointer">
                  <div className="aspect-square border border-neutral-500/60 bg-black/20 overflow-hidden flex items-center justify-center">
                    {a.infobox?.image ? (
                      <img src={a.infobox.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-4xl">{world.iconEmoji || "📄"}</span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#ffc500] mt-2 leading-snug group-hover:underline">{a.title}</p>
                </button>
              ) : (
                <button key={`ph-${i}`} type="button" onClick={onNewNote} className="text-center group cursor-pointer">
                  <div className="aspect-square border border-neutral-500/50 bg-black/10 flex items-center justify-center">
                    <span className="text-[15px]" style={{ color: theme }}>
                      Placeholder
                    </span>
                  </div>
                  <p className="text-[13px] text-[#ff5d5d] mt-2 leading-snug group-hover:underline">
                    {PLACEHOLDER_CAPTIONS[i]}
                  </p>
                </button>
              )
            )}
          </div>
        </div>

        {/* Aide / solo PWA */}
        <div className="grid sm:grid-cols-2 gap-8 mt-12">
          <div>
            <p className="italic text-[15px] text-neutral-200">Besoin d'aide pour structurer ce wiki&nbsp;?</p>
            <ul className="mt-4 space-y-2.5 text-[15px] list-disc pl-5 marker:text-[#ffc500]">
              <li>
                <button type="button" onClick={onExplore} className="text-[#ffc500] hover:underline cursor-pointer">
                  Explorer les catégories (navigation)
                </button>
              </li>
              <li>
                <button type="button" onClick={scrollToMaps} className="text-[#ffc500] hover:underline cursor-pointer">
                  Cartes interactives
                </button>
              </li>
              <li>
                <button type="button" onClick={onNewNote} className="text-[#ffc500] hover:underline cursor-pointer">
                  Créer une nouvelle page
                </button>
              </li>
              <li>
                <button type="button" onClick={onEditHome} className="text-[#ffc500] hover:underline cursor-pointer">
                  Éditer en Wikitext
                </button>
              </li>
            </ul>
          </div>
          <p className="text-[15px] leading-7 text-neutral-200">
            Ce wiki est votre espace personnel (app solo / PWA) : reliez vos pages entre elles avec des liens{" "}
            <code className="text-[#ffc500] bg-black/40 px-1 rounded">[[...]]</code>, étiquetez-les avec des
            catégories, et retrouvez tout via la recherche et le menu Explorer.
          </p>
        </div>

        {/* Cartes interactives (ancre) */}
        <div id="project-cartes" className="mt-12">
          <div className="flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-[#ffc500]" />
            <h3 className="text-2xl font-extrabold text-white tracking-tight">Cartes interactives</h3>
          </div>
          <p className="text-[14px] text-neutral-400 mt-2">
            {articles.length > 0
              ? "Ajoutez des épingles à ce projet depuis l'éditeur de carte (bientôt dans cette vue)."
              : "Vos cartes interactives apparaîtront ici."}
          </p>
        </div>
      </div>

      <Fab onClick={onNewNote} label="Nouvelle page" />
    </div>
  );
}

function IconSquare({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-md border border-white/40 bg-black/40 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
    >
      {children}
    </button>
  );
}
