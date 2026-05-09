import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: "Chỉ hỗ trợ JPG, PNG, WebP" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Resize và convert sang webp
  const optimized = await sharp(buffer)
    .resize(800, 800, { fit: "cover", position: "centre" })
    .webp({ quality: 85 })
    .toBuffer();

  const filename = `${Date.now()}.webp`;
  const uploadDir = join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), optimized);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
