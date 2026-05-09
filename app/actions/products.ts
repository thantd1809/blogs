'use server'

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const stock = Number(formData.get("stock") ?? 0);
  const description = (formData.get("description") as string) || null;
  const category = (formData.get("category") as string) || null;
  const images = JSON.parse((formData.get("images") as string) || "[]") as string[];

  if (!name || !price) throw new Error("Thiếu tên hoặc giá");

  await db.insert(products).values({
    name,
    slug: `${toSlug(name)}-${Date.now()}`,
    price,
    stock,
    description,
    category,
    images,
    published: true,
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const stock = Number(formData.get("stock") ?? 0);
  const description = (formData.get("description") as string) || null;
  const category = (formData.get("category") as string) || null;
  const images = JSON.parse((formData.get("images") as string) || "[]") as string[];

  if (!name || !price) throw new Error("Thiếu tên hoặc giá");

  await db.update(products)
    .set({ name, price, stock, description, category, images, updatedAt: new Date() })
    .where(eq(products.id, id));

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function toggleProductPublished(id: string, published: boolean) {
  await db.update(products).set({ published, updatedAt: new Date() }).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
