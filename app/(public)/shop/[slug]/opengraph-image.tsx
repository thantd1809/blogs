import { ImageResponse } from "next/og";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug));

  const name = product?.name ?? "Sản phẩm";
  const price = product ? `${Number(product.price).toLocaleString("vi-VN")}đ` : "";
  const description = product?.description ?? "";

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
            background: "#f59e0b",
            color: "#fff",
            fontSize: 24,
            padding: "8px 20px",
            borderRadius: 8,
          }}>
            Yến Sào
          </div>
        </div>

        {/* Name + price */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 60, fontWeight: 700, color: "#f8fafc", lineHeight: 1.2 }}>
            {name}
          </div>
          {description && (
            <div style={{ fontSize: 26, color: "#94a3b8", maxWidth: 800 }}>
              {description.length > 100 ? description.slice(0, 100) + "..." : description}
            </div>
          )}
          {price && (
            <div style={{ fontSize: 40, fontWeight: 700, color: "#f59e0b" }}>
              {price}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ fontSize: 24, color: "#64748b" }}>Blog & Yến Sào · Giao hàng toàn quốc</div>
      </div>
    ),
    size
  );
}
