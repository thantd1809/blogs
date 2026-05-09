"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error();
        const { url } = await res.json();
        uploaded.push(url);
      } catch {
        toast.error(`Upload thất bại: ${file.name}`);
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
  }

  function removeImage(url: string) {
    onChange(images.filter((i) => i !== url));
  }

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((url) => (
            <div key={url} className="relative w-24 h-24 rounded-md overflow-hidden border group">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 border-2 border-dashed rounded-lg px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
      >
        <Upload className="w-4 h-4" />
        {uploading ? "Đang upload..." : "Chọn ảnh (JPG, PNG, WebP)"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
