import { pgTable, text, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  images: jsonb("images").$type<string[]>().default([]),
  category: text("category"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  note: text("note"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "shipping", "done", "cancelled"],
  }).default("pending"),
  paymentMethod: text("payment_method", {
    enum: ["cod", "transfer"],
  }).default("cod"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  orderId: text("order_id").notNull().references(() => orders.id),
  productId: text("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});
