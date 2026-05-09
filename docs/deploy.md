# Deploy lên Vercel + Supabase

## Tổng quan

```
Code  →  GitHub  →  Vercel (auto deploy)
                       ↓
                  Supabase (PostgreSQL + Storage)
```

---

## Bước 1 — Tạo Supabase project

1. Vào [supabase.com](https://supabase.com) → **New project**
2. Chọn region gần nhất (Singapore)
3. Đặt mật khẩu DB mạnh → lưu lại
4. Chờ project khởi động (~2 phút)

### Lấy thông tin kết nối

Vào **Project Settings → Database → Connection string → URI**:

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Copy URI này → điền vào `DATABASE_URL`.

### Lấy Supabase Storage keys

Vào **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Tạo Storage bucket cho ảnh

Vào **Storage → New bucket**:
- Name: `products`
- Public: ✅ (bật public)

---

## Bước 2 — Tạo Clerk app

1. Vào [clerk.com](https://clerk.com) → **Create application**
2. Tên app: `blogs` — chọn sign-in bằng Email
3. Vào **API Keys** → copy:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

4. Vào **Users** → tạo user admin (email của bạn)

---

## Bước 3 — Tạo Resend account

1. Vào [resend.com](https://resend.com) → **Create API Key**
2. Copy key:

```
RESEND_API_KEY=re_...
```

3. Vào **Domains** → thêm domain của bạn → verify DNS
4. Sau khi verify:

```
RESEND_FROM=no-reply@yourdomain.com
```

> Khi chưa có domain, dùng `onboarding@resend.dev` — chỉ gửi được đến email của bạn.

---

## Bước 4 — Lấy Anthropic API key

1. Vào [console.anthropic.com](https://console.anthropic.com) → **API Keys → Create Key**
2. Copy key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Bước 5 — Push code lên GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blogs.git
git push -u origin main
```

> Đảm bảo `.env.local` có trong `.gitignore` (đã có sẵn).

---

## Bước 6 — Deploy lên Vercel

1. Vào [vercel.com](https://vercel.com) → **Add New Project**
2. Import repo GitHub vừa push
3. Framework: **Next.js** (tự detect)
4. Vào **Environment Variables** → thêm tất cả:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
RESEND_FROM=no-reply@yourdomain.com
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://[REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

5. Bấm **Deploy** → chờ build (~3 phút)

---

## Bước 7 — Chạy migration trên Supabase

Sau khi deploy xong, chạy migration từ local với `DATABASE_URL` của Supabase:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" npm run db:migrate
```

Hoặc dùng Supabase SQL Editor — paste nội dung file `db/migrations/0000_*.sql`.

---

## Bước 8 — Swap upload ảnh sang Supabase Storage

Hiện tại ảnh lưu local `public/uploads/`. Trên Vercel filesystem không persistent — cần swap sang Supabase Storage.

Sửa `app/api/upload/route.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Thay writeFile bằng:
const { data, error } = await supabase.storage
  .from("products")
  .upload(filename, optimized, { contentType: "image/webp", upsert: true });

const { data: { publicUrl } } = supabase.storage
  .from("products")
  .getPublicUrl(filename);

return NextResponse.json({ url: publicUrl });
```

Và thêm domain Supabase vào `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "*.supabase.co" },
  ],
},
```

---

## Sau khi deploy

| Việc cần làm | Ghi chú |
|---|---|
| Test chatbot | Nhắn tin trên trang chủ |
| Test đặt hàng | Thêm sản phẩm vào giỏ → đặt hàng |
| Kiểm tra email | Đặt hàng với email thật |
| Thêm domain | Vercel → Settings → Domains |
| Kiểm tra sitemap | `yourdomain.com/sitemap.xml` |
| Submit Google Search Console | Paste URL sitemap |

---

## Tự động deploy

Mỗi lần `git push origin main` → Vercel tự build và deploy lại.

Viết bài mới → push lên GitHub → Vercel rebuild → bài xuất hiện trên web.
