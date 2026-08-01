"use client";

import React, { useEffect, useState } from "react";
import { MoreVertical, Map as MapIcon, ListTodo, MapPin } from "lucide-react";
import type { World, Article, MapMarker, SortKey } from "@/lib/types";
import {
  SectionHeader,
  Dropdown,
  Fab,
  EmptyState,
  WorldCircle,
  ArticleCard,
} from "./ui";

export function HomeView({
  worlds,
  articles,
  community,
  setCommunity,
  sort,
  setSort,
  onOpenArticle,
  onOpenWorld,
  onSeeAll,
  onNewNote,
  onOpenProgress,
}: {
  worlds: World[];
  articles: Article[];
  community: string;
  setCommunity: (v: string) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  onOpenArticle: (slug: string, world: string) => void;
  onOpenWorld: (slug: string) => void;
  onSeeAll: () => void;
  onNewNote: () => void;
  onOpenProgress: () => void;
}) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const scopeSlug = community === "all" ? "aethelgard" : community;

  useEffect(() => {
    fetch(`/api/map?world=${scopeSlug}`)
      .then((r) => r.json())
      .then((d) => d.success && setMarkers(d.markers || []))
      .catch(() => setMarkers([]));
  }, [scopeSlug]);

  const scoped = community === "all" ? articles : articles.filter((a) => a.worldSlug === community);

  const sortArticles = (list: Article[]) => {
    const copy = [...list];
    switch (sort) {
      case "az":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return copy.sort((a, b) => b.title.localeCompare(a.title));
      case "old":
        return copy.sort((a, b) => (a.updatedAt || "").localeCompare(b.updatedAt || ""));
      default:
        return copy.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    }
  };

  const recents = sortArticles(scoped).sort(
    (a, b) => Number(b.isFeatured || false) - Number(a.isFeatured || false)
  );

  const projects = sortArticles.length ? sortWorlds(worlds, sort, community) : worlds;

  const communityName =
    community === "all" ? "Toutes les communautés" : worlds.find((w) => w.slug === community)?.name || "Communauté";

  const sortLabel =
    sort === "az" ? "Nom A-Z" : sort === "za" ? "Nom Z-A" : sort === "old" ? "Plus ancien" : "Plus récent";

  // Suivi de progression : répartition par catégorie
  const catCounts = new Map<string, number>();
  for (const a of scoped) catCounts.set(a.category, (catCounts.get(a.category) || 0) + 1);
  const total = scoped.length || 1;

  return (
    <div className="fd-fade-up">
      {/* Bannière magenta "Salut Michaz!" */}
      <div className="relative overflow-hidden fd-triangles" style={{ background: "linear-gradient(120deg,#46002f 0%,#7a0050 55%,#a4006a 100%)" }}>
        <div className="relative z-10 flex items-center gap-4 px-4 py-5">
          <div className="w-14 h-14 rounded-full bg-neutral-300 flex items-center justify-center shrink-0 overflow-hidden">
            <svg viewBox="0 0 24 24" className="w-9 h-9 text-neutral-500" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6v1H4z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-white/90">Progression</p>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Salut Michaz&nbsp;!</h1>
          </div>
          <button type="button" className="w-10 h-14 rounded-lg bg-black/40 flex items-center justify-center text-white cursor-pointer" aria-label="Options">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <img
          src="/images/banner-heroes.png"
          alt=""
          className="absolute right-0 top-0 h-full w-1/2 object-cover object-left pointer-events-none opacity-95"
          style={{ maskImage: "linear-gradient(to right, transparent, black 30%)" }}
        />
      </div>

      {/* Pills filtres */}
      <div className="px-4 py-5 flex flex-wrap gap-3">
        <Dropdown
          lines={[communityName]}
          value={community}
          onChange={setCommunity}
          options={[
            { value: "all", label: "Toutes les communautés" },
            ...worlds.map((w) => ({ value: w.slug, label: w.name })),
          ]}
        />
        <Dropdown
          lines={["Trier par:", sortLabel]}
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          light
          options={[
            { value: "az", label: "Nom A-Z" },
            { value: "za", label: "Nom Z-A" },
            { value: "old", label: "Plus ancien" },
            { value: "recent", label: "Plus récent" },
          ]}
        />
      </div>

      {/* Re-plongez-vous */}
      <section className="px-4 pt-2">
        <SectionHeader title="Re-plongez-vous" action="Voir tout" onAction={onSeeAll} />
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-2 -mx-4 px-4">
          {recents.slice(0, 8).map((a) => (
            <ArticleCard
              key={`${a.worldSlug}-${a.slug}`}
              article={a}
              world={worlds.find((w) => w.slug === a.worldSlug)}
              onOpen={() => onOpenArticle(a.slug, a.worldSlug)}
            />
          ))}
          {recents.length === 0 && (
            <p className="text-neutral-400 py-8">Aucune note dans cette communauté pour l'instant.</p>
          )}
        </div>
      </section>

      {/* Mes projets */}
      <section className="px-4 pt-8">
        <SectionHeader title="Mes projets" />
        <div className="grid grid-cols-3 gap-x-4 gap-y-7 justify-items-center">
          {projects.map((w) => (
            <WorldCircle key={w.slug} world={w} onClick={() => onOpenWorld(w.slug)} />
          ))}
        </div>
      </section>

      {/* Cartes interactives */}
      <section className="px-4 pt-10">
        <SectionHeader title="Cartes interactives" icon={<MapIcon className="w-6 h-6" />} />
        {markers.length === 0 ? (
          <EmptyState
            title="Pas encore de contenu..."
            subtitle="Vos cartes interactives apparaîtront ici."
          />
        ) : (
          <div className="rounded-lg bg-[#202022] p-4 space-y-2">
            {markers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => m.articleSlug && onOpenArticle(m.articleSlug, scopeSlug)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1c1c1e] hover:bg-[#242426] text-left cursor-pointer"
              >
                <span className="w-9 h-9 rounded-full bg-[#ffc500]/15 border border-[#ffc500]/40 text-[#ffc500] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold text-white truncate">{m.title}</span>
                  <span className="block text-[12px] text-neutral-400 capitalize">{m.type}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Suivi de la progression du tableau */}
      <section className="px-4 pt-10 pb-28">
        <button type="button" onClick={onOpenProgress} className="w-full text-left cursor-pointer">
          <SectionHeader title="Suivi de la progression du tableau" icon={<ListTodo className="w-6 h-6" />} />
        </button>
        <div className="rounded-lg bg-[#202022] p-5 space-y-4">
          {[...catCounts.entries()].map(([cat, n]) => (
            <div key={cat}>
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="font-bold text-white capitalize">{cat}</span>
                <span className="text-neutral-400">{n} page{n > 1 ? "s" : ""}</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ffc500]"
                  style={{ width: `${Math.round((n / total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {catCounts.size === 0 && <p className="text-neutral-400 text-sm">Aucune page à suivre.</p>}
        </div>
      </section>

      <Fab onClick={onNewNote} label="Nouvelle note" />
    </div>
  );
}

function sortWorlds(worlds: World[], sort: SortKey, community: string): World[] {
  let list = community === "all" ? [...worlds] : worlds.filter((w) => w.slug === community);
  switch (sort) {
    case "az":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "za":
      list.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "old":
      list.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
      break;
    default:
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }
  return list;
}
