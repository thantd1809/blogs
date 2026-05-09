import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { products } from "./schema";

async function seed() {
  await db.insert(products).values([
    {
      id: "yen-tinh-che-100g",
      name: "Yến tinh chế 100g",
      slug: "yen-tinh-che-100g",
      description: "Yến sào tinh chế cao cấp, đã làm sạch lông và tạp chất. Thích hợp nấu chè yến, súp yến cho cả gia đình.",
      price: "850000",
      stock: 50,
      images: [],
      category: "yen-tinh-che",
      published: true,
    },
    {
      id: "yen-thu-cong-50g",
      name: "Yến thô tự nhiên 50g",
      slug: "yen-thu-cong-50g",
      description: "Yến sào thô nguyên chất từ đảo, chưa qua xử lý, giữ nguyên dưỡng chất tự nhiên.",
      price: "650000",
      stock: 30,
      images: [],
      category: "yen-tho",
      published: true,
    },
    {
      id: "nuoc-yen-dong-chai",
      name: "Nước yến đóng chai (6 chai)",
      slug: "nuoc-yen-dong-chai",
      description: "Nước yến chưng sẵn, tiện lợi, không chất bảo quản. Hộp 6 chai x 70ml.",
      price: "320000",
      stock: 100,
      images: [],
      category: "nuoc-yen",
      published: true,
    },
  ]).onConflictDoNothing();

  console.log("Seed xong!");
  process.exit(0);
}

seed();
