"use client";

import React, { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import {
  HardDrive,
  Download,
  Upload,
  FolderOpen,
  Folder,
  FileText,
  Smartphone,
  CheckCircle2,
  CloudOff,
  Cloud,
  ChevronDown,
  ChevronRight,
  Code2,
} from "lucide-react";
import type { World, Article } from "@/lib/types";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Couche « Google Drive » : stockage local, état hors-ligne, installation PWA,
 * sauvegarde/restauration complète (ZIP vault Obsidian + JSON), arborescence.
 */
export function FilesView({
  worlds,
  articles,
  onOpenArticle,
  onChanged,
}: {
  worlds: World[];
  articles: Article[];
  onOpenArticle: (slug: string, world: string) => void;
  onChanged: () => void;
}) {
  const [online, setOnline] = useState(true);
  const [usage, setUsage] = useState<number | null>(null);
  const [quota, setQuota] = useState<number | null>(null);
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState<null | "export" | "import">(null);
  const [message, setMessage] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then((e) => {
        setUsage(e.usage || 0);
        setQuota(e.quota || 0);
      });
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const mo = (n: number | null) => (n == null ? "—" : (n / 1024 / 1024).toFixed(1));

  const handleInstall = async () => {
    if (!installEvt) return;
    await installEvt.prompt();
    const choice = await installEvt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallEvt(null);
  };

  const handleExport = async () => {
    setBusy("export");
    setMessage(null);
    try {
      const res = await fetch("/api/backup");
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const dump = data.dump;

      const zip = new JSZip();
      zip.file(
        "manifest.json",
        JSON.stringify(
          { app: "Wiki PWA", exportedAt: new Date().toISOString(), worlds: dump.worlds.map((w: World) => w.slug) },
          null,
          2
        )
      );
      for (const w of dump.worlds) {
        const folder = zip.folder(w.slug);
        if (!folder) continue;
        for (const a of dump.articles.filter((x: Article) => x.worldSlug === w.slug)) {
          const fm = [
            "---",
            `title: "${a.title}"`,
            `category: "${a.category}"`,
            `world: "${w.slug}"`,
            `tags: [${(a.tags || []).map((t: string) => `"${t}"`).join(", ")}]`,
            `pinned: ${!!a.isFeatured}`,
            `created: ${a.createdAt || ""}`,
            `updated: ${a.updatedAt || ""}`,
            "---",
            "",
            "",
          ].join("\n");
          folder.file(`${a.slug}.md`, fm + a.markdownContent);
        }
      }
      zip.folder("_backup")?.file("full-backup.json", JSON.stringify(dump, null, 2));

      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `wiki-sauvegarde-${new Date().toISOString().slice(0, 10)}.zip`);
      setMessage("Sauvegarde exportée (.zip vault Obsidian + JSON complet).");
    } catch (e: any) {
      setMessage("Échec de l'export : " + e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleImportFile = async (file: File) => {
    setBusy("import");
    setMessage(null);
    try {
      let text: string;
      if (file.name.toLowerCase().endsWith(".zip")) {
        const zip = await JSZip.loadAsync(await file.arrayBuffer());
        const entry = zip.file("_backup/full-backup.json");
        if (!entry) throw new Error("ZIP sans _backup/full-backup.json");
        text = await entry.async("text");
      } else {
        text = await file.text();
      }
      const dump = JSON.parse(text);
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dump }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMessage(
        `Restauration terminée : ${data.counts.worlds} projets, ${data.counts.articles} pages, ${data.counts.markers} épingles.`
      );
      onChanged();
    } catch (e: any) {
      setMessage("Échec de l'import : " + e.message);
    } finally {
      setBusy(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 pb-28 fd-fade-up max-w-3xl">
      <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
        <HardDrive className="w-7 h-7 text-[#ffc500]" /> Fichiers & sauvegarde
      </h1>
      <p className="text-[15px] text-neutral-400 mt-2">
        Couche stockage de l'app : vault local, mode hors-ligne, installation et sauvegardes.
      </p>

      {message && (
        <div className="mt-4 p-3 rounded-lg bg-[#ffc500]/10 border border-[#ffc500]/40 text-[14px] text-[#ffd54a]">
          {message}
        </div>
      )}

      {/* État du stockage / réseau / installation */}
      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        <StatusCard
          icon={online ? <Cloud className="w-5 h-5 text-emerald-400" /> : <CloudOff className="w-5 h-5 text-[#ffc500]" />}
          title={online ? "En ligne" : "Hors-ligne"}
          sub={online ? "Écriture vers la base active" : "Lecture depuis le cache (SW)"}
        />
        <StatusCard
          icon={<HardDrive className="w-5 h-5 text-[#ffc500]" />}
          title={`${mo(usage)} Mo utilisés`}
          sub={`sur ~${mo(quota)} Mo disponibles`}
        />
        <StatusCard
          icon={
            installed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Smartphone className="w-5 h-5 text-[#ffc500]" />
            )
          }
          title={installed ? "App installée" : installEvt ? "Installable" : "PWA prête"}
          sub={installed ? "Lancée depuis l'écran d'accueil" : "Chrome/Android : menu → Installer"}
          action={
            installEvt && !installed ? (
              <button
                type="button"
                onClick={handleInstall}
                className="mt-2 px-3 py-1.5 rounded-lg bg-[#ffc500] text-black text-[12px] font-bold cursor-pointer"
              >
                Installer l'app
              </button>
            ) : undefined
          }
        />
      </div>

      {/* Sauvegarde / restauration */}
      <section className="mt-8 rounded-xl bg-[#1c1c1e] border border-neutral-800 p-5">
        <h2 className="text-lg font-extrabold text-white">Sauvegarde du vault</h2>
        <p className="text-[14px] text-neutral-400 mt-1">
          Le <strong className="text-neutral-200">.zip</strong> contient un dossier par projet avec des fichiers{" "}
          <code className="text-[#ffc500]">.md</code> (YAML frontmatter) ouvrables directement dans Obsidian, plus{" "}
          <code className="text-[#ffc500]">_backup/full-backup.json</code> pour la restauration complète.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            type="button"
            onClick={handleExport}
            disabled={!!busy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ffc500] text-black font-bold text-sm hover:bg-[#ffd54a] disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" /> {busy === "export" ? "Export…" : "Exporter la sauvegarde (.zip)"}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={!!busy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-600 text-neutral-200 font-bold text-sm hover:border-[#ffc500] hover:text-[#ffc500] disabled:opacity-50 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> {busy === "import" ? "Import…" : "Restaurer (.zip / .json)"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".zip,.json,application/zip,application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImportFile(e.target.files[0])}
          />
        </div>
        <div className="mt-3 rounded-lg bg-neutral-800/50 border border-neutral-700 p-3">
          <p className="text-[13px] text-neutral-300 mb-2">
            Pour déployer ailleurs (Vercel…) : récupère tout le code source du projet en un seul fichier.
          </p>
          <a
            href="/wiki-source.zip"
            download="wiki-source.zip"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ffc500] text-[#ffc500] font-bold text-[13px] hover:bg-[#ffc500]/10 cursor-pointer"
          >
            <Code2 className="w-4 h-4" /> Télécharger le code source (.zip)
          </a>
        </div>
      </section>

      {/* Arborescence du vault */}
      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-white mb-3">Arborescence ({articles.length} fichiers)</h2>
        <div className="rounded-xl bg-[#1c1c1e] border border-neutral-800 divide-y divide-neutral-800/70 overflow-hidden">
          {worlds.map((w) => {
            const files = articles.filter((a) => a.worldSlug === w.slug);
            const open = !!openFolders[w.slug];
            return (
              <div key={w.slug}>
                <button
                  type="button"
                  onClick={() => setOpenFolders((p) => ({ ...p, [w.slug]: !open }))}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#242426] cursor-pointer text-left"
                >
                  {open ? (
                    <FolderOpen className="w-5 h-5 text-[#ffc500] shrink-0" />
                  ) : (
                    <Folder className="w-5 h-5 text-[#ffc500] shrink-0" />
                  )}
                  <span className="flex-1 text-[15px] font-bold text-white truncate">{w.slug}/</span>
                  <span className="text-[12px] text-neutral-500">{files.length} pages</span>
                  {open ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
                </button>
                {open && (
                  <div className="bg-[#161618]">
                    {files.map((a) => (
                      <button
                        key={a.slug}
                        type="button"
                        onClick={() => onOpenArticle(a.slug, a.worldSlug)}
                        className="w-full flex items-center gap-3 pl-11 pr-4 py-2.5 hover:bg-[#202022] cursor-pointer text-left"
                      >
                        <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span className="flex-1 text-[14px] text-neutral-200 truncate">{a.slug}.md</span>
                        <span className="text-[11px] text-neutral-500 shrink-0">{(a.markdownContent.length / 1024).toFixed(1)} Ko</span>
                      </button>
                    ))}
                    {files.length === 0 && (
                      <p className="pl-11 pr-4 py-2.5 text-[13px] text-neutral-500">Dossier vide.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[13px] text-neutral-500 mt-3">
          Astuce vanilla : ce vault est un simple dossier de fichiers texte — tu peux le versionner sur GitHub tel
          quel (dépôt racine du projet, dossiers <code className="text-neutral-300">public/</code> et{" "}
          <code className="text-neutral-300">src/</code>) et le déployer sur Vercel qui détecte Next.js
          automatiquement.
        </p>
      </section>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  sub,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[#1c1c1e] border border-neutral-800 p-4">
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-[15px] font-bold text-white">{title}</span>
      </div>
      <p className="text-[12px] text-neutral-400 mt-1.5">{sub}</p>
      {action}
    </div>
  );
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
