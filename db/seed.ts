import { db } from "./index";
import { worlds, articles, articleLinks, mapMarkers, timelineEvents, promptTemplates } from "./schema";
import { SEED_WORLDS, SEED_ARTICLES, SEED_MAP_MARKERS, SEED_TIMELINES, SEED_PROMPTS } from "./seed-data";
import { count, sql } from "drizzle-orm";

/**
 * Bootstrap zéro-terminal : crée les tables si elles n'existent pas.
 * Permet un déploiement Vercel + Neon sans jamais lancer drizzle-kit push.
 */
export async function ensureSchema() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS worlds (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      theme_color TEXT DEFAULT '#3b82f6',
      banner_url TEXT,
      icon TEXT DEFAULT 'Sparkles',
      icon_emoji TEXT DEFAULT '📚',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      world_slug TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      infobox JSONB,
      markdown_content TEXT NOT NULL,
      excerpt TEXT,
      tags JSONB,
      is_featured BOOLEAN DEFAULT false,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS article_links (
      id SERIAL PRIMARY KEY,
      world_slug TEXT NOT NULL,
      source_slug TEXT NOT NULL,
      target_slug TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS map_markers (
      id SERIAL PRIMARY KEY,
      world_slug TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT DEFAULT 'city',
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      article_slug TEXT,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS timeline_events (
      id SERIAL PRIMARY KEY,
      world_slug TEXT NOT NULL,
      year TEXT NOT NULL,
      era TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      article_slug TEXT,
      order_index INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS prompt_templates (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      framework TEXT NOT NULL,
      description TEXT NOT NULL,
      prompt TEXT NOT NULL,
      tags JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
}

export async function ensureDatabaseSeeded() {
  try {
    await ensureSchema();
    const worldCount = await db.select({ value: count() }).from(worlds);
    if (Number(worldCount[0]?.value || 0) > 0) {
      return;
    }

    console.log("Seeding database with rich Wiki/Obsidian/WorldAnvil data...");

    // Insert Worlds
    for (const w of SEED_WORLDS) {
      await db.insert(worlds).values(w).onConflictDoNothing();
    }

    // Insert Articles
    for (const art of SEED_ARTICLES) {
      await db.insert(articles).values({
        worldSlug: art.worldSlug,
        slug: art.slug,
        title: art.title,
        category: art.category,
        infobox: art.infobox,
        markdownContent: art.markdownContent,
        excerpt: art.excerpt,
        tags: art.tags,
        isFeatured: art.isFeatured,
        views: art.views,
      }).onConflictDoNothing();

      // Extract wikilinks from content [[slug]]
      const matches = art.markdownContent.matchAll(/\[\[([a-zA-Z0-9_-]+)(?:\|.*?)?\]\]/g);
      for (const m of matches) {
        const targetSlug = m[1].toLowerCase();
        await db.insert(articleLinks).values({
          worldSlug: art.worldSlug,
          sourceSlug: art.slug,
          targetSlug: targetSlug,
        }).onConflictDoNothing();
      }
    }

    // Insert Map Markers
    for (const marker of SEED_MAP_MARKERS) {
      await db.insert(mapMarkers).values(marker).onConflictDoNothing();
    }

    // Insert Timelines
    for (const t of SEED_TIMELINES) {
      await db.insert(timelineEvents).values(t).onConflictDoNothing();
    }

    // Insert Prompts
    for (const p of SEED_PROMPTS) {
      await db.insert(promptTemplates).values(p).onConflictDoNothing();
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error in ensureDatabaseSeeded:", err);
  }
}
