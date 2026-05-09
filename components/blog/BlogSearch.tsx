"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { BlogCard } from "./BlogCard";
import { Search } from "lucide-react";

interface Post {
  title: string;
  summary: string;
  date: string;
  slug: string;
  tags: string[];
  readingTime: number;
}

export function BlogSearch({ posts, allTags }: { posts: Post[]; allTags: string[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchTag = activeTag === "all" || post.tags.includes(activeTag);
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchTag && matchQuery;
    });
  }, [posts, query, activeTag]);

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Tìm bài viết..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Tag filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTag("all")}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            activeTag === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "hover:bg-muted"
          }`}
        >
          Tất cả
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeTag === tag
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">Không tìm thấy bài viết nào.</p>
      ) : (
        <div className="space-y-4">
          {query || activeTag !== "all" ? (
            <p className="text-sm text-muted-foreground">{filtered.length} bài viết</p>
          ) : null}
          {filtered.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              summary={post.summary}
              date={post.date}
              slug={post.slug}
              tags={post.tags}
              readingTime={post.readingTime}
            />
          ))}
        </div>
      )}
    </div>
  );
}
