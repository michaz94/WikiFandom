"use client";

import React, { useMemo, useState } from "react";
import { Search, ArrowRight, ChevronDown, LayoutList, X } from "lucide-react";
import type { Article, World } from "@/lib/types";

type SearchSort = "relevance" | "recent" | "az";

interface ParsedQuery {
  phrases: string[];
  exclude: string[];
  words: string[];
  orWords: string[];
}

/**
 * Page « Résultats de recherche » (images 3 & 4) + couche recherche Google Docs/Drive :
 * opérateurs "expression", -exclusion, mot1 ~ mot2 (OU), tri pertinence / date / titre,
 * portée Ce projet / Tous les projets, vignettes, onglets Articles / Images.
 */
export function SearchView({
  initialQ,
  defaultScope,
  articles,
  worlds,
  onOpenArticle,
  onCreate,
}: {
  initialQ: string;
  defaultScope: string;
  articles: Article[];
  worlds: World[];
  onOpenArticle: (slug: string, world: string) => void;
  onCreate: (title: string) => void;
}) {
  const [q, setQ] = useState(initialQ);
  const [scope, setScope] = useState(defaultScope);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SearchSort>("relevance");
  const [advanced, setAdvanced] = useState(false);
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [tab, setTab] = useState<"articles" | "images">("articles");

  const scopeName = scope === "all" ? "Tous les projets" : worlds.find((w) => w.slug === scope)?.name || "Ce projet";
  const sortLabel = sort === "relevance" ? "Pertinence" : sort === "recent" ? "Date de modification" : "Titre A-Z";

  const scoped = useMemo(
    () => (scope === "all" ? articles : articles.filter((a) => a.worldSlug === scope)),
    [articles, scope]
  );

  const allCats = useMemo(() => Array.from(new Set(scoped.map((a) => a.category))).sort(), [scoped]);

  const query = q.trim();
  const parsed = useMemo(() => parseQuery(query), [query]);

  const scored = useMemo(() => {
    if (!query) return [];
    const list: { a: Article; score: number }[] = [];
    for (const a of scoped) {
      if (catFilter && a.category !== catFilter) continue;
      const s = scoreArticle(a, parsed);
      if (s !== null) list.push({ a, score: s });
    }
    switch (sort) {
      case "recent":
        list.sort((x, y) => (y.a.updatedAt || "").localeCompare(x.a.updatedAt || ""));
        break;
      case "az":
        list.sort((x, y) => x.a.title.localeCompare(y.a.title));
        break;
      default:
        list.sort((x, y) => y.score - x.score || (y.a.updatedAt || "").localeCompare(x.a.updatedAt || ""));
    }
    return list;
  }, [scoped, query, parsed, sort, catFilter]);

  const results = scored.map((s) => s.a);
  const imageResults = results.filter((a) => a.infobox?.image);

  const exact = useMemo(
    () => (query ? scoped.find((a) => a.title.toLowerCase() === query.toLowerCase()) : undefined),
    [scoped, query]
  );

  return (
    <div className="fd-fade-up pb-24">
      {/* Bannière jaune du wiki courant */}
      <div className="bg-[#ffc500] text-black px-4 py-4 flex items-center gap-3">
        <LayoutList className="w-7 h-7" strokeWidth={2.4} />
        <span className="text-lg font-extrabold uppercase tracking-wide">{scopeName}</span>
      </div>

      <div className="px-4 sm:px-6 pt-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pb-3 border-b border-neutral-800">
          Résultats de recherche
        </h1>

        {query && (
          <p className="text-[17px] leading-8 text-neutral-200 mt-6">
            {exact ? (
              <>
                Il existe une page nommée «{" "}
                <button
                  type="button"
                  onClick={() => onOpenArticle(exact.slug, exact.worldSlug)}
                  className="text-[#ffc500] font-bold hover:underline cursor-pointer"
                >
                  {exact.title}
                </button>{" "}
                » sur {scopeName}. Voyez également les autres résultats de recherche trouvés.
              </>
            ) : (
              <>
                Créer la page{" "}
                <button
                  type="button"
                  onClick={() => onCreate(query)}
                  className="text-[#ffc500] font-bold hover:underline cursor-pointer"
                >
                  "{query}"
                </button>{" "}
                sur ce wiki&nbsp;! Consultez également les résultats de votre recherche.
              </>
            )}
          </p>
        )}

        {/* Champ + portée + bouton flèche */}
        <div className="mt-7 flex items-stretch gap-3 relative">
          <div className="flex-1 flex items-center gap-2 border-b-2 border-neutral-500 focus-within:border-[#ffc500] pb-2">
            <Search className="w-5 h-5 text-neutral-200 shrink-0" />
            <button
              type="button"
              onClick={() => setScopeOpen(!scopeOpen)}
              className="text-neutral-400 hover:text-white cursor-pointer shrink-0"
              aria-label="Portée de la recherche"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${scopeOpen ? "rotate-180" : ""}`} />
            </button>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={'Rechercher — ex: "soleil" -citadelle aether ~ lame'}
              className="flex-1 bg-transparent text-[18px] text-white placeholder-neutral-600 focus:outline-none min-w-0"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} className="text-neutral-400 hover:text-white cursor-pointer" aria-label="Effacer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setTab("articles")}
            className="w-14 rounded-md bg-[#ffc500] text-black flex items-center justify-center hover:bg-[#ffd54a] cursor-pointer shrink-0"
            aria-label="Lancer la recherche"
          >
            <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {scopeOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setScopeOpen(false)} />
              <div className="absolute left-0 top-full mt-2 z-50 w-52 rounded-lg bg-[#2e2e2e] border border-neutral-700 shadow-2xl py-2 fd-fade-up">
                <div className="w-3 h-3 bg-[#2e2e2e] border-l border-t border-neutral-700 rotate-45 absolute -top-1.5 left-6" />
                <ScopeBtn label="Tous les projets" active={scope === "all"} onClick={() => { setScope("all"); setScopeOpen(false); }} />
                {worlds.map((w) => (
                  <ScopeBtn key={w.slug} label={w.name} active={scope === w.slug} onClick={() => { setScope(w.slug); setScopeOpen(false); }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recherche avancée + tri */}
        <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="text-[13px] text-neutral-300 flex items-center gap-1.5 cursor-pointer"
            >
              Trier par : <span className="text-white font-bold">{sortLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div className="absolute left-0 top-full mt-2 z-50 w-52 rounded-lg bg-[#2e2e2e] border border-neutral-700 shadow-2xl py-2 fd-fade-up">
                  <ScopeBtn label="Pertinence" active={sort === "relevance"} onClick={() => { setSort("relevance"); setSortOpen(false); }} />
                  <ScopeBtn label="Date de modification" active={sort === "recent"} onClick={() => { setSort("recent"); setSortOpen(false); }} />
                  <ScopeBtn label="Titre A-Z" active={sort === "az"} onClick={() => { setSort("az"); setSortOpen(false); }} />
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAdvanced(!advanced)}
            className="flex items-center gap-1.5 text-[#ffc500] font-extrabold text-sm uppercase tracking-wide cursor-pointer"
          >
            Recherche avancée
            <ChevronDown className={`w-4 h-4 transition-transform ${advanced ? "rotate-180" : ""}`} />
          </button>
        </div>

        {advanced && (
          <div className="mt-3 rounded-lg bg-[#161618] border border-neutral-800 p-4 fd-fade-up">
            <div className="flex flex-wrap gap-2">
              <Chip label="Toutes catégories" active={!catFilter} onClick={() => setCatFilter(null)} />
              {allCats.map((c) => (
                <Chip key={c} label={c} active={catFilter === c} onClick={() => setCatFilter(catFilter === c ? null : c)} />
              ))}
            </div>
            <ul className="mt-4 space-y-1.5 text-[13px] text-neutral-300">
              <li><code className="text-[#ffc500]">mot1 mot2</code> — tous les mots requis (ET)</li>
              <li><code className="text-[#ffc500]">"expression exacte"</code> — la phrase exacte</li>
              <li><code className="text-[#ffc500]">-mot</code> ou <code className="text-[#ffc500]">-"phrase"</code> — exclure</li>
              <li><code className="text-[#ffc500]">mot1 ~ mot2</code> — l'un ou l'autre (OU)</li>
            </ul>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-7 mt-6 border-b border-neutral-800 text-[17px]">
          <TabBtn label="Articles" active={tab === "articles"} onClick={() => setTab("articles")} />
          <TabBtn label="Images et vidéos" active={tab === "images"} onClick={() => setTab("images")} />
        </div>

        {query && (
          <p className="text-[16px] text-neutral-300 mt-4">
            Environ {tab === "images" ? imageResults.length : results.length} résultat
            {(tab === "images" ? imageResults.length : results.length) > 1 ? "s" : ""} pour{" "}
            <strong className="text-white">«{query}»</strong>
          </p>
        )}

        {/* Résultats articles avec vignette */}
        {tab === "articles" && (
          <div className="mt-4">
            {!query && <p className="text-neutral-500 py-8">Saisissez un terme pour rechercher dans {scopeName.toLowerCase()}.</p>}
            {query && results.length === 0 && (
              <p className="text-neutral-400 py-8">
                Aucun article trouvé.{" "}
                <button type="button" onClick={() => onCreate(query)} className="text-[#ffc500] font-bold hover:underline cursor-pointer">
                  Créer «&nbsp;{query}&nbsp;»
                </button>
                .
              </p>
            )}
            {results.map((a, i) => (
              <div key={`${a.worldSlug}-${a.slug}`} className={`py-5 ${i > 0 ? "border-t border-neutral-800" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onOpenArticle(a.slug, a.worldSlug)}
                      className="text-xl font-extrabold text-[#ffc500] hover:text-[#ffd54a] text-left cursor-pointer"
                    >
                      {highlight(a.title, parsed)}
                    </button>
                    <p className="text-[16px] leading-7 text-neutral-300 mt-2">{highlight(snippet(a, query), parsed)}</p>
                    <p className="text-[15px] text-neutral-500 mt-2">
                      {worlds.find((w) => w.slug === a.worldSlug)?.name || a.worldSlug}
                      {a.updatedAt && (
                        <span className="text-neutral-600"> · modifié le {new Date(a.updatedAt).toLocaleDateString("fr-FR")}</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenArticle(a.slug, a.worldSlug)}
                    className="w-16 h-16 rounded-lg overflow-hidden bg-[#1c1c1e] border border-neutral-800 shrink-0 flex items-center justify-center text-2xl cursor-pointer"
                    aria-label={`Ouvrir ${a.title}`}
                  >
                    {a.infobox?.image ? (
                      <img src={a.infobox.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{worlds.find((w) => w.slug === a.worldSlug)?.iconEmoji || "📄"}</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Résultats images */}
        {tab === "images" && (
          <div className="mt-5">
            {imageResults.length === 0 ? (
              <p className="text-neutral-400 py-8">Aucune image trouvée pour «&nbsp;{query || "…"}&nbsp;».</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {imageResults.map((a) => (
                  <button key={a.slug} type="button" onClick={() => onOpenArticle(a.slug, a.worldSlug)} className="text-left cursor-pointer group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-[#1c1c1e] border border-neutral-800">
                      <img src={a.infobox?.image || ""} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <p className="text-[13px] text-[#ffc500] mt-1.5 truncate">{a.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------- parsing & scoring ------------------------- */

function parseQuery(q: string): ParsedQuery {
  const phrases: string[] = [];
  const exclude: string[] = [];
  let rest = q;

  rest = rest.replace(/(^|\s)-"([^"]*)"/g, (_m, _s, p: string) => {
    if (p) exclude.push(p.toLowerCase());
    return " ";
  });
  rest = rest.replace(/"([^"]+)"/g, (_m, p: string) => {
    phrases.push(p.toLowerCase());
    return " ";
  });
  rest = rest.replace(/(^|\s)-(\S+)/g, (_m, _s, w: string) => {
    exclude.push(w.toLowerCase());
    return " ";
  });

  const hasOr = rest.includes("~");
  const parts = rest
    .split(/[~\s]+/)
    .map((w) => w.toLowerCase())
    .filter(Boolean);

  return hasOr ? { phrases, exclude, words: [], orWords: parts } : { phrases, exclude, words: parts, orWords: [] };
}

function stripMd(s: string) {
  return s
    .replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, "$1")
    .replace(/[#>*`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fields(a: Article) {
  return {
    title: a.title.toLowerCase(),
    tags: (a.tags || []).join(" ").toLowerCase(),
    cat: a.category.toLowerCase(),
    body: stripMd(a.markdownContent || a.excerpt || "").toLowerCase(),
  };
}

function scoreArticle(a: Article, p: ParsedQuery): number | null {
  const f = fields(a);
  const hay = `${f.title} ${f.tags} ${f.cat} ${f.body}`;
  let s = 0;

  for (const w of p.words) {
    if (!hay.includes(w)) return null;
    s += f.title.includes(w) ? 5 : f.tags.includes(w) ? 3 : f.cat.includes(w) ? 2 : f.body.includes(w) ? 1 : 0;
  }
  for (const ph of p.phrases) {
    if (!hay.includes(ph)) return null;
    s += f.title.includes(ph) ? 8 : f.body.includes(ph) ? 4 : 2;
  }
  for (const e of p.exclude) {
    if (hay.includes(e)) return null;
  }
  if (p.orWords.length) {
    const hits = p.orWords.filter((w) => hay.includes(w));
    if (!hits.length) return null;
    s += hits.length * 2;
  }
  return s;
}

/* ------------------------------ rendu ------------------------------ */

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, p: ParsedQuery): React.ReactNode {
  const terms = [...p.words, ...p.phrases, ...p.orWords].filter(Boolean);
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(escapeReg).join("|")})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <strong key={i} className="text-white font-extrabold">
        {part}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function snippet(a: Article, q: string) {
  const text = stripMd(a.markdownContent || a.excerpt || "");
  const first = q.replace(/[-"~]/g, " ").trim().split(/\s+/)[0] || "";
  if (!first) return text.slice(0, 180);
  const idx = text.toLowerCase().indexOf(first.toLowerCase());
  if (idx < 0) return text.slice(0, 180);
  const start = Math.max(0, idx - 60);
  return (start > 0 ? "… " : "") + text.slice(start, idx + 140) + " …";
}

function ScopeBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-[15px] cursor-pointer ${
        active ? "text-[#ffc500] font-bold bg-[#ffc500]/10" : "text-neutral-200 hover:bg-neutral-700/50"
      }`}
    >
      {label}
    </button>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold capitalize border cursor-pointer ${
        active
          ? "bg-[#ffc500] text-black border-[#ffc500]"
          : "text-neutral-300 border-neutral-600 hover:border-[#ffc500] hover:text-[#ffc500]"
      }`}
    >
      {label}
    </button>
  );
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-2.5 -mb-px border-b-2 cursor-pointer ${
        active ? "text-[#ffc500] border-[#ffc500] font-bold" : "text-neutral-400 border-transparent hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
