import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
    // Use the Jekyll-style `permalink` front matter as the post's URL slug.
    generateId: ({ entry, data }) =>
      typeof data.permalink === 'string'
        ? data.permalink.replace(/^\/|\/$/g, '')
        : entry.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    last_modified_at: z.coerce.date().optional(),
    permalink: z.string().optional(),
    // Path relative to src/assets/images, e.g. "2023/hammondfamilyhistory.jpg"
    image: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
    featured: z.boolean().default(false),
    comments: z.boolean().default(true),
    rating: z.number().optional(),
    toc: z.boolean().default(false),
    beforetoc: z.string().optional(),
    keywords: z.string().optional(),
  }),
});

export const collections = { posts };
