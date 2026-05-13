import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 80,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#f8fafc", textAlign: "center", lineHeight: 1.2 }}>
          Thanhtd&apos;s Blog
        </div>
        <div style={{ fontSize: 32, color: "#94a3b8", textAlign: "center" }}>
          Công nghệ · Lập trình · Yến sào chất lượng
        </div>
      </div>
    ),
    size
  );
}
