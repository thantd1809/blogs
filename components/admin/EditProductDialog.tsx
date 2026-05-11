"use client";

import { useState, useRef } from "react";
import { useActionState } from "react";
import { updateProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUploader } from "./ImageUploader";

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  description: string | null;
  category: string | null;
  images: string[];
}

export function EditProductDialog({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>(product.images ?? []);
  const formRef = useRef<HTMLFormElement>(null);

  async function action(_prev: null, formData: FormData) {
    formData.set("images", JSON.stringify(images));
    await updateProduct(product.id, formData);
    setOpen(false);
    return null;
  }

  const [, dispatch, pending] = useActionState(action, null);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setImages(product.images ?? []); }}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Sửa</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa sản phẩm</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={dispatch} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Tên sản phẩm *</Label>
            <Input name="name" defaultValue={product.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Giá (VNĐ) *</Label>
              <Input name="price" type="number" defaultValue={product.price} required min={0} />
            </div>
            <div className="space-y-2">
              <Label>Tồn kho</Label>
              <Input name="stock" type="number" defaultValue={product.stock} min={0} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Danh mục</Label>
            <select name="category" defaultValue={product.category ?? ""} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
              <option value="">-- Chọn danh mục --</option>
              <option value="yen-tinh-che">Yến tinh chế</option>
              <option value="yen-tho">Yến thô</option>
              <option value="nuoc-yen">Nước yến</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea name="description" defaultValue={product.description ?? ""} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Ảnh sản phẩm</Label>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
