"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bookmark, History } from "lucide-react";
import type { World, Article, SortKey } from "@/lib/types";
import { formatSlugTitle, extractHeadings } from "@/lib/wiki-parser";
import { TopBar, LeftRail, Drawer, Fab, ArticleRow, type RailKey } from "@/components/fandom/ui";
import { HomeView } from "@/components/fandom/HomeView";
import { ProjectView } from "@/components/fandom/ProjectView";
import { CategoriesView } from "@/components/fandom/CategoriesView";
import { ArticleView } from "@/components/fandom/ArticleView";
import { SearchView } from "@/components/fandom/SearchView";
import { FilesView } from "@/components/fandom/FilesView";
import { ProjectDrawer } from "@/components/fandom/ProjectDrawer";
import { WikitextEditor } from "@/components/fandom/WikitextEditor";

type View =
  | { t: "home" }
  | { t: "world"; slug: string }
  | { t: "categories"; cat: string | null }
  | { t: "article"; slug: string; world: string }
  | { t: "list"; kind: "pinned" | "recent" }
  | { t: "search"; q: string; scope: string }
  | { t: "files" };

export default function HomePage() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [view, setView] = useState<View>({ t: "home" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [community, setCommunity] = useState("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [editor, setEditor] = useState<{ open: boolean; article: Article | null; title?: string }>({
    open: false,
    article: null,
  });

  const refresh = async () => {
    try {
      const [wRes, aRes] = await Promise.all([fetch("/api/worlds"), fetch("/api/articles")]);
      const wData = await wRes.json();
      const aData = await aRes.json();
      if (wData.success) setWorlds(wData.worlds);
      if (aData.success) setArticles(aData.articles);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const worldOf = (slug: string) => worlds.find((w) => w.slug === slug);

  const openArticle = (slug: string, world: string) => {
    setView({ t: "article", slug, world });
    window.scrollTo({ top: 0 });
  };

  /** Portée par défaut de la recherche : le projet courant sinon tout. */
  const currentProjectSlug =
    view.t === "world" ? view.slug : view.t === "article" ? view.world : community !== "all" ? community : "all";

  const openSearch = (q = "") => setView({ t: "search", q, scope: currentProjectSlug });

  /** Navigation depuis un [[wikilink]] : page trouvée → article ; sinon → page de recherche (créer). */
  const navigateSlug = (slug: string) => {
    const found = articles.find((a) => a.slug === slug);
    if (found) {
      openArticle(found.slug, found.worldSlug);
    } else {
      openSearch(formatSlugTitle(slug));
    }
  };

  const openEditor = (article: Article | null, title?: string) => setEditor({ open: true, article, title });

  const defaultWorldForEditor = useMemo(() => {
    if (view.t === "world") return view.slug;
    if (view.t === "article") return view.world;
    if (community !== "all") return community;
    return worlds[0]?.slug || "notebook";
  }, [view, community, worlds]);

  const togglePin = async (article: Article) => {
    try {
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldSlug: article.worldSlug,
          slug: article.slug,
          title: article.title,
          category: article.category,
          infobox: article.infobox || undefined,
          markdownContent: article.markdownContent,
          excerpt: article.excerpt,
          tags: article.tags || [],
          isFeatured: !article.isFeatured,
        }),
      });
      setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, isFeatured: !a.isFeatured } : a)));
    } catch (e) {
      console.error(e);
    }
  };

  const onRailNav = (k: RailKey) => {
    if (k === "home") setView({ t: "home" });
    else if (k === "categories") setView({ t: "categories", cat: null });
    else if (k === "pinned") setView({ t: "list", kind: "pinned" });
    else if (k === "recent") setView({ t: "list", kind: "recent" });
    else if (k === "progress") setView({ t: "home" });
    else if (k === "files") setView({ t: "files" });
    else if (k === "wikitext") {
      const latest = [...articles].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))[0];
      openEditor(latest || null);
    }
  };

  const railActive: RailKey =
    view.t === "home"
      ? "home"
      : view.t === "categories"
      ? "categories"
      : view.t === "list"
      ? view.kind
      : view.t === "files"
      ? "files"
      : "home";

  const currentArticle =
    view.t === "article" ? articles.find((a) => a.slug === view.slug && a.worldSlug === view.world) : undefined;

  /* Contexte projet (pour le tiroir image 2) */
  const projectContext = view.t === "world" || view.t === "article";
  const projectWorld =
    view.t === "world" ? worldOf(view.slug) : view.t === "article" ? worldOf(view.world) : undefined;
  const projectArticles = projectWorld ? articles.filter((a) => a.worldSlug === projectWorld.slug) : [];
  const projectCategories = Array.from(new Set(projectArticles.map((a) => a.category)));
  const projectImportant = [...projectArticles]
    .sort((a, b) => Number(b.isFeatured || false) - Number(a.isFeatured || false))
    .slice(0, 6);

  const editProjectHome = (worldSlug: string) => {
    const home = articles.find((a) => a.worldSlug === worldSlug && a.slug === "accueil");
    openEditor(home || null, home ? undefined : "Accueil");
  };

  const listArticles = useMemo(() => {
    const sorted = [...articles].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    return view.t === "list" && view.kind === "pinned" ? sorted.filter((a) => a.isFeatured) : sorted;
  }, [articles, view]);

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <TopBar
        onMenu={() => setDrawerOpen(true)}
        onSearch={() => openSearch()}
        onHome={() => setView({ t: "home" })}
        showAccount={view.t === "home"}
      />
      <LeftRail active={railActive} onNav={onRailNav} />

      <main className="md:pl-20">
        {view.t === "home" && (
          <HomeView
            worlds={worlds}
            articles={articles}
            community={community}
            setCommunity={setCommunity}
            sort={sort}
            setSort={setSort}
            onOpenArticle={openArticle}
            onOpenWorld={(slug) => setView({ t: "world", slug })}
            onSeeAll={() => setView({ t: "list", kind: "recent" })}
            onNewNote={() => openEditor(null)}
            onOpenProgress={() => setView({ t: "home" })}
          />
        )}

        {view.t === "world" && projectWorld && (
          <ProjectView
            world={projectWorld}
            articles={projectArticles}
            allWorlds={worlds}
            onOpenArticle={openArticle}
            onOpenCategory={(cat) => setView({ t: "categories", cat })}
            onNewNote={() => openEditor(null)}
            onExplore={() => setDrawerOpen(true)}
            onEditHome={() => editProjectHome(projectWorld.slug)}
          />
        )}
        {view.t === "world" && !projectWorld && <p className="p-8 text-neutral-400">Projet introuvable.</p>}

        {view.t === "categories" && (
          <CategoriesView
            articles={articles}
            worlds={worlds}
            selected={view.cat}
            onSelect={(cat) => setView({ t: "categories", cat })}
            onOpenArticle={openArticle}
          />
        )}

        {view.t === "article" &&
          (currentArticle ? (
            <ArticleView
              article={currentArticle}
              world={worldOf(currentArticle.worldSlug)}
              allArticles={articles}
              onNavigate={navigateSlug}
              onEdit={() => openEditor(currentArticle)}
              onTogglePin={() => togglePin(currentArticle)}
            />
          ) : (
            <div className="p-10 text-center">
              <p className="text-neutral-300 text-lg font-bold mb-2">Page introuvable</p>
              <p className="text-neutral-500 text-sm mb-6">Cette page n'existe pas encore dans le wiki.</p>
              <button
                type="button"
                onClick={() => openEditor(null)}
                className="px-5 py-2.5 rounded-full bg-[#ffc500] text-black font-bold text-sm cursor-pointer"
              >
                Créer la page
              </button>
            </div>
          ))}

        {view.t === "search" && (
          <SearchView
            initialQ={view.q}
            defaultScope={view.scope}
            articles={articles}
            worlds={worlds}
            onOpenArticle={openArticle}
            onCreate={(title) => openEditor(null, title)}
          />
        )}

        {view.t === "files" && (
          <FilesView
            worlds={worlds}
            articles={articles}
            onOpenArticle={openArticle}
            onChanged={() => refresh()}
          />
        )}

        {view.t === "list" && (
          <div className="px-4 py-5 pb-28 fd-fade-up">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 mb-5">
              <span className="text-[#ffc500]">
                {view.kind === "pinned" ? <Bookmark className="w-7 h-7" /> : <History className="w-7 h-7" />}
              </span>
              {view.kind === "pinned" ? "Pages enregistrées" : "Historique récent"}
            </h1>
            <div className="space-y-2.5 max-w-3xl">
              {listArticles.map((a) => (
                <ArticleRow
                  key={`${a.worldSlug}-${a.slug}`}
                  article={a}
                  world={worldOf(a.worldSlug)}
                  onOpen={() => openArticle(a.slug, a.worldSlug)}
                />
              ))}
              {listArticles.length === 0 && <p className="text-neutral-400 py-8 text-center">Rien ici pour l'instant.</p>}
            </div>
            <Fab onClick={() => openEditor(null)} label="Nouvelle note" />
          </div>
        )}
      </main>

      {/* Tiroir global (accueil / listes) */}
      {!projectContext && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          worlds={worlds}
          onHome={() => setView({ t: "home" })}
          onCategories={() => setView({ t: "categories", cat: null })}
          onFiles={() => setView({ t: "files" })}
          onOpenWorld={(slug) => setView({ t: "world", slug })}
          onNewNote={() => openEditor(null)}
        />
      )}

      {/* Tiroir de projet (image 2) */}
      {projectContext && projectWorld && (
        <ProjectDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          world={projectWorld}
          categories={projectCategories}
          articleTitle={currentArticle?.title || null}
          headings={currentArticle ? extractHeadings(currentArticle.markdownContent) : []}
          important={projectImportant}
          onExplore={() => setView({ t: "categories", cat: null })}
          onOpenCategory={(cat) => setView({ t: "categories", cat })}
          onOpenArticle={openArticle}
          onMaps={() => setView({ t: "world", slug: projectWorld.slug })}
        />
      )}

      {/* Éditeur Wikitext */}
      {editor.open && (
        <WikitextEditor
          initial={editor.article}
          initialTitle={editor.title}
          defaultWorld={defaultWorldForEditor}
          worlds={worlds.map((w) => ({ slug: w.slug, name: w.name }))}
          onClose={() => setEditor({ open: false, article: null })}
          onSaved={(slug, world) => {
            setEditor({ open: false, article: null });
            refresh().then(() => openArticle(slug, world));
          }}
        />
      )}
    </div>
  );
}
