export const dynamic = "force-dynamic";

import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateOrderStatus } from "@/app/actions/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  done: "Hoàn thành",
  cancelled: "Đã huỷ",
};

const STATUS_NEXT: Record<string, string> = {
  pending: "confirmed",
  confirmed: "shipping",
  shipping: "done",
};

const STATUS_COLOR: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "secondary",
  shipping: "default",
  done: "secondary",
  cancelled: "destructive",
};

export default async function AdminOrdersPage() {
  const allOrders = await db.select().from(orders).orderBy(orders.createdAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Đơn hàng</h1>
        <p className="text-muted-foreground text-sm">{allOrders.length} đơn hàng</p>
      </div>

      {allOrders.length === 0 ? (
        <p className="text-muted-foreground">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.customerName}</span>
                    <Badge variant={STATUS_COLOR[order.status ?? "pending"]}>
                      {STATUS_LABEL[order.status ?? "pending"]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.phone} · {order.address}</p>
                  {order.note && <p className="text-sm text-muted-foreground">Ghi chú: {order.note}</p>}
                  <p className="text-sm">
                    Thanh toán: <span className="font-medium">
                      {order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}
                    </span>
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-2">
                  <p className="font-semibold text-lg">
                    {Number(order.total).toLocaleString("vi-VN")}đ
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt!).toLocaleDateString("vi-VN", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                  <div className="flex gap-2 justify-end">
                    {STATUS_NEXT[order.status ?? ""] && (
                      <form action={updateOrderStatus.bind(null, order.id, STATUS_NEXT[order.status!])}>
                        <Button size="sm" type="submit">
                          → {STATUS_LABEL[STATUS_NEXT[order.status!]]}
                        </Button>
                      </form>
                    )}
                    {order.status !== "cancelled" && order.status !== "done" && (
                      <form action={updateOrderStatus.bind(null, order.id, "cancelled")}>
                        <Button size="sm" variant="destructive" type="submit">Huỷ</Button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
