# Kiến trúc Shop

## Tổng quan

```
Admin tạo sản phẩm
        │
        ▼
PostgreSQL (products table)
        │
        ▼
/shop page (Server Component)
        │
        ▼
ShopFilter (client filter) → ProductCard → "Thêm vào giỏ"
                                                    │
                                              Zustand cart
                                            (localStorage)
                                                    │
                                            /cart page
                                                    │
                                        Form đặt hàng
                                                    │
                                      POST /api/orders
                                         │         │
                                         ▼         ▼
                                      DB insert  Email (Resend)
```

---

## Database schema

**File:** `db/schema.ts`

### products

| Column | Type | Ghi chú |
|---|---|---|
| `id` | `text` (UUID) | Primary key, `gen_random_uuid()` |
| `name` | `text` | Tên sản phẩm |
| `slug` | `text` (unique) | `toSlug(name)-timestamp` |
| `description` | `text` | Mô tả (nullable) |
| `price` | `decimal(10,2)` | Giá VND |
| `stock` | `integer` | Tồn kho |
| `images` | `jsonb` (`string[]`) | Mảng URL ảnh |
| `category` | `text` | Phân loại (nullable) |
| `published` | `boolean` | Ẩn/hiện trên shop |
| `createdAt` / `updatedAt` | `timestamp` | Auto |

### orders

| Column | Type | Ghi chú |
|---|---|---|
| `id` | `text` (UUID) | Primary key |
| `customerName` | `text` | Tên khách |
| `phone` | `text` | SĐT liên hệ |
| `address` | `text` | Địa chỉ giao hàng |
| `note` | `text` | Ghi chú (nullable) |
| `total` | `decimal(10,2)` | Tổng tiền |
| `status` | `enum` | `pending → confirmed → shipping → done → cancelled` |
| `paymentMethod` | `enum` | `cod` hoặc `transfer` |

### order_items

| Column | Type | Ghi chú |
|---|---|---|
| `orderId` | `text` (FK → orders) | |
| `productId` | `text` (FK → products) | |
| `quantity` | `integer` | |
| `price` | `decimal(10,2)` | Giá tại thời điểm đặt |

---

## Lớp trang

### Danh sách sản phẩm (`/shop`)

**File:** `app/(public)/shop/page.tsx`

- Server Component
- Query: `db.select().from(products).where(eq(products.published, true))`
- Trích xuất danh sách categories unique
- Render `<ShopFilter products={...} categories={...} />`

### Chi tiết sản phẩm (`/shop/[slug]`)

**File:** `app/(public)/shop/[slug]/page.tsx`

- Server Component
- Query theo slug, 404 nếu không tìm thấy hoặc `published=false`
- Hiển thị: gallery ảnh, mô tả, giá, nút "Thêm vào giỏ"
- `generateMetadata()` cho SEO

### Giỏ hàng (`/cart`)

**File:** `app/(public)/cart/page.tsx`

- Client Component (đọc Zustand store)
- Danh sách items, quantity controls, tổng tiền
- Form đặt hàng: tên, SĐT, địa chỉ, ghi chú, phương thức thanh toán, email (optional)
- Submit → `POST /api/orders` → clear cart → hiển thị confirmation

---

## Cart state — Zustand

**File:** `lib/cart-store.ts`

```
persist middleware → localStorage key: "cart"

CartItem: { productId, name, price, image, quantity }

Actions:
  addItem(item)        → tăng qty nếu đã có, thêm mới nếu chưa
  removeItem(id)       → xóa khỏi cart
  updateQuantity(id, qty) → qty=0 tự xóa
  clearCart()          → sau khi đặt hàng thành công

Getters:
  total()  → tổng tiền (sum price × qty)
  count()  → tổng số lượng sản phẩm
```

Zustand store không cần Provider — import trực tiếp trong mọi Client Component.

---

## Image upload pipeline

**File:** `app/api/upload/route.ts`

```
POST /api/upload  (multipart/form-data)
        │
        ▼
Validate: chỉ JPG/PNG/WebP
        │
        ▼
Sharp: resize 800×800 cover, convert to WebP quality 85
        │
        ▼ (local dev)                ▼ (production)
public/uploads/[ts].webp     Supabase Storage bucket "products"
        │                                │
        ▼                                ▼
return { url: "/uploads/..." }   return { url: "https://...supabase.co/..." }
```

> Xem `docs/supabase-storage-swap.md` để swap sang Supabase khi deploy.

### ImageUploader component

**File:** `components/admin/ImageUploader.tsx`

- Multi-file upload, upload từng file lên `/api/upload`
- Preview grid với nút xóa từng ảnh
- Lưu mảng URL vào hidden input `images` (JSON string)

---

## Order flow

**File:** `app/api/orders/route.ts`

```
POST /api/orders
  body: { customerName, phone, address, note, paymentMethod, email, items[] }
        │
        ▼
Validate: tên/SĐT/địa chỉ/items bắt buộc
        │
        ▼
Tính total = sum(item.price × item.quantity)
        │
        ▼
db.insert(orders) → trả về order.id
        │
        ▼
db.insert(orderItems) → batch insert từng item
        │
        ▼ (nếu có email)
sendOrderConfirmation() → Resend API
        │
        ▼
return { orderId }
```

### Email xác nhận

**File:** `lib/email.ts`

Dùng Resend SDK. Template HTML thuần (không dùng React Email).
Nội dung: thông tin khách, danh sách sản phẩm, tổng tiền, địa chỉ, phương thức thanh toán.

Nếu `RESEND_API_KEY` không có → function log lỗi, không throw — đơn hàng vẫn được lưu.

---

## ShopFilter component

**File:** `components/shop/ShopFilter.tsx`

Client Component. Nhận toàn bộ products + categories từ Server Component.

```
state: activeCategory, query
filter (useMemo):
  1. Lọc theo category
  2. Lọc theo query trong name / description
render: category pills → search box → ProductCard grid
```

---

## SEO shop

### OG Image per product

**File:** `app/(public)/shop/[slug]/opengraph-image.tsx`

`ImageResponse` 1200×630. Hiển thị tên sản phẩm, giá (màu amber), ảnh đầu tiên nếu có.

### Sitemap

Products published được index trong `app/sitemap.ts`:
```ts
const productRoutes = allProducts.map((p) => ({
  url: `${baseUrl}/shop/${p.slug}`,
  lastModified: p.updatedAt,
}));
```

---

## Luồng dữ liệu tóm tắt

```
Admin form
    │ Server Action createProduct()
    ▼
PostgreSQL products table
    │ Server Component query (published=true)
    ▼
/shop page → ShopFilter (client)
    │ addItem()
    ▼
Zustand cart (localStorage)
    │ form submit
    ▼
POST /api/orders
    │
    ├──► DB: orders + order_items
    └──► Resend: email xác nhận
```
