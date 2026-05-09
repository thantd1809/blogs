# Cài đặt Local

## Yêu cầu

- Node.js 20+
- Docker Desktop

## Các bước

### 1. Clone và cài dependencies

```bash
git clone <repo-url>
cd blogs
npm install
```

### 2. Tạo file môi trường

```bash
cp .env.example .env.local
```

Điền `DATABASE_URL` (các biến khác để trống khi chạy local):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blogs
```

### 3. Khởi động PostgreSQL

```bash
docker compose up -d
```

### 4. Chạy migration và seed

```bash
npm run db:migrate
npm run db:seed      # Thêm 3 sản phẩm yến mẫu
```

### 5. Chạy dev server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Tính năng cần API key khi local

| Tính năng | Biến môi trường | Ghi chú |
|---|---|---|
| Chatbot AI | `ANTHROPIC_API_KEY` | Lấy tại console.anthropic.com |
| Email đơn hàng | `RESEND_API_KEY` | Lấy tại resend.com |
| Auth admin | `CLERK_*` | Lấy tại clerk.com |

Các tính năng này bị tắt tự động nếu thiếu API key — không làm crash app.

## Drizzle Studio (GUI quản lý DB)

```bash
npm run db:studio
```

Mở [https://local.drizzle.studio](https://local.drizzle.studio).

## Thêm sản phẩm mới

Vào `/admin/products` → form **Thêm sản phẩm mới**.

## Viết bài blog

Tạo file `.mdx` trong `content/posts/` — Velite tự động detect và rebuild.
