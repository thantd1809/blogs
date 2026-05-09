import Link from "next/link";

interface BlogCardProps {
  title: string;
  summary: string;
  date: string;
  slug: string;
  tags: string[];
  readingTime: number;
}

export function BlogCard({ title, summary, date, slug, tags, readingTime }: BlogCardProps) {
  const formatted = new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="border rounded-lg p-6 hover:bg-muted/50 transition-colors space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <time>{formatted}</time>
        <span>·</span>
        <span>{readingTime} phút đọc</span>
      </div>
      <Link href={`/blog/${slug}`}>
        <h2 className="text-xl font-semibold hover:underline">{title}</h2>
      </Link>
      <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
