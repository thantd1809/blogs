"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "cod" as "cod" | "transfer",
  });

  async function handleOrder() {
    if (!form.customerName || !form.phone || !form.address) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      clearCart();
      setDone(true);
      toast.success("Đặt hàng thành công!");
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-20 space-y-4">
        <h1 className="text-3xl font-bold">Đặt hàng thành công!</h1>
        <p className="text-muted-foreground">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </p>
        <Button asChild>
          <Link href="/shop">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <h1 className="text-2xl font-bold">Giỏ hàng trống</h1>
        <Button asChild>
          <Link href="/shop">Xem sản phẩm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border rounded-lg p-4">
              <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.price.toLocaleString("vi-VN")}đ / cái
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <button
                      className="px-2 py-0.5 hover:bg-muted text-sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >-</button>
                    <span className="px-3 py-0.5 border-x text-sm">{item.quantity}</span>
                    <button
                      className="px-2 py-0.5 hover:bg-muted text-sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                  <button
                    className="text-destructive hover:opacity-70"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-right">
                {(item.price * item.quantity).toLocaleString("vi-VN")}đ
              </p>
            </div>
          ))}
        </div>

        {/* Form đặt hàng */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Thông tin đặt hàng</h2>
            <div className="space-y-2">
              <Label>Họ tên *</Label>
              <Input
                placeholder="Nguyễn Văn A"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại *</Label>
              <Input
                placeholder="0912345678"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email <span className="text-muted-foreground text-xs">(nhận xác nhận đơn hàng)</span></Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ giao hàng *</Label>
              <Textarea
                placeholder="Số nhà, đường, phường, quận, tỉnh..."
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Input
                placeholder="Ghi chú thêm (nếu có)"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Thanh toán</Label>
              <div className="flex gap-3">
                {(["cod", "transfer"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setForm((f) => ({ ...f, paymentMethod: method }))}
                    className={`flex-1 border rounded-md py-2 text-sm transition-colors ${
                      form.paymentMethod === method
                        ? "border-primary bg-primary/5 font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    {method === "cod" ? "COD (Tiền mặt)" : "Chuyển khoản"}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span>{total().toLocaleString("vi-VN")}đ</span>
            </div>

            <Button className="w-full" onClick={handleOrder} disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
