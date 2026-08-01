import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { worlds, articles, articleLinks, mapMarkers, timelineEvents } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/seed";
import { eq, and, or, ilike, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Route API unique (catch-all) : remplace 9 dossiers de routes par un seul.
 * /api/health · /api/worlds · /api/articles · /api/articles/:slug · /api/map · /api/backup
 */
async function handler(request: NextRequest, segments: string[]) {
  const [head, second] = segments;

  try {
    if (head === "health") {
      await db.execute(sql`select 1`);
      return NextResponse.json({ ok: true });
    }

    if (head === "worlds") {
      await ensureDatabaseSeeded();
      if (request.method === "GET") {
        const data = await db.select().from(worlds);
        return NextResponse.json({ success: true, worlds: data });
      }
      const body = await request.json();
      const created = await db
        .insert(worlds)
        .values({
          slug: body.slug,
          name: body.name,
          tagline: body.tagline,
          description: body.description,
          themeColor: body.themeColor || "#6366f1",
          bannerUrl: body.bannerUrl,
          icon: body.icon || "Globe",
          iconEmoji: body.iconEmoji || "📚",
        })
        .returning();
      return NextResponse.json({ success: true, world: created[0] });
    }

    if (head === "articles" && !second) {
      await ensureDatabaseSeeded();
      if (request.method === "GET") {
        const { searchParams } = new URL(request.url);
        const worldSlug = searchParams.get("world");
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        const conditions: any[] = [];
        if (worldSlug) conditions.push(eq(articles.worldSlug, worldSlug));
        if (category && category !== "all") conditions.push(eq(articles.category, category));
        if (search && search.trim() !== "") {
          const q = `%${search.trim()}%`;
          conditions.push(or(ilike(articles.title, q), ilike(articles.markdownContent, q), ilike(articles.excerpt, q))!);
        }

        const data = conditions.length
          ? await db.select().from(articles).where(and(...conditions)).orderBy(desc(articles.views))
          : await db.select().from(articles).orderBy(desc(articles.views));
        return NextResponse.json({ success: true, articles: data });
      }

      const body = await request.json();
      const { worldSlug, slug, title, category, infobox, markdownContent, excerpt, tags, isFeatured } = body;
      if (!worldSlug || !slug || !title || !markdownContent) {
        return NextResponse.json({ success: false, error: "Champs requis manquants." }, { status: 400 });
      }

      const existing = await db
        .select()
        .from(articles)
        .where(and(eq(articles.worldSlug, worldSlug), eq(articles.slug, slug)));

      let saved;
      if (existing.length > 0) {
        const updated = await db
          .update(articles)
          .set({
            title,
            category: category || "lore",
            infobox,
            markdownContent,
            excerpt: excerpt || markdownContent.slice(0, 140) + "...",
            tags: tags || [],
            isFeatured: !!isFeatured,
            updatedAt: new Date(),
          })
          .where(eq(articles.id, existing[0].id))
          .returning();
        saved = updated[0];
      } else {
        const created = await db
          .insert(articles)
          .values({
            worldSlug,
            slug,
            title,
            category: category || "lore",
            infobox,
            markdownContent,
            excerpt: excerpt || markdownContent.slice(0, 140) + "...",
            tags: tags || [],
            isFeatured: !!isFeatured,
          })
          .returning();
        saved = created[0];
      }

      await db
        .delete(articleLinks)
        .where(and(eq(articleLinks.worldSlug, worldSlug), eq(articleLinks.sourceSlug, slug)));
      for (const m of markdownContent.matchAll(/\[\[([a-zA-Z0-9_-]+)(?:\|.*?)?\]\]/g)) {
        await db
          .insert(articleLinks)
          .values({ worldSlug, sourceSlug: slug, targetSlug: m[1].toLowerCase() })
          .onConflictDoNothing();
      }
      return NextResponse.json({ success: true, article: saved });
    }

    if (head === "articles" && second) {
      await ensureDatabaseSeeded();
      const slug = decodeURIComponent(second);
      const { searchParams } = new URL(request.url);
      const worldSlug = searchParams.get("world") || "aethelgard";

      if (request.method === "DELETE") {
        await db.delete(articleLinks).where(and(eq(articleLinks.worldSlug, worldSlug), eq(articleLinks.sourceSlug, slug)));
        await db.delete(articleLinks).where(and(eq(articleLinks.worldSlug, worldSlug), eq(articleLinks.targetSlug, slug)));
        await db.delete(articles).where(and(eq(articles.worldSlug, worldSlug), eq(articles.slug, slug)));
        return NextResponse.json({ success: true });
      }

      const list = await db
        .select()
        .from(articles)
        .where(and(eq(articles.worldSlug, worldSlug), eq(articles.slug, slug)));
      if (list.length === 0) {
        return NextResponse.json({ success: false, error: "Article introuvable." }, { status: 404 });
      }
      const article = list[0];
      await db.update(articles).set({ views: sql`${articles.views} + 1` }).where(eq(articles.id, article.id));

      const incoming = await db
        .select({ sourceSlug: articleLinks.sourceSlug })
        .from(articleLinks)
        .where(and(eq(articleLinks.worldSlug, worldSlug), eq(articleLinks.targetSlug, slug)));
      const sources = incoming.map((l) => l.sourceSlug);
      const all = await db
        .select({ slug: articles.slug, title: articles.title, category: articles.category, excerpt: articles.excerpt })
        .from(articles)
        .where(eq(articles.worldSlug, worldSlug));
      const backlinks = all.filter((a) => sources.includes(a.slug));

      const outgoing = await db
        .select({ targetSlug: articleLinks.targetSlug })
        .from(articleLinks)
        .where(and(eq(articleLinks.worldSlug, worldSlug), eq(articleLinks.sourceSlug, slug)));

      return NextResponse.json({
        success: true,
        article,
        backlinks,
        outgoingLinks: outgoing.map((o) => o.targetSlug),
      });
    }

    if (head === "map") {
      await ensureDatabaseSeeded();
      if (request.method === "GET") {
        const { searchParams } = new URL(request.url);
        const worldSlug = searchParams.get("world") || "aethelgard";
        const markers = await db.select().from(mapMarkers).where(eq(mapMarkers.worldSlug, worldSlug));
        return NextResponse.json({ success: true, markers });
      }
      const body = await request.json();
      const created = await db
        .insert(mapMarkers)
        .values({
          worldSlug: body.worldSlug,
          title: body.title,
          type: body.type || "landmark",
          x: Number(body.x),
          y: Number(body.y),
          articleSlug: body.articleSlug,
          description: body.description,
        })
        .returning();
      return NextResponse.json({ success: true, marker: created[0] });
    }

    if (head === "backup") {
      if (request.method === "GET") {
        await ensureDatabaseSeeded();
        const [w, a, l, m, t] = await Promise.all([
          db.select().from(worlds),
          db.select().from(articles),
          db.select().from(articleLinks),
          db.select().from(mapMarkers),
          db.select().from(timelineEvents),
        ]);
        return NextResponse.json({ success: true, dump: { worlds: w, articles: a, links: l, markers: m, timelines: t } });
      }
      const body = await request.json();
      const dump = body.dump || body;
      if (!dump || !Array.isArray(dump.worlds) || !Array.isArray(dump.articles)) {
        return NextResponse.json({ success: false, error: "Format de sauvegarde invalide." }, { status: 400 });
      }
      await db.delete(articleLinks);
      await db.delete(mapMarkers);
      await db.delete(timelineEvents);
      await db.delete(articles);
      await db.delete(worlds);
      for (const w of dump.worlds) {
        await db.insert(worlds).values({
          slug: w.slug, name: w.name, tagline: w.tagline, description: w.description,
          themeColor: w.themeColor, bannerUrl: w.bannerUrl, icon: w.icon, iconEmoji: w.iconEmoji,
        });
      }
      for (const a of dump.articles) {
        await db.insert(articles).values({
          worldSlug: a.worldSlug, slug: a.slug, title: a.title, category: a.category, infobox: a.infobox,
          markdownContent: a.markdownContent, excerpt: a.excerpt, tags: a.tags, isFeatured: a.isFeatured, views: a.views,
        });
      }
      for (const l of dump.links || []) {
        await db.insert(articleLinks).values({ worldSlug: l.worldSlug, sourceSlug: l.sourceSlug, targetSlug: l.targetSlug });
      }
      for (const m of dump.markers || []) {
        await db.insert(mapMarkers).values({
          worldSlug: m.worldSlug, title: m.title, type: m.type, x: m.x, y: m.y,
          articleSlug: m.articleSlug, description: m.description,
        });
      }
      for (const t of dump.timelines || []) {
        await db.insert(timelineEvents).values({
          worldSlug: t.worldSlug, year: t.year, era: t.era, title: t.title,
          description: t.description, articleSlug: t.articleSlug, orderIndex: t.orderIndex,
        });
      }
      return NextResponse.json({
        success: true,
        counts: {
          worlds: dump.worlds.length,
          articles: dump.articles.length,
          markers: (dump.markers || []).length,
          timelines: (dump.timelines || []).length,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Route inconnue." }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return handler(request, path || []);
}
export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return handler(request, path || []);
}
export async function DELETE(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return handler(request, path || []);
}
