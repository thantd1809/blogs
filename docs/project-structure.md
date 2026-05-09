# Cấu trúc source code

## Cây thư mục

```
blogs/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Route group — public pages
│   │   ├── layout.tsx            # Layout chung: Navbar + Footer
│   │   ├── page.tsx              # Trang chủ
│   │   ├── about/page.tsx        # Giới thiệu
│   │   ├── blog/
│   │   │   ├── page.tsx          # Danh sách bài viết
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Chi tiết bài viết
│   │   │       └── opengraph-image.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx          # Danh sách sản phẩm
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Chi tiết sản phẩm
│   │   │       └── opengraph-image.tsx
│   │   └── cart/page.tsx         # Giỏ hàng + form đặt hàng
│   │
│   ├── (admin)/                  # Route group — admin (auth guard)
│   │   ├── layout.tsx            # Clerk auth guard
│   │   └── admin/
│   │       ├── page.tsx          # Dashboard: stats tổng quan
│   │       ├── products/page.tsx # Quản lý sản phẩm
│   │       ├── orders/page.tsx   # Quản lý đơn hàng
│   │       └── posts/page.tsx    # Danh sách bài viết
│   │
│   ├── actions/                  # Server Actions ('use server')
│   │   ├── products.ts           # CRUD sản phẩm
│   │   └── orders.ts             # Cập nhật trạng thái đơn
│   │
│   ├── api/                      # Route Handlers
│   │   ├── chat/route.ts         # POST — chatbot AI streaming
│   │   ├── orders/route.ts       # POST — tạo đơn hàng
│   │   ├── products/route.ts     # GET — danh sách sản phẩm (cho chatbot)
│   │   └── upload/route.ts       # POST — upload + optimize ảnh
│   │
│   ├── feed.xml/route.ts         # RSS feed
│   ├── sitemap.ts                # Sitemap động
│   ├── robots.ts                 # robots.txt
│   ├── opengraph-image.tsx       # OG image trang chủ
│   ├── layout.tsx                # Root layout: ThemeProvider + Chatbot
│   └── globals.css               # Tailwind v4 CSS variables
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Navigation + ThemeToggle + CartIcon
│   │   ├── Footer.tsx            # Footer
│   │   ├── ThemeProvider.tsx     # next-themes provider
│   │   └── ThemeToggle.tsx       # Nút chuyển dark/light mode
│   │
│   ├── blog/
│   │   ├── BlogCard.tsx          # Card preview bài viết
│   │   ├── BlogSearch.tsx        # Search + filter theo tag (client)
│   │   ├── MDXContent.tsx        # Render compiled MDX
│   │   └── GiscusComments.tsx    # Comments (GitHub Discussions)
│   │
│   ├── shop/
│   │   ├── ProductCard.tsx       # Card sản phẩm + nút thêm giỏ
│   │   ├── ShopFilter.tsx        # Filter theo category + search (client)
│   │   └── CartIcon.tsx          # Icon giỏ hàng + badge số lượng
│   │
│   ├── admin/
│   │   ├── AddProductForm.tsx    # Form thêm sản phẩm (useActionState)
│   │   ├── EditProductDialog.tsx # Dialog sửa sản phẩm (shadcn Dialog)
│   │   └── ImageUploader.tsx     # Upload ảnh, preview grid, xóa ảnh
│   │
│   ├── chat/
│   │   └── Chatbot.tsx           # Floating chatbot widget (useChat)
│   │
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sonner.tsx            # Toast notifications
│       └── textarea.tsx
│
├── lib/
│   ├── posts.ts                  # Query helpers cho Velite posts
│   ├── cart-store.ts             # Zustand cart store (localStorage)
│   ├── email.ts                  # Resend — gửi email xác nhận đơn
│   └── utils.ts                  # cn() — merge Tailwind classes
│
├── db/
│   ├── index.ts                  # Drizzle client (connect PostgreSQL)
│   ├── schema.ts                 # Schema: products, orders, order_items
│   ├── seed.ts                   # Seed dữ liệu mẫu
│   └── migrations/               # SQL migrations (drizzle-kit generate)
│
├── content/
│   └── posts/                    # Bài viết MDX
│       ├── hello-world.mdx
│       └── nextjs-15-tips.mdx
│
├── docs/                         # Tài liệu project
│   ├── project-structure.md      # File này
│   ├── architecture-blog.md      # Kiến trúc blog
│   ├── architecture-shop.md      # Kiến trúc shop
│   ├── architecture-admin.md     # Kiến trúc admin
│   ├── env-variables.md          # Biến môi trường
│   ├── local-setup.md            # Hướng dẫn chạy local
│   ├── deploy.md                 # Hướng dẫn deploy
│   └── supabase-storage-swap.md  # Swap upload sang Supabase
│
├── public/                       # Static assets
│   └── uploads/                  # Ảnh upload local (gitignored)
│
├── .env.local                    # Env vars local (gitignored)
├── .env.example                  # Template env vars (committed)
├── .gitignore
├── next.config.ts                # Next.js config
├── velite.config.ts              # Velite MDX config
├── drizzle.config.ts             # Drizzle Kit config
├── docker-compose.yml            # PostgreSQL local
├── tsconfig.json
├── postcss.config.mjs
├── components.json               # shadcn/ui config
└── package.json
```

---

## Quy ước đặt tên

| Loại | Convention | Ví dụ |
|---|---|---|
| Page | `page.tsx` trong thư mục route | `app/(public)/blog/page.tsx` |
| Layout | `layout.tsx` trong thư mục route | `app/(admin)/layout.tsx` |
| Route Handler | `route.ts` trong thư mục route | `app/api/chat/route.ts` |
| Server Action | file `.ts` trong `app/actions/` | `app/actions/products.ts` |
| Component | PascalCase `.tsx` | `components/blog/BlogCard.tsx` |
| Lib/util | camelCase `.ts` | `lib/cart-store.ts` |
| DB schema | `db/schema.ts` | — |

---

## Route groups

Next.js route groups (`(name)`) nhóm routes mà không ảnh hưởng URL:

| Group | URL prefix | Mục đích |
|---|---|---|
| `(public)` | `/`, `/blog`, `/shop`, `/cart` | Trang public, dùng Navbar + Footer |
| `(admin)` | `/admin/*` | Trang admin, Clerk auth guard |

---

## Phân biệt Server vs Client Component

| File | Loại | Lý do |
|---|---|---|
| `app/**/page.tsx` | Server | Fetch DB/data trực tiếp |
| `app/**/layout.tsx` | Server | Không cần state |
| `components/blog/BlogSearch.tsx` | Client | `useState`, filter realtime |
| `components/blog/MDXContent.tsx` | Client | `new Function()` eval MDX |
| `components/blog/GiscusComments.tsx` | Client | `useTheme`, browser API |
| `components/shop/ShopFilter.tsx` | Client | `useState`, filter realtime |
| `components/shop/CartIcon.tsx` | Client | Zustand store |
| `components/admin/AddProductForm.tsx` | Client | `useActionState` |
| `components/chat/Chatbot.tsx` | Client | `useChat`, DOM events |
| `app/actions/*.ts` | Server | `'use server'` directive |
| `app/api/*/route.ts` | Server | Route Handler |

---

## Data flow tóm tắt

```
content/posts/*.mdx  →  Velite (build)  →  lib/posts.ts  →  Blog pages
PostgreSQL           →  Drizzle ORM     →  Server Components / API Routes
Zustand (memory)     →  localStorage    →  Cart state
GitHub Discussions   →  Giscus embed    →  Blog comments
```
