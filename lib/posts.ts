import { posts } from "@/.velite";

export function getAllPosts() {
  return posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug && p.published);
}

export function getAllTags() {
  const tagCount: Record<string, number> = {};
  posts
    .filter((p) => p.published)
    .forEach((p) => p.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1;
    }));
  return tagCount;
}
