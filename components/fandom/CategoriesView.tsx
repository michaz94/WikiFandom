"use client";

import React, { useState } from "react";
import { List, Pencil, Bookmark, Hash, ChevronLeft } from "lucide-react";
import type { Article, World } from "@/lib/types";
import { SectionHeader, ArticleRow } from "./ui";

/**
 * Page Catégories : reprend la mise en page "Aide:Catégories" (fil d'ariane,
 * actions jaunes, image d'illustration, encadré Sommaire, sections soulignées)
 * avec le vrai contenu du wiki. Texte d'aide rédigé pour ce wiki.
 */
export function CategoriesView({
  articles,
  worlds,
  selected,
  onSelect,
  onOpenArticle,
}: {
  articles: Article[];
  worlds: World[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
  onOpenArticle: (slug: string, world: string) => void;
}) {
  const cats = Array.from(new Set(articles.map((a) => a.category))).sort((a, b) => a.localeCompare(b));
  const [showToc, setShowToc] = useState(true);

  if (selected) {
    const list = articles.filter((a) => a.category === selected);
    return (
      <div className="px-4 py-5 fd-fade-up">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="flex items-center gap-1 text-[#ffc500] text-sm font-bold mb-4 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Toutes les catégories
        </button>

        <Breadcrumb trail={["Aide", "Navigation"]} />
        <div className="flex items-center gap-3 mt-3">
          <span className="w-10 h-10 rounded-full bg-[#2e2e2e] flex items-center justify-center text-[#ffc500]">
            <Hash className="w-5 h-5" />
          </span>
          <h1 className="text-3xl font-light text-white tracking-tight">Catégorie:{capitalize(selected)}</h1>
        </div>

        <p className="text-[15px] text-neutral-300 mt-4">
          {list.length} page{list.length > 1 ? "s" : ""} dans cette catégorie.
        </p>

        <div className="mt-5 space-y-2.5 pb-24">
          {list.map((a) => (
            <ArticleRow
              key={`${a.worldSlug}-${a.slug}`}
              article={a}
              world={worlds.find((w) => w.slug === a.worldSlug)}
              onOpen={() => onOpenArticle(a.slug, a.worldSlug)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 fd-fade-up pb-24">
      <Breadcrumb trail={["Aide", "Navigation"]} />

      {/* Titre + actions */}
      <div className="flex items-start justify-between gap-3 mt-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#2e2e2e] flex items-center justify-center text-[#ffc500]">
            <Pencil className="w-5 h-5" />
          </span>
          <h1 className="text-3xl font-light text-white tracking-tight">Aide:Catégories</h1>
        </div>
        <div className="flex items-center gap-4 text-[#ffc500] text-xs font-bold uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4" /> Enregistrer
          </span>
          <span className="text-neutral-600">|</span>
          <span className="flex items-center gap-1.5">
            <Pencil className="w-4 h-4" /> Modifier
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2">
          <p className="text-[16px] leading-8 text-neutral-200">
            Une <strong className="text-white">catégorie</strong> fonctionne comme une{" "}
            <strong className="text-white">étiquette (tag)</strong> : ce n'est pas une page de contenu
            worldbuilding, c'est une page de <em className="text-neutral-300">navigation</em>. Les vraies pages de
            lore (un pouvoir, un lieu, une franchise…) sont des articles ordinaires, simplement étiquetés.
          </p>
          <p className="text-[16px] leading-8 text-neutral-200 mt-4">
            La page d'une catégorie est l'<strong className="text-white">index automatique</strong> de toutes les
            pages qui portent ce tag — l'équivalent de «&nbsp;toutes les pages, limitées à cette étiquette&nbsp;».
            Touchez une catégorie ci-dessous pour afficher son index.
          </p>

          {/* Sommaire */}
          <div className="mt-6 rounded-lg border border-neutral-700 bg-[#161618]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700">
              <span className="flex items-center gap-2 text-[15px] font-bold text-white">
                <List className="w-4 h-4" /> Sommaire
              </span>
              <button
                type="button"
                onClick={() => setShowToc(!showToc)}
                className="text-[#ffc500] text-[13px] cursor-pointer"
              >
                [{showToc ? "masquer" : "afficher"}]
              </button>
            </div>
            {showToc && (
              <ol className="px-5 py-3 space-y-2 text-[15px] text-neutral-200">
                {cats.map((c, i) => (
                  <li key={c} className="flex items-baseline gap-2">
                    <span className="text-neutral-400">{i + 1}.</span>
                    <button
                      type="button"
                      onClick={() => onSelect(c)}
                      className="text-[#ffc500] underline decoration-[#ffc500]/40 underline-offset-2 hover:text-[#ffd54a] capitalize cursor-pointer"
                    >
                      {c}
                    </button>
                    <span className="text-neutral-500 text-[13px]">
                      ({articles.filter((a) => a.category === c).length})
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Sections */}
          <HelpHeading title="Pourquoi des catégories ?" />
          <p className="text-[16px] leading-8 text-neutral-200">
            Elles structurent le wiki : sans elles, il faudrait connaître le nom exact d'une page pour la
            retrouver. Avec elles, on navigue de proche en proche — par exemple d'un personnage vers la
            catégorie <em className="text-neutral-300">Personnages</em>, puis vers sa faction.
          </p>

          <HelpHeading title="Comment catégoriser une page ?" />
          <p className="text-[16px] leading-8 text-neutral-200">
            Ouvrez une page puis touchez <strong className="text-white">MODIFIER</strong> : la catégorie est
            définie dans l'éditeur Wikitext. Les liens <code className="text-[#ffc500] bg-neutral-800 px-1 rounded">[[...]]</code>{" "}
            créent aussi des connexions entre les pages, visibles dans les renvois en bas d'article.
          </p>
        </div>

        {/* Colonne latérale : illustration */}
        <div className="hidden lg:block">
          <div className="rounded-md overflow-hidden border border-neutral-700 bg-white p-4">
            <p className="text-[11px] text-neutral-500 mb-2">
              in: <span className="text-pink-600">Category 1</span>, <span className="text-pink-600">Category 2</span>,{" "}
              <span className="text-pink-600">Category 3</span>, and <span className="underline">2 more</span>
            </p>
            <div className="flex gap-3">
              <p className="text-2xl text-neutral-400 flex-1">Lorem Ipsum</p>
              <div className="space-y-1.5">
                <div className="bg-neutral-200 text-neutral-500 text-[10px] px-3 py-1.5">Category 4</div>
                <div className="bg-neutral-200 text-neutral-500 text-[10px] px-3 py-1.5">Category 5</div>
              </div>
            </div>
          </div>
          <p className="text-[13px] text-neutral-400 mt-2 leading-5">
            Catégories affichées en haut de page, avec le détail au survol de «&nbsp;more&nbsp;».
          </p>

          <div className="mt-6">
            <SectionHeader title="Toutes les catégories" />
            <div className="space-y-2">
              {cats.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onSelect(c)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1c1c1e] hover:bg-[#242426] cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-[15px] font-bold text-white capitalize">
                    <Hash className="w-4 h-4 text-[#ffc500]" /> {c}
                  </span>
                  <span className="text-[12px] text-neutral-400">
                    {articles.filter((a) => a.category === c).length} pages
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Liste mobile des catégories */}
      <div className="lg:hidden mt-8">
        <SectionHeader title="Toutes les catégories" />
        <div className="space-y-2">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onSelect(c)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1c1c1e] hover:bg-[#242426] cursor-pointer"
            >
              <span className="flex items-center gap-2 text-[15px] font-bold text-white capitalize">
                <Hash className="w-4 h-4 text-[#ffc500]" /> {c}
              </span>
              <span className="text-[12px] text-neutral-400">
                {articles.filter((a) => a.category === c).length} pages
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ trail }: { trail: string[] }) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="w-7 h-7 rounded-full bg-[#2e2e2e] flex items-center justify-center text-neutral-300">
        <List className="w-3.5 h-3.5" />
      </span>
      <span className="text-neutral-300">dans :</span>
      {trail.map((t, i) => (
        <span key={t} className="text-[#ffc500]">
          {t}
          {i < trail.length - 1 ? "," : ""}
        </span>
      ))}
    </div>
  );
}

function HelpHeading({ title }: { title: string }) {
  return (
    <div className="mt-8 mb-3">
      <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
      <div className="mt-2 flex items-center gap-2">
        <Pencil className="w-3.5 h-3.5 text-[#ffc500]" />
        <div className="flex-1 h-px bg-neutral-700" />
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
