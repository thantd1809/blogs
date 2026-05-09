# Kiến trúc Blog

## Tổng quan

```
content/posts/**/*.mdx
        │
        ▼ (build time)
   velite.config.ts  ──►  .velite/posts.json  (compiled MDX + metadata)
        │
        ▼ (runtime)
   lib/posts.ts  ──►  getAllPosts() / getPostBySlug()
        │
        ▼
   Server Components  ──►  Client: BlogSearch / MDXContent
```

---

## Lớp nội dung — Velite

**File:** `velite.config.ts`

Velite đọc tất cả file `.mdx` trong `content/posts/**/*.mdx` và biên dịch chúng lúc build. Output là TypeScript module tại `.velite/index.ts`.

### Schema mỗi bài

| Field | Type | Mô tả |
|---|---|---|
| `title` | `string` | Tiêu đề bài viết |
| `date` | `isodate` | Ngày đăng (ISO 8601) |
| `summary` | `string` | Tóm tắt, dùng cho SEO/card |
| `tags` | `string[]` | Tags phân loại |
| `published` | `boolean` | `false` → ẩn khỏi danh sách |
| `slug` | `s.path()` | Tự động từ đường dẫn file |
| `body` | `s.mdx()` | Compiled MDX code string |
| `readingTime` | `number` | Tính từ `body.length / 1000` |

### MDX plugins

```
remarkGfm          → tables, strikethrough, task lists
rehypeSlug         → id cho mỗi heading (dùng cho anchor link)
rehypeAutolinkHeadings → wrap heading với <a> để copy link
rehypePrettyCode   → syntax highlight (Shiki, theme: github-dark)
```

---

## Lớp truy vấn — lib/posts.ts

```
getAllPosts()    → lọc published=true, sort mới nhất trước
getPostBySlug() → tìm bài theo slug, kiểm tra published
getAllTags()     → đếm số bài mỗi tag → { tag: count }
```

Dữ liệu đến từ import tĩnh `.velite` — không có DB call, không có network request.

---

## Lớp trang

### Danh sách bài (`/blog`)

**File:** `app/(public)/blog/page.tsx`

- Server Component
- Gọi `getAllPosts()` + `getAllTags()`
- Render `<BlogSearch>` với toàn bộ posts làm prop

### Chi tiết bài (`/blog/[slug]`)

**File:** `app/(public)/blog/[slug]/page.tsx`

- Server Component
- Gọi `getPostBySlug(slug)` — 404 nếu không tìm thấy
- `generateStaticParams()` pre-render tất cả bài lúc build
- `generateMetadata()` trả về `title`, `description`, `openGraph`
- Render `<MDXContent code={post.body.code} />`

---

## Lớp component

### BlogSearch — `components/blog/BlogSearch.tsx`

Client Component (`"use client"`). Nhận toàn bộ posts từ Server Component.

```
props: posts[], tags (với số đếm)
state: query (input text), activeTag
filter (useMemo):
  1. Lọc theo activeTag (nếu có)
  2. Lọc theo query trong title / summary / tags
render: tag pills → result count → danh sách BlogCard
```

Không có API call — filter hoàn toàn trên client bằng dữ liệu đã load sẵn.

### BlogCard — `components/blog/BlogCard.tsx`

Hiển thị: title, date, readingTime, summary, tags (badge). Link đến `/blog/[slug]`.

### MDXContent — `components/blog/MDXContent.tsx`

Client Component. Nhận `code` string (compiled MDX từ Velite).

```ts
const Component = useMemo(() => {
  const fn = new Function(code);       // eval compiled MDX
  return fn({ ...runtime }).default;   // react/jsx-runtime
}, [code]);
```

Wrap trong `.prose.prose-neutral.dark:prose-invert` (Tailwind Typography).

---

## SEO

### Metadata động

`generateMetadata()` trong `app/(public)/blog/[slug]/page.tsx` trả về:

```ts
{
  title: post.title,
  description: post.summary,
  openGraph: { title, description, type: "article", publishedTime, tags }
}
```

### OG Image

**File:** `app/(public)/blog/[slug]/opengraph-image.tsx`

Dùng `ImageResponse` (next/og) — render server-side thành PNG 1200×630.
Hiển thị: title, summary, date. Background gradient tối.

### Sitemap

`app/sitemap.ts` tổng hợp:
- Static routes: `/`, `/blog`, `/shop`, `/about`
- Dynamic posts: từ `getAllPosts()`
- Dynamic products: từ DB query

---

## RSS Feed

**File:** `app/feed.xml/route.ts`

Route handler trả XML, Content-Type `application/xml`.
Mỗi item: title, link, description (summary), pubDate.

---

## Luồng dữ liệu tóm tắt

```
.mdx file  →  velite build  →  .velite/index.ts
                                      │
                              lib/posts.ts (import tĩnh)
                                      │
                         Server Component (fetch at request time)
                                      │
                      ┌──────────────┴──────────────┐
                      ▼                             ▼
               BlogSearch (client filter)    MDXContent (render MDX)
```

---

## Comments — Giscus

**File:** `components/blog/GiscusComments.tsx`

Dùng GitHub Discussions làm backend lưu comments. Không cần DB thêm.

```
useTheme() → resolvedTheme ("dark" | "light")
     │
     ▼
<Giscus theme="dark" | "light" />   ← tự đổi theo dark mode
```

- `mapping="pathname"` — mỗi bài blog tạo 1 Discussion riêng theo URL
- `inputPosition="top"` — form comment ở trên, replies bên dưới
- `lang="vi"` — UI tiếng Việt
- `loading="lazy"` — chỉ load khi scroll đến

Component tự ẩn (`return null`) nếu 4 env vars Giscus chưa được điền — không gây lỗi.

### Setup

1. GitHub repo → Settings → Features → bật **Discussions**
2. Vào [giscus.app](https://giscus.app) → điền repo → copy 4 giá trị
3. Điền vào `.env.local` (và Vercel env vars khi deploy)

```env
NEXT_PUBLIC_GISCUS_REPO=username/blogs
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxx
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx
```

---

## Dev workflow

```bash
# Chạy cả hai đồng thời:
npm run dev
# → velite dev  (watch .mdx, rebuild .velite)
# → next dev    (Next.js dev server)

# Thêm bài mới:
# 1. Tạo content/posts/[year]/[slug].mdx
# 2. Velite tự rebuild .velite
# 3. Bài xuất hiện ngay (hot reload)
```
