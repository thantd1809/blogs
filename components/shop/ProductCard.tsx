"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
}

export function ProductCard({ id, name, price, image, slug, stock }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);

  function handleAddToCart() {
    addItem({ id, name, price, image });
    toast.success(`Đã thêm "${name}" vào giỏ hàng`);
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/shop/${slug}`}>
        <div className="relative aspect-square bg-muted">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Chưa có ảnh
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 space-y-3">
        <Link href={`/shop/${slug}`}>
          <h3 className="font-medium hover:underline">{name}</h3>
        </Link>
        <p className="text-lg font-semibold">
          {price.toLocaleString("vi-VN")}đ
        </p>
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          {stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </Button>
      </div>
    </div>
  );
}
