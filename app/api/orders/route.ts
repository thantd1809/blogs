import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerName, phone, address, note, paymentMethod, email, items } = body;

  if (!customerName || !phone || !address || !items?.length) {
    return NextResponse.json({ error: "Thiếu thông tin đặt hàng" }, { status: 400 });
  }

  const total = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const [order] = await db
    .insert(orders)
    .values({ customerName, phone, address, note, paymentMethod, total: String(total) })
    .returning();

  await db.insert(orderItems).values(
    items.map((item: { productId: string; quantity: number; price: number; name: string }) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: String(item.price),
    }))
  );

  // Gửi email xác nhận nếu có email
  if (email) {
    await sendOrderConfirmation({
      to: email,
      orderId: order.id,
      customerName,
      items: items.map((i: { name: string; quantity: number; price: number }) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      total,
      address,
      paymentMethod,
    });
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
