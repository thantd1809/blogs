# Biến môi trường

Tất cả biến môi trường cần thiết cho project.

## File `.env.local` (local development)

```env
# ─── Database ────────────────────────────────────
# Local Docker
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blogs
# Production Supabase (thay khi deploy)
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

# ─── Clerk (Auth) ────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
# Mặc định, không cần đổi
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ─── Resend (Email) ───────────────────────────────
RESEND_API_KEY=
RESEND_FROM=onboarding@resend.dev

# ─── Anthropic (Chatbot AI) ───────────────────────
ANTHROPIC_API_KEY=

# ─── Supabase Storage (ảnh) ───────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# ─── Giscus (Blog comments) ──────────────────────
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=

# ─── Site ─────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Bảng tổng hợp

| Biến | Bắt buộc | Lấy ở đâu | Dùng cho |
|---|---|---|---|
| `DATABASE_URL` | ✅ | Supabase / Docker local | Kết nối PostgreSQL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Khi dùng auth | clerk.com | Auth người dùng |
| `CLERK_SECRET_KEY` | Khi dùng auth | clerk.com | Verify session server |
| `RESEND_API_KEY` | Khi cần email | resend.com | Gửi email xác nhận đơn |
| `RESEND_FROM` | Khi cần email | Domain đã verify | Địa chỉ người gửi |
| `ANTHROPIC_API_KEY` | Khi dùng chatbot | console.anthropic.com | Chatbot AI yến sào |
| `NEXT_PUBLIC_SUPABASE_URL` | Khi upload ảnh | Supabase project settings | Supabase Storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Khi upload ảnh | Supabase project settings | Supabase Storage |
| `NEXT_PUBLIC_GISCUS_REPO` | Khi dùng comments | giscus.app | Blog comments |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | Khi dùng comments | giscus.app | Blog comments |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | Khi dùng comments | giscus.app | Blog comments |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | Khi dùng comments | giscus.app | Blog comments |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Tự điền | Sitemap, OG image, RSS |

## Hành vi khi thiếu API key

App không crash — các tính năng bị tắt gracefully:

| Thiếu biến | Hành vi |
|---|---|
| `ANTHROPIC_API_KEY` | Chatbot trả lỗi 500, nút chat vẫn hiện |
| `RESEND_API_KEY` | Đặt hàng thành công, không gửi email |
| `CLERK_*` | Admin không có bảo vệ (local dev OK) |
| `NEXT_PUBLIC_SUPABASE_*` | Upload ảnh lưu local `public/uploads/` |
| `NEXT_PUBLIC_GISCUS_*` | Phần comments ẩn hoàn toàn, không hiện lỗi |

## Tạo file `.env.example`

File này commit lên git để team biết cần điền gì:

```bash
# Copy từ .env.local, xoá hết giá trị nhạy cảm
cp .env.local .env.example
```
