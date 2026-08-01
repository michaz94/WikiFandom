"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  Home,
  Compass,
  Bookmark,
  History,
  Wrench,
  Plus,
  X,
  ChevronDown,
  Map as MapIcon,
  MoreVertical,
  HardDrive,
} from "lucide-react";
import type { World, Article } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Top bar : hamburger jaune + logo "Wiki" + icônes jaunes            */
/* ------------------------------------------------------------------ */
export function TopBar({
  onMenu,
  onSearch,
  onHome,
  showAccount = false,
}: {
  onMenu: () => void;
  onSearch: () => void;
  onHome: () => void;
  showAccount?: boolean;
}) {
  const [pop, setPop] = useState<null | "bell" | "user">(null);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0d] border-b border-neutral-900">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onMenu} aria-label="Menu" className="text-[#ffc500] cursor-pointer">
            <Menu className="w-7 h-7" strokeWidth={3} />
          </button>
          <button type="button" onClick={onHome} className="text-2xl font-extrabold tracking-tight cursor-pointer">
            <span className="text-[#ffc500]">W</span>
            <span className="text-white">iki</span>
          </button>
        </div>

        <div className="flex items-center gap-4 relative">
          <button type="button" onClick={onSearch} aria-label="Rechercher" className="text-[#ffc500] cursor-pointer">
            <Search className="w-6 h-6" strokeWidth={2.5} />
          </button>
          {showAccount && (
            <>
              <button
                type="button"
                onClick={() => setPop(pop === "bell" ? null : "bell")}
                aria-label="Notifications"
                className="text-[#ffc500] relative cursor-pointer"
              >
                <Bell className="w-6 h-6" strokeWidth={2.2} />
                <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-[#ffc500]" />
              </button>
              <button
                type="button"
                onClick={() => setPop(pop === "user" ? null : "user")}
                aria-label="Compte"
                className="text-[#ffc500] cursor-pointer"
              >
                <User className="w-6 h-6" strokeWidth={2.2} />
              </button>
            </>
          )}

          {pop && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setPop(null)} />
              <div className="absolute right-0 top-10 z-50 w-60 rounded-lg bg-[#2e2e2e] shadow-2xl border border-neutral-700 p-4 fd-fade-up">
                {pop === "bell" ? (
                  <p className="text-sm text-neutral-200">Aucune nouvelle notification.</p>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-white">Michaz</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Connecté · Éditeur du wiki</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Rail latéral gauche (desktop) façon app Fandom                     */
/* ------------------------------------------------------------------ */
export type RailKey = "home" | "categories" | "pinned" | "progress" | "recent" | "wikitext" | "files";

export function LeftRail({ active, onNav }: { active: RailKey; onNav: (k: RailKey) => void }) {
  const items: { key: RailKey; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Accueil", icon: <Home className="w-5 h-5" /> },
    { key: "categories", label: "Explorer", icon: <Compass className="w-5 h-5" /> },
    { key: "pinned", label: "Enregistré", icon: <Bookmark className="w-5 h-5" /> },
    { key: "progress", label: "Suivi", icon: <MapIcon className="w-5 h-5" /> },
    { key: "recent", label: "Historique", icon: <History className="w-5 h-5" /> },
    { key: "files", label: "Fichiers", icon: <HardDrive className="w-5 h-5" /> },
    { key: "wikitext", label: "Wikitext", icon: <Wrench className="w-5 h-5" /> },
  ];

  return (
    <nav className="hidden md:flex fixed left-0 top-14 bottom-0 w-20 flex-col items-center gap-1 py-4 bg-[#0d0d0d] border-r border-neutral-900 z-30">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          onClick={() => onNav(it.key)}
          className={`w-16 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
            active === it.key ? "text-[#ffc500] bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
          }`}
        >
          {it.icon}
          <span className="leading-tight text-center">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Tiroir de navigation                                               */
/* ------------------------------------------------------------------ */
export function Drawer({
  open,
  onClose,
  worlds,
  onHome,
  onCategories,
  onFiles,
  onOpenWorld,
  onNewNote,
}: {
  open: boolean;
  onClose: () => void;
  worlds: World[];
  onHome: () => void;
  onCategories: () => void;
  onFiles: () => void;
  onOpenWorld: (slug: string) => void;
  onNewNote: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0d0d0d] border-r border-neutral-800 fd-slide-in flex flex-col">
        <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-900">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#ffc500]">W</span>
            <span className="text-white">iki</span>
          </span>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer" aria-label="Fermer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-3 space-y-1">
          <DrawerItem icon={<Home className="w-5 h-5" />} label="Accueil" onClick={() => { onHome(); onClose(); }} />
          <DrawerItem icon={<Compass className="w-5 h-5" />} label="Catégories" onClick={() => { onCategories(); onClose(); }} />
          <DrawerItem icon={<HardDrive className="w-5 h-5" />} label="Fichiers & sauvegarde" onClick={() => { onFiles(); onClose(); }} />
          <DrawerItem icon={<Plus className="w-5 h-5" />} label="Nouvelle note" onClick={() => { onNewNote(); onClose(); }} />
        </div>

        <div className="px-4 pt-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          Mes projets
        </div>
        <div className="flex-1 overflow-y-auto fd-scrollbar px-3 space-y-1">
          {worlds.map((w) => (
            <button
              key={w.slug}
              type="button"
              onClick={() => { onOpenWorld(w.slug); onClose(); }}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-900 text-left cursor-pointer"
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                style={{ backgroundColor: (w.themeColor || "#333") + "33" }}
              >
                {w.iconEmoji || "📚"}
              </span>
              <span className="text-sm text-neutral-200 truncate">{w.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-900 text-[11px] text-neutral-500">
          Design Fandom × Obsidian × World Anvil
        </div>
      </aside>
    </div>
  );
}

function DrawerItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-200 hover:bg-neutral-900 text-sm font-medium cursor-pointer"
    >
      <span className="text-[#ffc500]">{icon}</span>
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* En-tête de section : gros titre + action jaune                     */
/* ------------------------------------------------------------------ */
export function SectionHeader({
  title,
  icon,
  action,
  onAction,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
        {icon && <span className="text-[#ffc500]">{icon}</span>}
        {title}
      </h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="text-[#ffc500] font-bold text-sm tracking-wide uppercase hover:text-[#ffd54a] cursor-pointer shrink-0"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pilule + menu déroulant (filtres de l'accueil)                     */
/* ------------------------------------------------------------------ */
export function Dropdown({
  lines,
  options,
  value,
  onChange,
  light = false,
}: {
  lines: string[];
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  light?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`rounded-full px-5 py-3 text-left flex items-center justify-between gap-6 min-w-[180px] cursor-pointer ${
          light ? "border-2 border-white" : "border border-neutral-600"
        }`}
      >
        <span className="leading-tight">
          {lines.map((l, i) => (
            <span key={i} className={`block text-[15px] ${i === 0 && lines.length > 1 ? "font-bold text-white" : "text-neutral-200"}`}>
              {l}
            </span>
          ))}
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-300 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-lg bg-[#2e2e2e] shadow-2xl border border-neutral-700 py-2 fd-fade-up">
            <div className="w-3 h-3 bg-[#2e2e2e] border-l border-t border-neutral-700 rotate-45 absolute -top-1.5 right-8" />
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-5 py-3 text-[16px] hover:bg-neutral-700/50 cursor-pointer ${
                  o.value === value ? "font-bold text-white" : "text-neutral-300"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bouton flottant jaune +                                            */
/* ------------------------------------------------------------------ */
export function Fab({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label || "Créer"}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-[#ffc500] text-black flex items-center justify-center shadow-[0_8px_30px_rgba(255,197,0,0.35)] hover:bg-[#ffd54a] hover:scale-105 transition-all cursor-pointer"
    >
      <Plus className="w-8 h-8" strokeWidth={2.5} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* État vide "Cartes interactives"                                    */
/* ------------------------------------------------------------------ */
export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg bg-[#202022] px-6 py-12 flex flex-col items-center text-center">
      <svg viewBox="0 0 200 140" className="w-44 h-32 mb-6" aria-hidden="true">
        <rect x="55" y="20" width="95" height="90" rx="10" fill="#7fd4d4" />
        <rect x="55" y="20" width="95" height="22" rx="10" fill="#9fe0e0" />
        <circle cx="70" cy="31" r="6" fill="#f4ead5" />
        <rect x="84" y="27" width="50" height="4" rx="2" fill="#f4ead5" />
        <rect x="84" y="35" width="34" height="3" rx="1.5" fill="#f4ead5" opacity="0.8" />
        <circle cx="92" cy="55" r="2.5" fill="#f4ead5" />
        <circle cx="102" cy="55" r="2.5" fill="#f4ead5" />
        <circle cx="112" cy="55" r="2.5" fill="#f4ead5" />
        <rect x="30" y="62" width="70" height="42" rx="4" fill="#8a8a8a" />
        <circle cx="45" cy="72" r="2.5" fill="#5c0044" />
        <circle cx="55" cy="72" r="2.5" fill="#5c0044" />
        <circle cx="45" cy="82" r="2.5" fill="#5c0044" />
        <circle cx="55" cy="82" r="2.5" fill="#5c0044" />
        <circle cx="78" cy="82" r="7" fill="#f4ead5" />
        <path d="M68 96 q10 -8 20 0" stroke="#f4ead5" strokeWidth="3" fill="none" />
        <polygon points="120,92 134,92 127,80" fill="#8a8a8a" />
        <path d="M118 98 l14 14 M132 98 l-14 14" stroke="#5c0044" strokeWidth="6" strokeLinecap="round" />
        <rect x="140" y="100" width="34" height="5" rx="2.5" fill="#5c0044" />
        <rect x="140" y="110" width="24" height="5" rx="2.5" fill="#5c0044" />
        <circle cx="160" cy="124" r="5" fill="#7fd4d4" />
        <polygon points="42,48 52,48 47,38" fill="#8a8a8a" />
      </svg>
      <p className="text-2xl font-bold text-neutral-300">{title}</p>
      <p className="text-[16px] text-neutral-400 mt-3">{subtitle}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pastille projet ronde                                              */
/* ------------------------------------------------------------------ */
export function WorldCircle({ world, onClick }: { world: World; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
      <span
        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg ring-1 ring-white/10 group-hover:ring-[#ffc500]/60 transition-all overflow-hidden"
        style={{ backgroundColor: world.themeColor || "#2a2a2c" }}
      >
        {world.bannerUrl ? (
          <img src={world.bannerUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span>{world.iconEmoji || "📚"}</span>
        )}
      </span>
      <span className="text-[17px] text-neutral-100 max-w-[96px] truncate">{world.name}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Carte du carrousel "Re-plongez-vous"                               */
/* ------------------------------------------------------------------ */
export function ArticleCard({
  article,
  world,
  onOpen,
}: {
  article: Article;
  world?: World;
  onOpen: () => void;
}) {
  const cover = article.infobox?.image;
  return (
    <div className="w-72 shrink-0 snap-start rounded-2xl bg-[#1c1c1e] p-3 fd-fade-up">
      <button type="button" onClick={onOpen} className="block w-full text-left cursor-pointer">
        <div className="h-72 rounded-xl overflow-hidden bg-[#2a2a2c]">
          {cover ? (
            <img src={cover} alt="" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-5xl"
              style={{ backgroundColor: (world?.themeColor || "#2a2a2c") + "55" }}
            >
              {world?.iconEmoji || "📄"}
            </div>
          )}
        </div>
        <h3 className="text-[22px] font-extrabold text-white mt-3 truncate">{article.title}</h3>
      </button>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
            style={{ backgroundColor: (world?.themeColor || "#333") + "44" }}
          >
            {world?.iconEmoji || "📚"}
          </span>
          <span className="text-[16px] text-neutral-400 truncate">{world?.name || article.worldSlug}</span>
        </div>
        <span className="w-11 h-11 rounded-full bg-[#2e2e2e] flex items-center justify-center text-neutral-300 shrink-0">
          <MoreVertical className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ligne d'article (listes)                                           */
/* ------------------------------------------------------------------ */
export function ArticleRow({ article, world, onOpen }: { article: Article; world?: World; onOpen: () => void }) {
  const cover = article.infobox?.image;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1c1c1e] hover:bg-[#242426] transition-colors text-left cursor-pointer"
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#2a2a2c] shrink-0 flex items-center justify-center text-2xl">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <span>{world?.iconEmoji || "📄"}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-bold text-white truncate">{article.title}</p>
        <p className="text-[13px] text-neutral-400 truncate">
          {article.excerpt || article.category}
        </p>
      </div>
      <span className="text-[11px] uppercase tracking-wide font-bold text-[#ffc500] bg-[#ffc500]/10 border border-[#ffc500]/30 rounded-full px-2.5 py-1 shrink-0">
        {article.category}
      </span>
    </button>
  );
}
