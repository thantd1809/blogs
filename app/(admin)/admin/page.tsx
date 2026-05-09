import Link from "next/link";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, count, sum } from "drizzle-orm";

export default async function AdminPage() {
  const [orderCount] = await db.select({ count: count() }).from(orders);
  const [pendingCount] = await db.select({ count: count() }).from(orders).where(eq(orders.status, "pending"));
  const [productCount] = await db.select({ count: count() }).from(products);
  const [revenue] = await db.select({ total: sum(orders.total) }).from(orders).where(eq(orders.status, "done"));

  const stats = [
    { label: "Tổng đơn hàng", value: orderCount.count },
    { label: "Chờ xác nhận", value: pendingCount.count },
    { label: "Sản phẩm", value: productCount.count },
    { label: "Doanh thu", value: `${Number(revenue.total ?? 0).toLocaleString("vi-VN")}đ` },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border rounded-lg p-5 space-y-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/orders" className="border rounded-lg p-6 hover:bg-muted space-y-1">
          <h2 className="font-semibold">Đơn hàng</h2>
          <p className="text-sm text-muted-foreground">Xem và xử lý đơn hàng</p>
        </Link>
        <Link href="/admin/products" className="border rounded-lg p-6 hover:bg-muted space-y-1">
          <h2 className="font-semibold">Sản phẩm</h2>
          <p className="text-sm text-muted-foreground">Quản lý sản phẩm yến sào</p>
        </Link>
        <Link href="/admin/posts" className="border rounded-lg p-6 hover:bg-muted space-y-1">
          <h2 className="font-semibold">Bài viết</h2>
          <p className="text-sm text-muted-foreground">Quản lý bài viết blog</p>
        </Link>
      </div>
    </div>
  );
}
