import { Link } from "wouter";
import { Zap, ShieldCheck, Truck, HeadphonesIcon, CreditCard, AppWindow, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Features Bar */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">شحن سريع</h4>
              <p className="text-xs text-muted-foreground">توصيل خلال 24 ساعة</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">ضمان استرجاع</h4>
              <p className="text-xs text-muted-foreground">14 يوم للاسترجاع</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">دفع آمن</h4>
              <p className="text-xs text-muted-foreground">خيارات دفع متعددة</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <HeadphonesIcon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">دعم فني</h4>
              <p className="text-xs text-muted-foreground">متواجدون 24/7 لمساعدتك</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-primary/20 p-1.5 rounded-lg group-hover:bg-primary/30 transition-colors">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TECHSTORE
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              الوجهة الأولى لتسوق أحدث المنتجات التقنية والإلكترونيات بأفضل الأسعار في الشرق الأوسط.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">روابط سريعة</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">كل المنتجات</Link></li>
              <li><Link href="/account" className="hover:text-primary transition-colors">حسابي</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary transition-colors">المفضلة</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">خدمة العملاء</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/chat" className="hover:text-primary transition-colors">تواصل معنا</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">سياسة الاسترجاع</Link></li>
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">حمل التطبيق</h3>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-background border-border hover:bg-muted" asChild>
                <a href="https://github.com/loayashraf2288-boop/tech-store-pro/releases/download/v1.0/_TECH_STORE_19748700.apk" download>
                  <AppWindow className="w-6 h-6 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] leading-none text-muted-foreground">متاح لأجهزة</span>
                    <span className="font-bold leading-none mt-1">Android APK</span>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-background border-border opacity-50 cursor-not-allowed" disabled>
                <Apple className="w-6 h-6" />
                <div className="flex flex-col items-start">
                  <span className="text-[10px] leading-none">قريباً على</span>
                  <span className="font-bold leading-none mt-1">App Store</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © حقوق الملكية محفوظة لـ LOAY {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
