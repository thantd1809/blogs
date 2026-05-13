import Link from "next/link";
import { CartIcon } from "@/components/shop/CartIcon";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Navbar() {
  return (
    <header className="border-b">
      <nav className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Thanhtd&apos;s Blog
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm hover:underline">Blog</Link>
          <Link href="/shop" className="text-sm hover:underline">Shop</Link>
          <Link href="/about" className="text-sm hover:underline">Về tôi</Link>
          <Link href="/admin" className="text-sm hover:underline">Admin</Link>
          <CartIcon />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
