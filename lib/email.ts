import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface SendOrderConfirmationParams {
  to: string;
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  address: string;
  paymentMethod: "cod" | "transfer";
}

export async function sendOrderConfirmation({
  to,
  orderId,
  customerName,
  items,
  total,
  address,
  paymentMethod,
}: SendOrderConfirmationParams) {
  if (!process.env.RESEND_API_KEY) return;

  const itemsHtml = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb">${i.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center">${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right">${(i.price * i.quantity).toLocaleString("vi-VN")}đ</td>
      </tr>`
    )
    .join("");

  const paymentText =
    paymentMethod === "cod"
      ? "Thanh toán khi nhận hàng (COD)"
      : `Chuyển khoản — Vui lòng chuyển <strong>${total.toLocaleString("vi-VN")}đ</strong> theo thông tin được gửi riêng`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Xác nhận đơn hàng #${orderId.slice(0, 8).toUpperCase()}`,
    html: `
<!DOCTYPE html>
<html lang="vi">
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
  <h2 style="color:#0f172a">Cảm ơn bạn đã đặt hàng! 🎉</h2>
  <p>Xin chào <strong>${customerName}</strong>,</p>
  <p>Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.</p>

  <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0">
    <p style="margin:0 0 8px 0;font-size:13px;color:#64748b">MÃ ĐƠN HÀNG</p>
    <p style="margin:0;font-size:18px;font-weight:700">#${orderId.slice(0, 8).toUpperCase()}</p>
  </div>

  <h3>Chi tiết đơn hàng</h3>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:#f1f5f9">
        <th style="padding:8px;text-align:left;font-size:13px">Sản phẩm</th>
        <th style="padding:8px;text-align:center;font-size:13px">SL</th>
        <th style="padding:8px;text-align:right;font-size:13px">Thành tiền</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="padding:12px 0;font-weight:700;text-align:right">Tổng cộng:</td>
        <td style="padding:12px 0;font-weight:700;text-align:right;font-size:18px">${total.toLocaleString("vi-VN")}đ</td>
      </tr>
    </tfoot>
  </table>

  <div style="border-top:1px solid #e5e7eb;padding-top:16px;margin-top:8px">
    <p><strong>Địa chỉ giao hàng:</strong> ${address}</p>
    <p><strong>Thanh toán:</strong> ${paymentText}</p>
  </div>

  <p style="color:#64748b;font-size:13px;margin-top:32px">
    Nếu có thắc mắc, vui lòng liên hệ qua Zalo hoặc reply email này.<br/>
    Trân trọng,<br/><strong>Blog & Yến Sào</strong>
  </p>
</body>
</html>`,
  });
}
