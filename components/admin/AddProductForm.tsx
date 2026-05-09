"use client";

import { useRef, useState } from "react";
import { createProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import { useActionState } from "react";

export function AddProductForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<string[]>([]);

  async function action(_prev: null, formData: FormData) {
    formData.set("images", JSON.stringify(images));
    await createProduct(formData);
    formRef.current?.reset();
    setImages([]);
    return null;
  }

  const [, dispatch, pending] = useActionState(action, null);

  return (
    <form ref={formRef} action={dispatch} className="border rounded-lg p-6 space-y-4 bg-muted/20">
      <h2 className="font-semibold text-lg">Thêm sản phẩm mới</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên sản phẩm *</Label>
          <Input id="name" name="name" placeholder="Yến tinh chế 100g" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Giá (VNĐ) *</Label>
          <Input id="price" name="price" type="number" placeholder="850000" required min={0} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Tồn kho</Label>
          <Input id="stock" name="stock" type="number" placeholder="50" defaultValue={0} min={0} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Danh mục</Label>
          <select id="category" name="category" className="w-full border rounded-md px-3 py-2 text-sm bg-background">
            <option value="">-- Chọn danh mục --</option>
            <option value="yen-tinh-che">Yến tinh chế</option>
            <option value="yen-tho">Yến thô</option>
            <option value="nuoc-yen">Nước yến</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea id="description" name="description" placeholder="Mô tả ngắn về sản phẩm..." rows={3} />
      </div>

      <div className="space-y-2">
        <Label>Ảnh sản phẩm</Label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Đang thêm..." : "Thêm sản phẩm"}
      </Button>
    </form>
  );
}
