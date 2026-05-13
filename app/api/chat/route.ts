import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Load danh sách sản phẩm từ DB để chatbot biết
  const allProducts = await db
    .select({ name: products.name, price: products.price, description: products.description, stock: products.stock })
    .from(products)
    .where(eq(products.published, true));

  const productList = allProducts
    .map((p) => `- ${p.name}: ${Number(p.price).toLocaleString("vi-VN")}đ — ${p.description ?? ""}`)
    .join("\n");

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: `Bạn là trợ lý tư vấn shop thân thiện, am hiểu về các sản phẩm đang bán.

Nhiệm vụ của bạn:
- Tư vấn khách hàng về sản phẩm (công dụng, cách dùng, đối tượng phù hợp)
- Giới thiệu sản phẩm đang có trong shop
- Hướng dẫn cách đặt hàng
- Trả lời câu hỏi về giao hàng, thanh toán (COD hoặc chuyển khoản)
- Trả lời ngắn gọn, thân thiện, dùng tiếng Việt

Sản phẩm hiện có:
${productList || "Chưa có sản phẩm nào"}

Thông tin cửa hàng:
- Giao hàng toàn quốc
- Thanh toán: COD hoặc chuyển khoản
- Đặt hàng tại: /shop

Lưu ý: Chỉ tư vấn về sản phẩm trong shop. Nếu được hỏi về chủ đề khác, hãy lịch sự chuyển hướng về sản phẩm.`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
