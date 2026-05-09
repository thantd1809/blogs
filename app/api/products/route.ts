import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(products).where(eq(products.published, true));
  return NextResponse.json(data);
}
