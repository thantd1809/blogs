import type { Metadata } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ShopFilter } from "@/components/shop/ShopFilter";

export const metadata: Metadata = {
  title: "Shop Yến Sào",
  description: "Yến sào chất lượng cao, nguồn gốc rõ ràng.",
};

export default async function ShopPage() {
  const data = await db.select().from(products).where(eq(products.published, true));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Shop Yến Sào</h1>
        <p className="text-muted-foreground mt-2">
          Yến sào chất lượng cao, nguồn gốc rõ ràng, giao hàng toàn quốc.
        </p>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground">Chưa có sản phẩm nào.</p>
      ) : (
        <ShopFilter products={data.map((p) => ({
          ...p,
          images: (p.images as string[]) ?? [],
        }))} />
      )}
    </div>
  );
}
