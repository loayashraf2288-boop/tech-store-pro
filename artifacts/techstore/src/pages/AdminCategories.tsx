import { useState } from "react";
import { useAdminListCategories, useAdminCreateCategory, getAdminListCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AdminCategories() {
  const qc = useQueryClient();
  const { data } = useAdminListCategories();
  const create = useAdminCreateCategory();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", icon: "Box" });

  const submit = () => {
    create.mutate(
      { data: form },
      { onSuccess: () => { qc.invalidateQueries({ queryKey: getAdminListCategoriesQueryKey() }); toast.success("تم إضافة القسم"); setOpen(false); setForm({ name: "", slug: "", icon: "Box" }); } },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">إدارة الأقسام</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 ml-2" /> إضافة قسم</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>إضافة قسم جديد</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>الاسم</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>المعرّف (Slug)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="phones" /></div>
              <div><Label>الأيقونة</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Smartphone" /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={submit}>إضافة</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-right px-4 py-3 font-medium">الاسم</th>
              <th className="text-right px-4 py-3 font-medium">المعرّف</th>
              <th className="text-right px-4 py-3 font-medium">الأيقونة</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.icon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
