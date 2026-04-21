import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetCart, useCreateOrder, getGetCartQueryKey, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, ShoppingBag, Truck, CreditCard, CheckCircle2, ShieldCheck, Phone } from "lucide-react";
import { toast } from "sonner";
import { getProductImage } from "@/lib/constants";

const GOVS = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "أسيوط", "الأقصر", "أسوان", "المنيا", "البحر الأحمر"];
const STEPS = [
  { id: 1, label: "السلة", icon: ShoppingBag },
  { id: 2, label: "بيانات التوصيل", icon: Truck },
  { id: 3, label: "الدفع", icon: CreditCard },
  { id: 4, label: "تأكيد الطلب", icon: CheckCircle2 },
];

export function Checkout() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { data: cart } = useGetCart();
  const createOrder = useCreateOrder();
  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "", address: "", apartment: "", landmark: "", floor: "", houseNumber: "",
    building: "", district: "", governorate: "", phone: "", notes: "", paymentMethod: "cod",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    createOrder.mutate(
      { data: form },
      {
        onSuccess: (res) => {
          setOrderNumber(res.orderNumber);
          qc.invalidateQueries({ queryKey: getGetCartQueryKey() });
          qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          setStep(4);
          toast.success("تم استلام طلبك بنجاح");
        },
        onError: () => toast.error("فشل إرسال الطلب — تحقق من الحقول المطلوبة"),
      },
    );
  };

  if ((!cart || cart.items.length === 0) && step !== 4) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">سلتك فارغة</h2>
        <Button asChild><Link href="/products">تصفح المنتجات</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 max-w-3xl mx-auto">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition ${step >= s.id ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className={`text-xs font-medium ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-card border border-border rounded-2xl p-6">
          {step === 1 && cart && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">مراجعة السلة ({cart.itemCount} منتج)</h2>
              {cart.items.map((it) => (
                <div key={it.id} className="flex gap-3 items-center pb-3 border-b border-border last:border-0">
                  <div className="w-16 h-16 rounded-lg bg-muted/40 p-2"><img src={it.image || getProductImage(it.productId)} alt="" className="w-full h-full object-contain" /></div>
                  <div className="flex-1"><div className="font-bold text-sm">{it.name}</div><div className="text-xs text-muted-foreground">الكمية: {it.quantity}</div></div>
                  <div className="font-bold">{(it.price * it.quantity).toLocaleString()} ج.م</div>
                </div>
              ))}
              <Button className="w-full mt-4 h-12" onClick={() => setStep(2)}>متابعة إلى بيانات التوصيل</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">بيانات التوصيل</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>الاسم بالكامل *</Label><Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} /></div>
                <div><Label>رقم الهاتف *</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
                <div className="md:col-span-2"><Label>العنوان *</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
                <div><Label>رقم الشقة</Label><Input value={form.apartment} onChange={(e) => set("apartment", e.target.value)} /></div>
                <div><Label>علامة مميزة</Label><Input value={form.landmark} onChange={(e) => set("landmark", e.target.value)} /></div>
                <div><Label>الدور</Label><Input value={form.floor} onChange={(e) => set("floor", e.target.value)} /></div>
                <div><Label>رقم المنزل</Label><Input value={form.houseNumber} onChange={(e) => set("houseNumber", e.target.value)} /></div>
                <div><Label>اسم العمارة</Label><Input value={form.building} onChange={(e) => set("building", e.target.value)} /></div>
                <div><Label>الحي / المنطقة</Label><Input value={form.district} onChange={(e) => set("district", e.target.value)} /></div>
                <div><Label>المحافظة *</Label>
                  <Select value={form.governorate} onValueChange={(v) => set("governorate", v)}>
                    <SelectTrigger><SelectValue placeholder="اختر المحافظة" /></SelectTrigger>
                    <SelectContent>{GOVS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2"><Label>ملاحظات</Label><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>السابق</Button>
                <Button className="flex-1 h-12" onClick={() => {
                  if (!form.fullName || !form.phone || !form.address || !form.governorate) { toast.error("يرجى ملء الحقول المطلوبة"); return; }
                  setStep(3);
                }}>متابعة إلى الدفع</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">طريقة الدفع</h2>
              <RadioGroup value={form.paymentMethod} onValueChange={(v) => set("paymentMethod", v)} className="space-y-3">
                <label className="flex items-center gap-3 border border-border rounded-xl p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="cod" />
                  <Truck className="h-5 w-5 text-primary" />
                  <div><div className="font-bold">الدفع عند الاستلام</div><div className="text-xs text-muted-foreground">ادفع نقداً عند استلام الطلب</div></div>
                </label>
                <label className="flex items-center gap-3 border border-border rounded-xl p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="card" />
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div><div className="font-bold">بطاقة ائتمان</div><div className="text-xs text-muted-foreground">Visa, MasterCard, Meeza</div></div>
                </label>
              </RadioGroup>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>السابق</Button>
                <Button className="flex-1 h-12 font-bold" onClick={submit} disabled={createOrder.isPending}>تأكيد الطلب</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-10 space-y-5">
              <div className="w-20 h-20 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-black">تم استلام طلبك!</h2>
              <p className="text-muted-foreground">شكراً لتسوقك من TECHSTORE</p>
              {orderNumber && <p className="font-bold text-lg">رقم الطلب: <span className="text-primary">{orderNumber}</span></p>}
              <div className="flex gap-3 justify-center">
                <Button asChild><Link href="/account">تتبع الطلبات</Link></Button>
                <Button variant="outline" asChild><Link href="/">متابعة التسوق</Link></Button>
              </div>
            </div>
          )}
        </div>

        {step < 4 && cart && (
          <aside className="space-y-4 h-fit lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <h3 className="font-bold">ملخص الطلب</h3>
              <div className="flex justify-between text-sm text-muted-foreground"><span>المنتجات ({cart.itemCount})</span><span>{cart.subtotal.toLocaleString()} ج.م</span></div>
              {cart.discount > 0 && <div className="flex justify-between text-sm text-emerald-400"><span>الخصم</span><span>-{cart.discount.toLocaleString()}</span></div>}
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>الإجمالي</span><span className="text-primary">{cart.total.toLocaleString()} ج.م</span></div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3 text-sm">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><span>دفع آمن ومشفّر</span></div>
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /><span>توصيل سريع لجميع المحافظات</span></div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 text-sm space-y-2">
              <h4 className="font-bold flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> تحتاج مساعدة؟</h4>
              <p className="text-muted-foreground">فريق الدعم متاح 24/7</p>
              <Button variant="outline" className="w-full" asChild><Link href="/chat">تواصل معنا</Link></Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
