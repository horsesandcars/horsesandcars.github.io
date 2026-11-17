import { getPosts, postUrl, stripMarkdown, dateLabel } from '../lib/posts';

// Search index for the header search dialog.
interface MdPage {
  frontmatter: { title: string };
  rawContent: () => string;
}

const pages = import.meta.glob<MdPage>('./*.md', { eager: true });

export async function GET() {
  const posts = (await getPosts()).map((post) => ({
    url: postUrl(post),
    title: post.data.title,
    kicker: [post.data.categories[0], dateLabel(post.data.date)].filter(Boolean).join(' · '),
    body: stripMarkdown(post.body ?? ''),
  }));

  const other = Object.entries(pages).map(([file, mod]) => ({
    url: `/${file.replace(/^.*\//, '').replace(/\.md$/, '')}`,
    title: mod.frontmatter.title,
    kicker: 'Page',
    body: stripMarkdown(mod.rawContent()),
  }));

  return new Response(JSON.stringify([...posts, ...other]), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
