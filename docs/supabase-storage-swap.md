# Swap Upload ảnh sang Supabase Storage

Khi deploy lên Vercel, filesystem không persistent — ảnh upload local sẽ mất sau mỗi deploy.
Cần swap sang Supabase Storage.

## Bước 1 — Tạo bucket trên Supabase

1. Vào Supabase Dashboard → **Storage → New bucket**
2. Bucket name: `products`
3. Bật **Public bucket** → Save

## Bước 2 — Thêm Supabase keys vào `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Bước 3 — Sửa API route upload

Thay toàn bộ nội dung `app/api/upload/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: "Chỉ hỗ trợ JPG, PNG, WebP" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const optimized = await sharp(buffer)
    .resize(800, 800, { fit: "cover", position: "centre" })
    .webp({ quality: 85 })
    .toBuffer();

  const filename = `${Date.now()}.webp`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filename, optimized, { contentType: "image/webp", upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from("products")
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
```

## Bước 4 — Thêm domain Supabase vào next.config.ts

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};
```

## Bước 5 — Deploy lại

```bash
git add .
git commit -m "swap upload to supabase storage"
git push
```

Vercel tự deploy lại. Upload ảnh mới sẽ lưu trên Supabase Storage.
