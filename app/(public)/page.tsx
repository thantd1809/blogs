import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { BlogCard } from "@/components/blog/BlogCard";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 space-y-4">
        <h1 className="text-4xl font-bold">Xin chào! 👋</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Tôi chia sẻ về công nghệ, lập trình và cũng kinh doanh yến sào chất lượng cao.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/blog" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90">
            Đọc Blog
          </Link>
          <Link href="/shop" className="border px-6 py-2 rounded-md hover:bg-muted">
            Xem Shop
          </Link>
        </div>
      </section>

      {/* Recent posts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Bài viết mới nhất</h2>
          <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <p className="text-muted-foreground">Chưa có bài viết nào.</p>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
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
      </section>

      {/* Shop section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Sản phẩm yến sào</h2>
          <Link href="/shop" className="text-sm text-muted-foreground hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <p className="text-muted-foreground">Chưa có sản phẩm nào.</p>
      </section>
    </div>
  );
}
