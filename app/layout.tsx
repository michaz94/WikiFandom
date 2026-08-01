import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PwaClient } from "@/components/fandom/PwaClient";

export const metadata: Metadata = {
  title: "Wiki — Fandom × Obsidian × World Anvil",
  description:
    "Wiki personnel local-first : page d'accueil, projets, catégories, articles, wikitext, sauvegarde et mode hors-ligne (PWA installable).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0d0d0d" />
        <link rel="icon" href="/icon-512.png" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#0d0d0d] text-neutral-100 antialiased">
        <PwaClient />
        {children}
      </body>
    </html>
  );
}
