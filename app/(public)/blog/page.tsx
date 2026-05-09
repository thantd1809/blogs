import type { Metadata } from "next";
import Link from "next/link";
import { Rss } from "lucide-react";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { BlogSearch } from "@/components/blog/BlogSearch";

export const metadata: Metadata = {
  title: "Blog",
  description: "Bài viết về công nghệ và lập trình.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tagCounts = getAllTags();
  const allTags = Object.keys(tagCounts).sort();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground mt-2">
            {posts.length} bài viết về công nghệ và lập trình.
          </p>
        </div>
        <Link
          href="/feed.xml"
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-orange-500 transition-colors mt-1"
        >
          <Rss className="w-4 h-4" />
          RSS
        </Link>
      </div>
      <BlogSearch posts={posts} allTags={allTags} />
    </div>
  );
}
