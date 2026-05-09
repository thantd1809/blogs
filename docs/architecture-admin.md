# Kiến trúc Admin

## Tổng quan

```
/admin/*  (route group: app/(admin)/)
    │
    ├── layout.tsx     → Clerk auth guard
    ├── page.tsx       → Dashboard (stats)
    ├── products/      → Quản lý sản phẩm
    └── orders/        → Quản lý đơn hàng
```

---

## Auth guard

**File:** `app/(admin)/layout.tsx`

```ts
import { auth } from "@clerk/nextjs/server";

export default async function AdminLayout({ children }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <>{children}</>;
}
```

Tất cả routes trong `(admin)` đều được bảo vệ bởi layout này. Không cần middleware — layout check đủ cho app single-admin.

> Khi `CLERK_SECRET_KEY` chưa điền (local dev), `auth()` trả về `{ userId: null }` → redirect. Để bypass local, điền Clerk keys vào `.env.local`.

---

## Dashboard (`/admin`)

**File:** `app/(admin)/admin/page.tsx`

Server Component. Query trực tiếp từ DB:

```ts
const totalProducts = await db.select({ count: count() }).from(products);
const totalOrders = await db.select({ count: count() }).from(orders);
const pendingOrders = await db.select({ count: count() })
  .from(orders).where(eq(orders.status, "pending"));
const revenue = await db.select({ sum: sum(orders.total) })
  .from(orders).where(eq(orders.status, "done"));
```

Hiển thị: stat cards (tổng sản phẩm, tổng đơn, đơn chờ xử lý, doanh thu).

---

## Quản lý sản phẩm

### Trang danh sách (`/admin/products`)

**File:** `app/(admin)/admin/products/page.tsx`

- Server Component
- Query: `db.select().from(products).orderBy(desc(products.createdAt))`
- Render: `<AddProductForm>` + bảng sản phẩm + `<EditProductDialog>` + nút xóa/ẩn

### Server Actions — `app/actions/products.ts`

Pattern chung: `'use server'` → validate → DB mutation → `revalidatePath()`.

| Action | DB operation | revalidatePath |
|---|---|---|
| `createProduct(formData)` | `insert` | `/admin/products`, `/shop` |
| `updateProduct(id, formData)` | `update` | `/admin/products`, `/shop` |
| `toggleProductPublished(id, bool)` | `update published` | `/admin/products`, `/shop` |
| `deleteProduct(id)` | `delete` | `/admin/products`, `/shop` |

Slug tự sinh: `toSlug(name) + "-" + Date.now()` (unique nhờ timestamp).

`revalidatePath("/shop")` đảm bảo trang shop client thấy dữ liệu mới ngay sau mutation.

### AddProductForm — `components/admin/AddProductForm.tsx`

Client Component. Dùng `useActionState(createProduct, null)` hook.

```
render: form fields (name, price, stock, description, category)
        + <ImageUploader> → hidden input "images" (JSON array URL)
        + submit button (disabled khi pending)
        + hiển thị lỗi từ action state
```

Category select: danh sách cố định (yến hộp, yến thô, yến tinh chế, combo...).

### EditProductDialog — `components/admin/EditProductDialog.tsx`

shadcn `<Dialog>`. Pre-fill form với dữ liệu sản phẩm hiện tại. Submit gọi `updateProduct(id, formData)`.

---

## Quản lý đơn hàng

### Trang danh sách (`/admin/orders`)

**File:** `app/(admin)/admin/orders/page.tsx`

- Server Component
- Query với JOIN để lấy order + items + product name:
  ```ts
  db.select().from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .orderBy(desc(orders.createdAt))
  ```
- Group items theo orderId (do LEFT JOIN tạo nhiều rows per order)
- Hiển thị: status badge (màu theo trạng thái), thông tin khách, danh sách sản phẩm, tổng tiền

### Status workflow

```
pending → confirmed → shipping → done
    └──────────────────────────► cancelled (từ bất kỳ trạng thái)
```

| Status | Màu badge | Ý nghĩa |
|---|---|---|
| `pending` | vàng | Đơn mới, chưa xử lý |
| `confirmed` | xanh dương | Đã xác nhận |
| `shipping` | tím | Đang giao |
| `done` | xanh lá | Hoàn thành |
| `cancelled` | đỏ | Đã hủy |

### Server Action updateOrderStatus

**File:** `app/actions/orders.ts`

```ts
'use server'
export async function updateOrderStatus(orderId: string, status: string) {
  await db.update(orders)
    .set({ status: status as never, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
}
```

Gọi từ `<form action={updateOrderStatus.bind(null, orderId)}>` — dropdown select + submit button trong mỗi row.

---

## Image upload từ admin

Luồng upload ảnh khi tạo/sửa sản phẩm:

```
Admin chọn file
    │ <input type="file" multiple>
    ▼
POST /api/upload (multipart)
    │ Sharp: resize + WebP
    ▼
Lưu file → trả { url }
    │
    ▼
ImageUploader cập nhật mảng URLs
    │
    ▼
Hidden input "images" = JSON.stringify(urls[])
    │ form submit
    ▼
createProduct / updateProduct nhận images từ formData
    │ JSON.parse
    ▼
db.insert / db.update với images (jsonb column)
```

---

## Pattern: Server Actions + revalidatePath

Đây là pattern cốt lõi của admin. Không dùng API route, không dùng client-side fetch cho mutations.

```
Server Component (render page với data mới nhất)
        ▲
        │ revalidatePath() xóa cache
        │
Server Action (mutation)
        ▲
        │ form submit / button click
        │
Client Component (form / button)
```

**Lợi ích:**
- Không cần quản lý loading state thủ công (dùng `useFormStatus`)
- Không cần API route riêng
- Server Component tự re-render với data mới sau revalidation
- Type-safe end-to-end (TypeScript function, không phải string URL)

---

## Bài viết blog từ admin

**File:** `app/(admin)/admin/posts/page.tsx`

Admin quản lý bài viết qua filesystem (MDX files), không phải DB. Trang này chỉ list các bài hiện có và link đến file path.

Để thêm/sửa bài: chỉnh sửa file `.mdx` trong `content/posts/` → Velite rebuild → deploy.

---

## Luồng dữ liệu tóm tắt

```
Admin UI (Client Component)
    │ form submit
    ▼
Server Action ('use server')
    │
    ├──► Drizzle ORM
    │         │
    │         ▼
    │    PostgreSQL
    │
    └──► revalidatePath()
              │
              ▼
    Next.js purge cache
              │
              ▼
    Server Component re-fetch + re-render
              │
              ▼
    User thấy data mới (no full page reload)
```
