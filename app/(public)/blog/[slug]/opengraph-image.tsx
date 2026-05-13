import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Bài viết";
  const summary = post?.summary ?? "";
  const date = post
    ? new Date(post.date).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
        }}
      >
        {/* Tag */}
        <div style={{ display: "flex" }}>
          <div style={{
            background: "#3b82f6",
            color: "#fff",
            fontSize: 24,
            padding: "8px 20px",
            borderRadius: 8,
          }}>
            Blog
          </div>
        </div>

        {/* Title + summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.2,
            maxWidth: 900,
          }}>
            {title}
          </div>
          {summary && (
            <div style={{ fontSize: 28, color: "#94a3b8", maxWidth: 800 }}>
              {summary.length > 100 ? summary.slice(0, 100) + "..." : summary}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, color: "#64748b" }}>Thanhtd&apos;s Blog</div>
          {date && <div style={{ fontSize: 24, color: "#64748b" }}>{date}</div>}
        </div>
      </div>
    ),
    size
  );
}
