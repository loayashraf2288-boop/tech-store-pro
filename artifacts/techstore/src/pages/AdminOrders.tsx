import { useAdminListOrders, useAdminUpdateOrderStatus, getAdminListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new: { label: "جديد", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  processing: { label: "جاري التجهيز", cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  delivered: { label: "تم التوصيل", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "ملغي", cls: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders } = useAdminListOrders();
  const update = useAdminUpdateOrderStatus();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">إدارة الطلبات</h1>
      <Card className="border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-right px-4 py-3 font-medium">رقم الطلب</th>
              <th className="text-right px-4 py-3 font-medium">العميل</th>
              <th className="text-right px-4 py-3 font-medium">المنتجات</th>
              <th className="text-right px-4 py-3 font-medium">المبلغ</th>
              <th className="text-right px-4 py-3 font-medium">التاريخ</th>
              <th className="text-right px-4 py-3 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o) => {
              const st = STATUS_LABELS[o.status] ?? { label: o.status, cls: "bg-muted" };
              return (
                <tr key={o.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold">{o.orderNumber}</td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3">{o.itemCount}</td>
                  <td className="px-4 py-3 font-bold text-primary">{o.total.toLocaleString()} ج.م</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</td>
                  <td className="px-4 py-3">
                    <Select value={o.status} onValueChange={(v) => update.mutate({ id: o.id, data: { status: v as never } }, { onSuccess: () => { qc.invalidateQueries({ queryKey: getAdminListOrdersQueryKey() }); toast.success("تم تحديث الحالة"); } })}>
                      <SelectTrigger className="w-36 h-8"><SelectValue><Badge className={st.cls}>{st.label}</Badge></SelectValue></SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([v, s]) => <SelectItem key={v} value={v}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              );
            })}
            {!orders?.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">لا توجد طلبات</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
