'use server'

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  await db.update(orders).set({ status: status as never, updatedAt: new Date() }).where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
}
