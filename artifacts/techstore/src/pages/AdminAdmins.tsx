import { useState } from "react";
import { useAdminListAdmins, useAdminCreateAdmin, useAdminDeleteAdmin, useAdminMe, getAdminListAdminsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function AdminAdmins() {
  const qc = useQueryClient();
  const { data: admins } = useAdminListAdmins();
  const { data: me } = useAdminMe();
  const create = useAdminCreateAdmin();
  const del = useAdminDeleteAdmin();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const inv = () => qc.invalidateQueries({ queryKey: getAdminListAdminsQueryKey() });

  const submit = () => {
    create.mutate({ data: form }, {
      onSuccess: () => { inv(); toast.success("تم إضافة المسؤول"); setOpen(false); setForm({ username: "", password: "" }); },
      onError: () => toast.error("اسم المستخدم موجود"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">إدارة المسؤولين</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 ml-2" /> إضافة مسؤول</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>إضافة مسؤول جديد</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>اسم المستخدم</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
              <div><Label>كلمة المرور</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={submit}>إضافة</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {admins?.map((a) => (
          <Card key={a.id} className="p-5 border-border flex items-center gap-4">
            <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">{a.username.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="font-bold flex items-center gap-2">{a.username} {me?.username === a.username && <ShieldCheck className="h-4 w-4 text-primary" />}</div>
              <div className="text-xs text-muted-foreground">مسؤول النظام</div>
            </div>
            {me?.username !== a.username && (
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm(`حذف ${a.username}؟`)) del.mutate({ id: a.id }, { onSuccess: () => { inv(); toast.success("تم الحذف"); } }); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
