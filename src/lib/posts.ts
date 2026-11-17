import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type Post = CollectionEntry<'posts'>;

/** All posts, newest first (same order as Jekyll's site.posts). */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postUrl = (post: Post) => `/${post.id}`;

/** Jekyll's `slugify` filter (default mode). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._~!$&'()+,;=@]+/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const categoryUrl = (category: string) => `/category/${slugify(category)}/`;

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Map of category name -> posts (newest first), sorted by category name. */
export async function getCategories(): Promise<[string, Post[]][]> {
  const map = new Map<string, Post[]>();
  for (const post of await getPosts()) {
    for (const cat of post.data.categories) {
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(post);
    }
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/** Rough markdown -> plain text, used for excerpts and the search index. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Jekyll-style excerpt: first paragraph, truncated to N words. */
export function excerpt(post: Post, words = 30): string {
  const first = (post.body ?? '').split(/\n\s*\n/).find((p) => p.trim()) ?? '';
  const parts = stripMarkdown(first).split(' ').filter(Boolean);
  return parts.length > words ? parts.slice(0, words).join(' ') + '...' : parts.join(' ');
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,gif,webp,avif,JPG,PNG}',
  { eager: true },
);

/** Resolve a front-matter image name (relative to src/assets/images) to an imported image. */
export function resolveImage(name?: string): ImageMetadata | undefined {
  if (!name) return undefined;
  const mod = images[`/src/assets/images/${name.replace(/^\/+/, '')}`];
  if (!mod) throw new Error(`Image not found in src/assets/images: ${name}`);
  return mod.default;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Jekyll `date_to_string`: "13 Mar 2023" (UTC). */
export const dateToString = (d: Date) =>
  `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

/** Jekyll `date: "%b %-d, %Y %H:%M"` (UTC). */
export const dateLong = (d: Date) =>
  `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} ` +
  `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
