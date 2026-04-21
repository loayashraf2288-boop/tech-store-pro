import { useAdminListCustomers } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminCustomers() {
  const { data } = useAdminListCustomers();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">العملاء</h1>
      <Card className="border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-right px-4 py-3 font-medium">العميل</th>
              <th className="text-right px-4 py-3 font-medium">البريد</th>
              <th className="text-right px-4 py-3 font-medium">الطلبات</th>
              <th className="text-right px-4 py-3 font-medium">إجمالي المشتريات</th>
              <th className="text-right px-4 py-3 font-medium">انضم في</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/20">
                <td className="px-4 py-3 flex items-center gap-3">
                  <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/20 text-primary font-bold">{c.name.charAt(0)}</AvatarFallback></Avatar>
                  <span className="font-medium">{c.name}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3">{c.ordersCount}</td>
                <td className="px-4 py-3 font-bold text-primary">{c.totalSpent.toLocaleString()} ج.م</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(c.joinedAt).toLocaleDateString("ar-EG")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
