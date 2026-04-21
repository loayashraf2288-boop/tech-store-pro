import { useState } from "react";
import { useAdminListCoupons, useAdminCreateCoupon, getAdminListCouponsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AdminCoupons() {
  const qc = useQueryClient();
  const { data } = useAdminListCoupons();
  const create = useAdminCreateCoupon();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", percentOff: 10 });

  const submit = () => {
    create.mutate(
      { data: { code: form.code.toUpperCase(), percentOff: Number(form.percentOff) } },
      { onSuccess: () => { qc.invalidateQueries({ queryKey: getAdminListCouponsQueryKey() }); toast.success("تم إضافة الكوبون"); setOpen(false); setForm({ code: "", percentOff: 10 }); }, onError: () => toast.error("الكود موجود مسبقاً") },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">كوبونات الخصم</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 ml-2" /> إضافة كوبون</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>إضافة كوبون جديد</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>الكود</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="WELCOME10" /></div>
              <div><Label>نسبة الخصم (%)</Label><Input type="number" value={form.percentOff} onChange={(e) => setForm({ ...form, percentOff: +e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={submit}>إضافة</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {data?.map((c) => (
          <Card key={c.id} className="p-5 border-border bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <Badge className={c.active ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}>{c.active ? "نشط" : "متوقف"}</Badge>
              <span className="text-3xl font-black text-primary">{c.percentOff}%</span>
            </div>
            <div className="font-mono font-black text-lg tracking-wider">{c.code}</div>
            <div className="text-xs text-muted-foreground mt-2">خصم {c.percentOff}% على كامل الطلب</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
