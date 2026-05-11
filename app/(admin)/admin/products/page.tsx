export const dynamic = "force-dynamic";

import { db } from "@/db";
import { products } from "@/db/schema";
import { toggleProductPublished, deleteProduct } from "@/app/actions/products";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { EditProductDialog } from "@/components/admin/EditProductDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products).orderBy(products.createdAt);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <p className="text-muted-foreground text-sm">{allProducts.length} sản phẩm</p>
      </div>

      <AddProductForm />

      {allProducts.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Tên sản phẩm</th>
                <th className="text-left px-4 py-3 font-medium">Giá</th>
                <th className="text-left px-4 py-3 font-medium">Tồn kho</th>
                <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{Number(product.price).toLocaleString("vi-VN")}đ</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.published ? "default" : "outline"}>
                      {product.published ? "Đang bán" : "Ẩn"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <EditProductDialog
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          stock: product.stock,
                          description: product.description,
                          category: product.category,
                          images: (product.images as string[]) ?? [],
                        }}
                      />
                      <form action={toggleProductPublished.bind(null, product.id, !product.published)}>
                        <Button size="sm" variant="outline" type="submit">
                          {product.published ? "Ẩn" : "Hiện"}
                        </Button>
                      </form>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <Button size="sm" variant="destructive" type="submit">Xoá</Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
