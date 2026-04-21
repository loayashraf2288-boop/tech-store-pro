import { Link } from "wouter";
import { useGetMe, useListOrders, useListProducts } from "@workspace/api-client-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { LayoutDashboard, ShoppingBag, MapPin, Heart, Ticket, CreditCard, Bell, HeadphonesIcon, Settings, LogOut, Truck, ShieldCheck } from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/account" },
  { icon: ShoppingBag, label: "طلباتي", href: "/account" },
  { icon: MapPin, label: "عناويني", href: "/account" },
  { icon: Heart, label: "المفضلة", href: "/wishlist" },
  { icon: Ticket, label: "كوبونات الخصم", href: "/account" },
  { icon: CreditCard, label: "طرق الدفع", href: "/account" },
  { icon: Bell, label: "الإشعارات", href: "/account" },
  { icon: HeadphonesIcon, label: "الدعم والمساعدة", href: "/chat" },
  { icon: Settings, label: "الإعدادات", href: "/account" },
];

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new: { label: "جديد", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  processing: { label: "قيد التجهيز", cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  delivered: { label: "تم التوصيل", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "ملغي", cls: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function Account() {
  const { data: me } = useGetMe();
  const { data: orders } = useListOrders();
  const { data: youMayLike } = useListProducts({ limit: 4 });

  const stats = me?.stats ?? { total: 0, processing: 0, delivered: 0, totalSpent: 0 };

  return (
    <div className="container mx-auto px-4 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
      <aside className="space-y-2">
        <div className="bg-card border border-border rounded-2xl p-5 mb-3">
          <Avatar className="h-16 w-16 mb-3"><AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">{me?.name?.charAt(0) ?? "ع"}</AvatarFallback></Avatar>
          <h3 className="font-bold">{me?.name ?? "زبون TECHSTORE"}</h3>
          <p className="text-xs text-muted-foreground mt-1">عضو منذ {me ? new Date(me.joinedAt).toLocaleDateString("ar-EG") : "—"}</p>
        </div>
        {NAV.map((n) => (
          <Link key={n.label} href={n.href}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer">
              <n.icon className="h-4 w-4" /><span className="text-sm font-medium">{n.label}</span>
            </div>
          </Link>
        ))}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer">
          <LogOut className="h-4 w-4" /><span className="text-sm font-medium">تسجيل خروج</span>
        </div>
      </aside>

      <div className="space-y-8">
        <div className="bg-gradient-to-l from-primary/20 via-primary/10 to-transparent border border-border rounded-3xl p-6 flex items-center gap-5 flex-wrap">
          <Avatar className="h-20 w-20"><AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{me?.name?.charAt(0) ?? "ع"}</AvatarFallback></Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-black">مرحباً بك، {me?.name ?? "عميلنا العزيز"}</h1>
            <p className="text-sm text-muted-foreground mt-1">عضو منذ {me ? new Date(me.joinedAt).toLocaleDateString("ar-EG") : "—"}</p>
          </div>
          <Button variant="outline">تعديل الملف الشخصي</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="إجمالي الطلبات" value={stats.total} icon={ShoppingBag} />
          <StatCard label="قيد التوصيل" value={stats.processing} icon={Truck} />
          <StatCard label="تم التوصيل" value={stats.delivered} icon={ShieldCheck} />
          <StatCard label="المبلغ الإجمالي" value={`${stats.totalSpent.toLocaleString()} ج.م`} icon={CreditCard} />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">آخر الطلبات</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-right px-4 py-3 font-medium">رقم الطلب</th>
                  <th className="text-right px-4 py-3 font-medium">التاريخ</th>
                  <th className="text-right px-4 py-3 font-medium">عدد المنتجات</th>
                  <th className="text-right px-4 py-3 font-medium">المبلغ</th>
                  <th className="text-right px-4 py-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {orders?.length ? orders.slice(0, 6).map((o) => {
                  const st = STATUS_LABELS[o.status] ?? { label: o.status, cls: "bg-muted text-muted-foreground" };
                  return (
                    <tr key={o.id} className="border-t border-border">
                      <td className="px-4 py-3 font-bold">{o.orderNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</td>
                      <td className="px-4 py-3">{o.itemCount}</td>
                      <td className="px-4 py-3 font-bold">{o.total.toLocaleString()} ج.م</td>
                      <td className="px-4 py-3"><Badge className={st.cls}>{st.label}</Badge></td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">لا توجد طلبات بعد</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">منتجات قد تعجبك</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {youMayLike?.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
      <div className="bg-primary/10 p-3 rounded-xl"><Icon className="h-6 w-6 text-primary" /></div>
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-black text-xl mt-1">{value}</div></div>
    </div>
  );
}
