import { useState } from "react";
import {
  useAdminListProducts, useAdminCreateProduct, useAdminUpdateProduct, useAdminDeleteProduct,
  useAdminListCategories, getAdminListProductsQueryKey, type Product,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  id?: number;
  name: string; description: string; price: number; originalPrice?: number;
  categoryId: number; stock: number; isNew: boolean; images: string;
  storageOptions: string;
}

const empty: FormData = { name: "", description: "", price: 0, categoryId: 0, stock: 10, isNew: false, images: "", storageOptions: "" };

export function AdminProducts() {
  const qc = useQueryClient();
  const { data: products } = useAdminListProducts();
  const { data: categories } = useAdminListCategories();
  const create = useAdminCreateProduct();
  const update = useAdminUpdateProduct();
  const del = useAdminDeleteProduct();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(empty);

  const inv = () => qc.invalidateQueries({ queryKey: getAdminListProductsQueryKey() });

  const submit = () => {
    const payload = {
      name: form.name, description: form.description, price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      categoryId: Number(form.categoryId), stock: Number(form.stock), isNew: form.isNew,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      storageOptions: form.storageOptions.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (form.id) {
      update.mutate({ id: form.id, data: payload }, { onSuccess: () => { inv(); toast.success("تم التحديث"); setOpen(false); } });
    } else {
      create.mutate({ data: payload }, { onSuccess: () => { inv(); toast.success("تم إضافة المنتج"); setOpen(false); } });
    }
  };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id, name: p.name, description: p.shortDescription ?? "", price: p.price,
      originalPrice: p.originalPrice ?? undefined, categoryId: p.categoryId, stock: p.stock,
      isNew: !!p.isNew, images: (p.images ?? []).join("\n"), storageOptions: "",
    });
    setOpen(true);
  };

  const openCreate = () => { setForm(empty); setOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">إدارة المنتجات</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openCreate}><Plus className="h-4 w-4 ml-2" /> إضافة منتج</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{form.id ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle></DialogHeader>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><Label>الاسم</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>الوصف</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>السعر (ج.م)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
              <div><Label>السعر الأصلي (اختياري)</Label><Input type="number" value={form.originalPrice ?? ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? +e.target.value : undefined })} /></div>
              <div><Label>القسم</Label>
                <Select value={String(form.categoryId)} onValueChange={(v) => setForm({ ...form, categoryId: Number(v) })}>
                  <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                  <SelectContent>{categories?.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>المخزون</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} /></div>
              <div className="md:col-span-2"><Label>الصور (رابط لكل سطر)</Label><Textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} /></div>
              <div className="md:col-span-2"><Label>خيارات السعة (مفصولة بفاصلة)</Label><Input value={form.storageOptions} onChange={(e) => setForm({ ...form, storageOptions: e.target.value })} /></div>
              <div className="md:col-span-2 flex items-center gap-2"><Switch checked={form.isNew} onCheckedChange={(v) => setForm({ ...form, isNew: v })} /><Label>منتج جديد</Label></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button onClick={submit} disabled={create.isPending || update.isPending}>{form.id ? "تحديث" : "إضافة"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-right px-4 py-3 font-medium">المنتج</th>
              <th className="text-right px-4 py-3 font-medium">السعر</th>
              <th className="text-right px-4 py-3 font-medium">المخزون</th>
              <th className="text-right px-4 py-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-muted/20">
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted/40 rounded-lg p-1 shrink-0"><img src={p.images?.[0]} alt="" className="w-full h-full object-contain" /></div>
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="px-4 py-3 font-bold text-primary">{p.price.toLocaleString()} ج.م</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm(`حذف ${p.name}؟`)) del.mutate({ id: p.id }, { onSuccess: () => { inv(); toast.success("تم الحذف"); } }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {!products?.length && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">لا توجد منتجات</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
