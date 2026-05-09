import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXContent } from "@/components/blog/MDXContent";
import { GiscusComments } from "@/components/blog/GiscusComments";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const formatted = new Date(post.date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
          ← Quay lại Blog
        </Link>
        <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <time>{formatted}</time>
          <span>·</span>
          <span>{post.readingTime} phút đọc</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <MDXContent code={post.body} />

      {/* Comments */}
      <GiscusComments />
    </article>
  );
}
