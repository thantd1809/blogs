# Blog & Yến Sào

Blog cá nhân về công nghệ / lập trình kết hợp shop bán yến sào.

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Blog | MDX + Velite |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle ORM |
| Auth | Clerk |
| AI | Vercel AI SDK + Claude API (Anthropic) |
| Email | Resend |
| Storage | Supabase Storage (ảnh sản phẩm) |
| Deploy | Vercel |

## Tính năng

- **Blog** — viết bài MDX, search, filter theo tag, RSS feed
- **Shop** — bán yến sào, giỏ hàng, đặt hàng COD/chuyển khoản
- **Admin** — quản lý sản phẩm, đơn hàng, thống kê doanh thu
- **Chatbot AI** — tư vấn yến sào 24/7 bằng Claude
- **SEO** — sitemap, robots.txt, OG image tự động
- **Email** — xác nhận đơn hàng qua Resend
- **Dark mode** — tự động theo system

## Cài đặt local

Xem [docs/local-setup.md](docs/local-setup.md)

## Deploy production

Xem [docs/deploy.md](docs/deploy.md)

## Cấu trúc thư mục

```
blogs/
├── app/
│   ├── (public)/          # Trang người dùng
│   │   ├── page.tsx       # Trang chủ
│   │   ├── blog/          # Danh sách + chi tiết bài viết
│   │   ├── shop/          # Danh sách + chi tiết sản phẩm
│   │   ├── cart/          # Giỏ hàng + checkout
│   │   └── about/         # Giới thiệu
│   ├── (admin)/           # Trang quản trị
│   │   └── admin/
│   │       ├── page.tsx   # Dashboard
│   │       ├── orders/    # Quản lý đơn hàng
│   │       └── products/  # Quản lý sản phẩm
│   ├── api/
│   │   ├── chat/          # Chatbot AI endpoint
│   │   ├── orders/        # Tạo đơn hàng
│   │   ├── products/      # Danh sách sản phẩm
│   │   └── upload/        # Upload ảnh
│   ├── actions/           # Server Actions
│   ├── sitemap.ts         # Sitemap tự động
│   ├── robots.ts          # robots.txt
│   └── feed.xml/          # RSS Feed
├── components/
│   ├── blog/              # BlogCard, BlogSearch, MDXContent
│   ├── shop/              # ProductCard, ShopFilter, CartIcon
│   ├── admin/             # AddProductForm, EditProductDialog
│   ├── chat/              # Chatbot
│   └── layout/            # Navbar, Footer, ThemeToggle
├── content/
│   └── posts/             # File MDX bài viết
├── db/
│   ├── schema.ts          # Drizzle schema
│   ├── index.ts           # DB client
│   ├── migrations/        # SQL migrations
│   └── seed.ts            # Dữ liệu mẫu
└── lib/
    ├── posts.ts           # Helper đọc MDX
    ├── cart-store.ts      # Zustand cart state
    └── email.ts           # Resend email helper
```

## Scripts

```bash
npm run dev          # Dev server (Velite + Next.js)
npm run build        # Production build
npm run db:generate  # Tạo migration từ schema
npm run db:migrate   # Chạy migration
npm run db:studio    # Drizzle Studio (GUI DB)
npm run db:seed      # Thêm dữ liệu mẫu
```

## Viết bài mới

Tạo file `.mdx` trong `content/posts/`:

```mdx
---
title: "Tiêu đề bài viết"
date: "2026-05-08"
summary: "Tóm tắt ngắn hiển thị ở danh sách."
tags: ["nextjs", "tips"]
published: true
---

Nội dung bài viết ở đây...
```

Velite tự động rebuild khi lưu file.
