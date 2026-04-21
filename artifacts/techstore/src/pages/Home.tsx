import { useListBanners, useListCategories, useListProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, CreditCard, HeadphonesIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { HERO_BG_FALLBACK } from "@/lib/constants";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Home() {
  const { data: banners } = useListBanners();
  const { data: categories } = useListCategories();
  const { data: products } = useListProducts({ limit: 8 });
  
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (!banners?.length) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners?.length]);

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] w-full overflow-hidden bg-background">
        {banners?.length ? (
          <>
            {banners.map((banner, index) => (
              <div 
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent z-10" />
                <img 
                  src={banner.imageUrl || HERO_BG_FALLBACK} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 container mx-auto px-4 flex items-center">
                  <div className="max-w-2xl flex flex-col gap-4 items-start">
                    {banner.discount && (
                      <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded-full text-sm border border-primary/30">
                        {banner.discount}
                      </span>
                    )}
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                      {banner.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300">
                      {banner.subtitle}
                    </p>
                    <Button size="lg" className="mt-4 text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/20 font-bold" asChild>
                      <Link href="/products">{banner.ctaText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {banners.map((_, idx) => (
                <button 
                  key={idx} 
                  className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentBanner ? "bg-primary w-8" : "bg-white/50"}`}
                  onClick={() => setCurrentBanner(idx)}
                />
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background/20 backdrop-blur-md hover:bg-background/40 text-white rounded-full w-12 h-12 hidden md:flex"
              onClick={() => setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background/20 backdrop-blur-md hover:bg-background/40 text-white rounded-full w-12 h-12 hidden md:flex"
              onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </>
        ) : (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-primary rounded-full inline-block" />
          تسوق حسب القسم
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories?.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-card border border-border hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <span className="text-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                    {/* Fallback to simple circle if no actual icon component is available */}
                    <div className="w-8 h-8 rounded-full border-2 border-primary" />
                  </span>
                </div>
                <span className="font-medium text-sm">{cat.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full inline-block" />
            أحدث المنتجات
          </h2>
          <Button variant="ghost" className="gap-2 text-primary hover:text-primary hover:bg-primary/10" asChild>
            <Link href="/products">
              عرض المزيد
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 mb-12">
        <div className="bg-card border border-border rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">شحن سريع</h4>
              <p className="text-sm text-muted-foreground mt-1">توصيل خلال 24 ساعة</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">ضمان استرجاع</h4>
              <p className="text-sm text-muted-foreground mt-1">14 يوم للاسترجاع</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">دفع آمن</h4>
              <p className="text-sm text-muted-foreground mt-1">خيارات دفع متعددة</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <HeadphonesIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">دعم فني</h4>
              <p className="text-sm text-muted-foreground mt-1">متواجدون 24/7 لمساعدتك</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
