"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function CartIcon() {
  const count = useCart((s) => s.count());
  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
