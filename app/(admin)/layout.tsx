import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/posts", label: "Bài viết" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-52 border-r bg-muted/30 flex flex-col gap-1 p-4 pt-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-2">Admin</p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-auto">
          <Link href="/" className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted block">
            ← Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
