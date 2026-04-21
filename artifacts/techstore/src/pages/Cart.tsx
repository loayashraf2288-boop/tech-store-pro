import { useState } from "react";
import { Link } from "wouter";
import {
  useGetCart, useUpdateCartItem, useRemoveCartItem, useApplyCoupon, useClearCart,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, Ticket, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getProductImage } from "@/lib/constants";

export function Cart() {
  const qc = useQueryClient();
  const { data: cart } = useGetCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const applyCoupon = useApplyCoupon();
  const clearCart = useClearCart();
  const [code, setCode] = useState("");

  const inv = () => qc.invalidateQueries({ queryKey: getGetCartQueryKey() });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">سلتك فارغة</h2>
        <p className="text-muted-foreground mb-6">ابدأ التسوق وأضف منتجاتك المفضلة</p>
        <Button asChild size="lg"><Link href="/products">تصفح المنتجات</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-6">سلة المشتريات</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4">
              <div className="w-24 h-24 bg-muted/40 rounded-xl overflow-hidden p-3">
                <img src={item.image || getProductImage(item.productId)} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    {(item.color || item.storage) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.color}{item.color && item.storage ? " • " : ""}{item.storage}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem.mutate({ itemId: item.id }, { onSuccess: () => { inv(); toast.success("تم الحذف"); } })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateItem.mutate({ itemId: item.id, data: { quantity: Math.max(1, item.quantity - 1) } }, { onSuccess: inv })}><Minus className="h-3 w-3" /></Button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateItem.mutate({ itemId: item.id, data: { quantity: item.quantity + 1 } }, { onSuccess: inv })}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="font-black text-primary">{(item.price * item.quantity).toLocaleString()} ج.م</div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => clearCart.mutate(undefined, { onSuccess: () => { inv(); toast.success("تم تفريغ السلة"); } })}>إفراغ السلة</Button>
        </div>

        <aside className="bg-card border border-border rounded-2xl p-6 h-fit space-y-4 lg:sticky lg:top-24">
          <h3 className="font-bold text-lg">ملخص الطلب</h3>
          <form onSubmit={(e) => { e.preventDefault(); applyCoupon.mutate({ data: { code } }, { onSuccess: () => { inv(); toast.success("تم تطبيق الكوبون"); setCode(""); }, onError: () => toast.error("كود غير صالح") }); }} className="flex gap-2">
            <div className="relative flex-1">
              <Ticket className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="كود الخصم" className="pr-9 bg-muted/40" />
            </div>
            <Button type="submit" variant="secondary" disabled={!code.trim()}>تطبيق</Button>
          </form>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>المجموع الفرعي</span><span>{cart.subtotal.toLocaleString()} ج.م</span></div>
            {cart.discount > 0 && <div className="flex justify-between text-emerald-400"><span>الخصم{cart.couponCode ? ` (${cart.couponCode})` : ""}</span><span>-{cart.discount.toLocaleString()} ج.م</span></div>}
            <div className="flex justify-between text-muted-foreground"><span>الشحن</span><span>{(cart.total - cart.subtotal + cart.discount).toLocaleString()} ج.م</span></div>
            <Separator />
            <div className="flex justify-between text-lg font-bold pt-2"><span>الإجمالي</span><span className="text-primary">{cart.total.toLocaleString()} ج.م</span></div>
          </div>
          <Button asChild size="lg" className="w-full h-12 font-bold"><Link href="/checkout">إتمام الطلب <ArrowLeft className="h-4 w-4 mr-2" /></Link></Button>
        </aside>
      </div>
    </div>
  );
}
