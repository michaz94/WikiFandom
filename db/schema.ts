import { pgTable, text, serial, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";

export const worlds = pgTable("worlds", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  themeColor: text("theme_color").default("#3b82f6"),
  bannerUrl: text("banner_url"),
  icon: text("icon").default("Sparkles"),
  iconEmoji: text("icon_emoji").default("📚"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  worldSlug: text("world_slug").notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'character' | 'location' | 'faction' | 'artifact' | 'event' | 'concept'
  infobox: jsonb("infobox").$type<{
    subtitle?: string;
    image?: string;
    caption?: string;
    quote?: string;
    sections?: {
      title: string;
      fields: { label: string; value: string; isLink?: boolean; linkSlug?: string }[];
    }[];
    stats?: { label: string; value: number; max?: number; color?: string }[];
    badges?: string[];
  }>(),
  markdownContent: text("markdown_content").notNull(),
  excerpt: text("excerpt"),
  tags: jsonb("tags").$type<string[]>(),
  isFeatured: boolean("is_featured").default(false),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const articleLinks = pgTable("article_links", {
  id: serial("id").primaryKey(),
  worldSlug: text("world_slug").notNull(),
  sourceSlug: text("source_slug").notNull(),
  targetSlug: text("target_slug").notNull(),
});

export const mapMarkers = pgTable("map_markers", {
  id: serial("id").primaryKey(),
  worldSlug: text("world_slug").notNull(),
  title: text("title").notNull(),
  type: text("type").default("city"), // city, ruin, dungeon, landmark, fortress
  x: integer("x").notNull(), // 0 - 100%
  y: integer("y").notNull(), // 0 - 100%
  articleSlug: text("article_slug"),
  description: text("description"),
});

export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  worldSlug: text("world_slug").notNull(),
  year: text("year").notNull(),
  era: text("era").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  articleSlug: text("article_slug"),
  orderIndex: integer("order_index").default(0),
});

export const promptTemplates = pgTable("prompt_templates", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  framework: text("framework").notNull(), // React Native Expo, Flutter, Swift, etc.
  description: text("description").notNull(),
  prompt: text("prompt").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
