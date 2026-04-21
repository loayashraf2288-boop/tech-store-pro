import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, Ticket } from "lucide-react";
import { Cart, useUpdateCartItem, useRemoveCartItem, useApplyCoupon, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { getProductImage } from "@/lib/constants";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart?: Cart;
}

export function CartDrawer({ open, onOpenChange, cart }: CartDrawerProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const applyCoupon = useApplyCoupon();

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate(
      { itemId, data: { quantity: newQuantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        },
      }
    );
  };

  const handleRemove = (itemId: string) => {
    removeItem.mutate(
      { itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("تم حذف المنتج من السلة");
        },
      }
    );
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    applyCoupon.mutate(
      { data: { code: couponCode } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("تم تطبيق كوبون الخصم بنجاح");
          setCouponCode("");
        },
        onError: () => {
          toast.error("كوبون الخصم غير صالح أو منتهي");
        }
      }
    );
  };

  const handleCheckout = () => {
    onOpenChange(false);
    setLocation("/checkout");
  };

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border/50 text-right">
          <SheetTitle className="text-xl font-bold">سلة المشتريات</SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-bold">سلة المشتريات فارغة</h3>
            <p className="text-muted-foreground">تصفح منتجاتنا وأضف ما يعجبك إلى السلة</p>
            <Button className="mt-4" onClick={() => { onOpenChange(false); setLocation("/products"); }}>
              متابعة التسوق
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0 border border-border">
                      <img 
                        src={item.image || getProductImage(item.productId)} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                          {(item.color || item.storage) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.color} {item.storage ? `• ${item.storage}` : ''}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-sm shrink-0 whitespace-nowrap">{item.price} ج.م</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-md bg-background">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none rounded-r-md text-muted-foreground hover:text-foreground"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updateItem.isPending}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="h-8 w-10 flex items-center justify-center text-sm font-medium border-x border-border">
                            {item.quantity}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none rounded-l-md text-muted-foreground hover:text-foreground"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updateItem.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemove(item.id)}
                          disabled={removeItem.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 bg-card border-t border-border/50 space-y-4">
              {/* Coupon */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="كود الخصم" 
                    className="pl-4 pr-9 bg-muted/50 border-border"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" disabled={!couponCode.trim() || applyCoupon.isPending}>
                  تطبيق
                </Button>
              </form>

              <Separator className="bg-border/50" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span>{cart.subtotal} ج.م</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>الخصم {cart.couponCode ? `(${cart.couponCode})` : ''}</span>
                    <span>-{cart.discount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/50 mt-2">
                  <span>الإجمالي</span>
                  <span>{cart.total} ج.م</span>
                </div>
              </div>

              <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" onClick={handleCheckout}>
                إتمام الطلب
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Need to define ShoppingCart here as it was missing from imports
import { ShoppingCart } from "lucide-react";
