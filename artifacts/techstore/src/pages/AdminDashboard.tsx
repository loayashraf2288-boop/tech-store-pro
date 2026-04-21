import { useAdminStats, useAdminSalesChart } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Users, ShoppingBag, TrendingUp, DollarSign, AlertTriangle, ShieldCheck, HeadphonesIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const COLORS = ["#3B82F6", "#06B6D4", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444", "#EC4899"];

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new: { label: "جديد", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  processing: { label: "جاري التجهيز", cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  delivered: { label: "تم التوصيل", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "ملغي", cls: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function AdminDashboard() {
  const { data: stats } = useAdminStats();
  const { data: chart } = useAdminSalesChart();

  const kpis = [
    { label: "المنتجات", value: stats?.products.value ?? 0, change: stats?.products.change ?? 0, icon: Package, color: "from-blue-500 to-cyan-500" },
    { label: "العملاء", value: stats?.customers.value ?? 0, change: stats?.customers.change ?? 0, icon: Users, color: "from-purple-500 to-pink-500" },
    { label: "الطلبات", value: stats?.orders.value ?? 0, change: stats?.orders.change ?? 0, icon: ShoppingBag, color: "from-amber-500 to-orange-500" },
    { label: "الأرباح", value: `${(stats?.profit.value ?? 0).toLocaleString()} ج.م`, change: stats?.profit.change ?? 0, icon: TrendingUp, color: "from-emerald-500 to-green-500" },
    { label: "المبيعات", value: `${(stats?.sales.value ?? 0).toLocaleString()} ج.م`, change: stats?.sales.change ?? 0, icon: DollarSign, color: "from-rose-500 to-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5 relative overflow-hidden border-border bg-card">
            <div className={`absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br ${k.color} opacity-20 rounded-full blur-2xl`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${k.color}`}>
                  <k.icon className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">+{k.change}%</Badge>
              </div>
              <div className="text-2xl font-black">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
        <Card className="p-5 border-border">
          <h3 className="font-bold mb-4">توزيع المبيعات</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats?.salesByCategory ?? []} dataKey="percent" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {(stats?.salesByCategory ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <h3 className="font-bold mb-4">المبيعات خلال آخر 30 يوم</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart ?? []}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 border-border">
          <h3 className="font-bold mb-4">المنتجات الأكثر مبيعاً</h3>
          <div className="space-y-3">
            {stats?.topProducts?.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted/40 rounded-lg p-1 shrink-0"><img src={p.image} alt="" className="w-full h-full object-contain" /></div>
                <div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{p.name}</div><div className="text-xs text-muted-foreground">{p.soldCount} مبيع</div></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-border">
          <h3 className="font-bold mb-4">آخر الطلبات</h3>
          <div className="space-y-3">
            {stats?.recentOrders?.slice(0, 5).map((o) => {
              const st = STATUS_LABELS[o.status] ?? { label: o.status, cls: "bg-muted" };
              return (
                <div key={o.id} className="flex items-center justify-between gap-2 text-sm">
                  <div><div className="font-bold">{o.orderNumber}</div><div className="text-xs text-muted-foreground">{o.customerName}</div></div>
                  <Badge className={st.cls}>{st.label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 border-border">
          <h3 className="font-bold mb-4 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-400" /> تنبيهات المخزون</h3>
          <div className="space-y-3">
            {stats?.lowStock?.length ? stats.lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted/40 rounded-lg p-1 shrink-0"><img src={p.image} alt="" className="w-full h-full object-contain" /></div>
                <div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{p.name}</div><div className="text-xs text-amber-400">{p.stock} متبقي</div></div>
              </div>
            )) : <div className="text-sm text-muted-foreground">جميع المنتجات بمخزون كافٍ</div>}
          </div>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-3">
        <div className="flex items-center gap-2"><span>نسخة النظام</span><Badge variant="outline">v1.0.0</Badge></div>
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /><span>الحماية 100%</span></div>
        <div className="flex items-center gap-2"><HeadphonesIcon className="h-4 w-4 text-primary" /><span>الدعم الفني 24/7</span></div>
        <div>آخر دخول: {new Date().toLocaleString("ar-EG")}</div>
      </div>
    </div>
  );
}
