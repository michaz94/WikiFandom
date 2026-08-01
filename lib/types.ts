export interface World {
  id: number;
  slug: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  themeColor?: string | null;
  bannerUrl?: string | null;
  icon?: string | null;
  iconEmoji?: string | null;
  createdAt?: string | null;
}

export interface InfoboxField {
  label: string;
  value: string;
  isLink?: boolean;
  linkSlug?: string;
}

export interface InfoboxSection {
  title: string;
  fields: InfoboxField[];
}

export interface InfoboxStat {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export interface Infobox {
  subtitle?: string;
  image?: string | null;
  caption?: string;
  quote?: string;
  badges?: string[];
  sections?: InfoboxSection[];
  stats?: InfoboxStat[];
}

export interface Article {
  id: number;
  worldSlug: string;
  slug: string;
  title: string;
  category: string;
  infobox?: Infobox | null;
  markdownContent: string;
  excerpt?: string | null;
  tags?: string[] | null;
  isFeatured?: boolean | null;
  views?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface MapMarker {
  id: number;
  worldSlug: string;
  title: string;
  type: string;
  x: number;
  y: number;
  articleSlug?: string | null;
  description?: string | null;
}

export type SortKey = "recent" | "old" | "az" | "za";
