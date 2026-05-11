"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  images: string[];
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.slug === slug);
        setProduct(found ?? null);
      });
  }, [slug]);

  if (!product) return <p className="text-muted-foreground">Đang tải...</p>;

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] ?? "",
      });
    }
    toast.success(`Đã thêm ${qty} "${product.name}" vào giỏ hàng`);
  }

  return (
    <div className="space-y-6">
      <Link href="/shop" className="text-sm text-muted-foreground hover:underline">
        ← Quay lại Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ảnh */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Chưa có ảnh
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary">
            {Number(product.price).toLocaleString("vi-VN")}đ
          </p>
          {product.stock === 0 ? (
            <Badge variant="destructive">Hết hàng</Badge>
          ) : (
            <Badge variant="secondary">Còn hàng: {product.stock}</Badge>
          )}
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {/* Số lượng */}
          <div className="flex items-center gap-3">
            <span className="text-sm">Số lượng:</span>
            <div className="flex items-center border rounded-md">
              <button
                className="px-3 py-1 hover:bg-muted"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >-</button>
              <span className="px-4 py-1 border-x">{qty}</span>
              <button
                className="px-3 py-1 hover:bg-muted"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >+</button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button variant="outline" render={<Link href="/cart" />}>Xem giỏ hàng</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
