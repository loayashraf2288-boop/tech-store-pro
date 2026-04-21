import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import {
  categoriesTable, productsTable, bannersTable, adminsTable,
  couponsTable, customersTable, reviewsTable, ordersTable,
} from "@workspace/db/schema";

async function isEmpty<T>(rows: T[]): Promise<boolean> { return rows.length === 0; }

async function main() {
  const cats = await db.select().from(categoriesTable);
  if (await isEmpty(cats)) {
    await db.insert(categoriesTable).values([
      { name: "هواتف", slug: "phones", icon: "Smartphone" },
      { name: "لابتوبات", slug: "laptops", icon: "Laptop" },
      { name: "سماعات", slug: "headphones", icon: "Headphones" },
      { name: "شاشات", slug: "monitors", icon: "Monitor" },
      { name: "أجهزة لوحية", slug: "tablets", icon: "Tablet" },
      { name: "إكسسوارات", slug: "accessories", icon: "Cable" },
      { name: "ساعات ذكية", slug: "watches", icon: "Watch" },
    ]);
  }

  const banners = await db.select().from(bannersTable);
  if (await isEmpty(banners)) {
    await db.insert(bannersTable).values([
      { title: "عروض الصيف الكبرى", subtitle: "خصومات تصل إلى 50% على أفضل المنتجات التقنية", discount: "50%", ctaText: "تسوق الآن", imageUrl: "" },
      { title: "iPhone 15 Pro Max الجديد", subtitle: "احصل على أحدث هواتف Apple بسعر منافس وضمان أصلي", discount: "15%", ctaText: "اطلب الآن", imageUrl: "" },
      { title: "أفضل اللابتوبات للألعاب", subtitle: "تشكيلة مميزة من أجهزة Gaming بأداء استثنائي", ctaText: "اكتشف المزيد", imageUrl: "" },
    ]);
  }

  const allCats = await db.select().from(categoriesTable);
  const slug = (s: string) => allCats.find((c) => c.slug === s)!.id;

  const products = await db.select().from(productsTable);
  if (await isEmpty(products)) {
    const data = [
      { name: "iPhone 15 Pro Max 256GB", price: 52000, originalPrice: 60000, categoryId: slug("phones"), rating: 4.9, reviewCount: 234, isNew: true, isBestSeller: true, stock: 12, soldCount: 152,
        shortDescription: "أحدث هواتف Apple مع شريحة A17 Pro وكاميرا تيليفوتو 5x وتصميم تيتانيوم.",
        description: "iPhone 15 Pro Max يقدم تجربة متكاملة بشاشة Super Retina XDR مقاس 6.7 إنش، شريحة A17 Pro الثورية، نظام كاميرات احترافي مع تيليفوتو 5x، وهيكل من التيتانيوم خفيف ومتين.",
        colors: [{ name: "تيتانيوم طبيعي", hex: "#8E8E93" }, { name: "تيتانيوم أزرق", hex: "#3B5C7A" }, { name: "تيتانيوم أبيض", hex: "#F5F5F0" }, { name: "تيتانيوم أسود", hex: "#1A1A1A" }],
        storageOptions: ["256GB", "512GB", "1TB"] },
      { name: "Samsung Galaxy S24 Ultra", price: 48000, originalPrice: 55000, categoryId: slug("phones"), rating: 4.8, reviewCount: 189, isBestSeller: true, stock: 8, soldCount: 130,
        shortDescription: "هاتف سامسونج الرائد مع قلم S Pen وكاميرا 200 ميجابكسل.",
        description: "Galaxy S24 Ultra يجمع بين قوة معالج Snapdragon 8 Gen 3 وذكاء اصطناعي متقدم، مع شاشة AMOLED مذهلة وكاميرا 200MP.",
        colors: [{ name: "أسود", hex: "#1A1A1A" }, { name: "بنفسجي", hex: "#7A4D8E" }],
        storageOptions: ["256GB", "512GB", "1TB"] },
      { name: "MacBook Pro 14 M3 Pro", price: 95000, originalPrice: 110000, categoryId: slug("laptops"), rating: 4.9, reviewCount: 98, isNew: true, stock: 5, soldCount: 70,
        shortDescription: "أداء استثنائي مع شريحة M3 Pro وشاشة Liquid Retina XDR.",
        description: "MacBook Pro 14 بشريحة M3 Pro يوفر أداءً استثنائياً للمحترفين والمصممين والمطورين.",
        colors: [{ name: "فضي", hex: "#C0C0C0" }, { name: "رمادي فلكي", hex: "#3A3A3C" }],
        storageOptions: ["512GB", "1TB", "2TB"] },
      { name: "ASUS ROG Strix G16 Gaming", price: 65000, originalPrice: 75000, categoryId: slug("laptops"), rating: 4.7, reviewCount: 76, stock: 6, soldCount: 55,
        shortDescription: "لابتوب ألعاب بمعالج Intel i9 وبطاقة RTX 4070.",
        description: "ASUS ROG Strix G16 مصمم للألعاب الاحترافية مع تبريد متقدم وشاشة 165Hz.",
        colors: [{ name: "أسود", hex: "#1A1A1A" }],
        storageOptions: ["1TB"] },
      { name: "Sony WH-1000XM5 سماعة", price: 14500, originalPrice: 18000, categoryId: slug("headphones"), rating: 4.9, reviewCount: 412, isBestSeller: true, stock: 18, soldCount: 280,
        shortDescription: "أفضل سماعة عازلة للضوضاء في فئتها مع جودة صوت ممتازة.",
        description: "Sony WH-1000XM5 تمنحك تجربة صوتية لا مثيل لها مع تقنية إلغاء الضوضاء الرائدة وعمر بطارية حتى 30 ساعة.",
        colors: [{ name: "أسود", hex: "#1A1A1A" }, { name: "فضي", hex: "#C0C0C0" }],
        storageOptions: [] },
      { name: "AirPods Pro 2", price: 9800, originalPrice: 12000, categoryId: slug("headphones"), rating: 4.8, reviewCount: 521, isBestSeller: true, stock: 25, soldCount: 410,
        shortDescription: "سماعات Apple اللاسلكية مع إلغاء ضوضاء فعّال وجودة صوت محسّنة.",
        description: "AirPods Pro 2 بشريحة H2 الجديدة، إلغاء ضوضاء أفضل بمرتين، ووضع شفافية تكيفي.",
        colors: [{ name: "أبيض", hex: "#FFFFFF" }],
        storageOptions: [] },
      { name: "LG UltraGear 27 شاشة 4K", price: 22000, originalPrice: 28000, categoryId: slug("monitors"), rating: 4.6, reviewCount: 64, isNew: true, stock: 4, soldCount: 28,
        shortDescription: "شاشة ألعاب 4K 144Hz بألوان دقيقة وزمن استجابة 1ms.",
        description: "LG UltraGear 27GP950 توفر تجربة ألعاب احترافية بدقة 4K ومعدل تحديث 144Hz.",
        colors: [{ name: "أسود", hex: "#1A1A1A" }],
        storageOptions: [] },
      { name: "iPad Pro 12.9 M2", price: 42000, originalPrice: 48000, categoryId: slug("tablets"), rating: 4.8, reviewCount: 142, stock: 9, soldCount: 88,
        shortDescription: "تابلت Apple القوي مع شاشة Liquid Retina XDR وشريحة M2.",
        description: "iPad Pro 12.9 بشريحة M2 يقدم أداء لابتوب في حجم تابلت مع دعم Apple Pencil 2.",
        colors: [{ name: "فضي", hex: "#C0C0C0" }, { name: "رمادي فلكي", hex: "#3A3A3C" }],
        storageOptions: ["128GB", "256GB", "512GB", "1TB"] },
      { name: "Apple Watch Series 9", price: 16500, originalPrice: 19500, categoryId: slug("watches"), rating: 4.7, reviewCount: 198, isNew: true, stock: 14, soldCount: 102,
        shortDescription: "ساعة آبل الذكية مع شاشة أكثر سطوعاً وميزات صحية متقدمة.",
        description: "Apple Watch Series 9 مع شريحة S9 SiP الجديدة وميزة Double Tap الذكية.",
        colors: [{ name: "ميدنايت", hex: "#1A1A2E" }, { name: "ستارلايت", hex: "#F0EDE5" }, { name: "بينك", hex: "#F4C2C2" }],
        storageOptions: ["41mm", "45mm"] },
      { name: "Logitech MX Master 3S ماوس", price: 4200, originalPrice: 5500, categoryId: slug("accessories"), rating: 4.9, reviewCount: 305, stock: 30, soldCount: 220,
        shortDescription: "أفضل ماوس لاسلكي للإنتاجية والعمل المكتبي.",
        description: "Logitech MX Master 3S بدقة 8000 DPI وعجلة تمرير ذكية وضوضاء نقر منخفضة.",
        colors: [{ name: "رمادي", hex: "#5A5A5A" }, { name: "أبيض", hex: "#F5F5F5" }],
        storageOptions: [] },
      { name: "Samsung Galaxy Tab S9 Ultra", price: 38000, originalPrice: 44000, categoryId: slug("tablets"), rating: 4.6, reviewCount: 76, stock: 7, soldCount: 42,
        shortDescription: "تابلت Samsung الفاخر مع شاشة AMOLED 14.6 بوصة.",
        description: "Galaxy Tab S9 Ultra تابلت ضخم بشاشة AMOLED مع قلم S Pen وأداء قوي.",
        colors: [{ name: "غرافيت", hex: "#3A3A3A" }, { name: "بيج", hex: "#D2B48C" }],
        storageOptions: ["256GB", "512GB"] },
      { name: "Anker PowerCore 26800 شاحن متنقل", price: 1800, originalPrice: 2400, categoryId: slug("accessories"), rating: 4.8, reviewCount: 612, isBestSeller: true, stock: 45, soldCount: 530,
        shortDescription: "بطارية متنقلة عالية السعة لشحن أجهزتك في أي مكان.",
        description: "Anker PowerCore 26800mAh تشحن الهواتف 6 مرات والتابلت مرتين.",
        colors: [{ name: "أسود", hex: "#1A1A1A" }],
        storageOptions: [] },
    ];
    await db.insert(productsTable).values(data);
  }

  const allProducts = await db.select().from(productsTable);

  const reviews = await db.select().from(reviewsTable);
  if (await isEmpty(reviews) && allProducts.length) {
    const reviewSamples = [
      { author: "محمود السيد", rating: 5, comment: "منتج رائع جداً، تجربة شراء ممتازة والشحن كان سريع." },
      { author: "سارة أحمد", rating: 5, comment: "الجودة فوق الممتازة والسعر مناسب جداً مقارنة بالمتاجر الأخرى." },
      { author: "كريم محمد", rating: 4, comment: "المنتج يستحق كل قرش، التغليف كان احترافي." },
      { author: "نور حسن", rating: 5, comment: "أنصح به بشدة، خدمة العملاء كانت متعاونة." },
      { author: "أحمد فاروق", rating: 4, comment: "ممتاز ولكن أتمنى لو كان فيه خيارات ألوان أكثر." },
    ];
    const rows = [];
    for (const p of allProducts.slice(0, 8)) {
      for (const s of reviewSamples) {
        rows.push({ productId: p.id, author: s.author, avatar: "", rating: s.rating, comment: s.comment });
      }
    }
    if (rows.length) await db.insert(reviewsTable).values(rows);
  }

  const admins = await db.select().from(adminsTable);
  if (await isEmpty(admins)) {
    const hash = await bcrypt.hash("11211", 10);
    await db.insert(adminsTable).values({ username: "loay", passwordHash: hash });
  }

  const coupons = await db.select().from(couponsTable);
  if (await isEmpty(coupons)) {
    await db.insert(couponsTable).values([
      { code: "WELCOME10", percentOff: 10, active: true },
      { code: "SUMMER20", percentOff: 20, active: true },
      { code: "VIP30", percentOff: 30, active: true },
    ]);
  }

  const customers = await db.select().from(customersTable);
  if (await isEmpty(customers)) {
    await db.insert(customersTable).values([
      { name: "أحمد محمد", email: "ahmed@techstore.eg", avatar: "" },
      { name: "سارة علي", email: "sara@techstore.eg", avatar: "" },
      { name: "محمود السيد", email: "mahmoud@techstore.eg", avatar: "" },
      { name: "نور حسن", email: "noor@techstore.eg", avatar: "" },
      { name: "كريم خالد", email: "kareem@techstore.eg", avatar: "" },
      { name: "ليلى حسام", email: "layla@techstore.eg", avatar: "" },
      { name: "يوسف رمضان", email: "youssef@techstore.eg", avatar: "" },
      { name: "منى سامي", email: "mona@techstore.eg", avatar: "" },
    ]);
  }

  const orders = await db.select().from(ordersTable);
  if (await isEmpty(orders) && allProducts.length) {
    const cust = await db.select().from(customersTable);
    const statuses: Array<"new"|"processing"|"delivered"|"cancelled"> = ["delivered","delivered","processing","new","delivered","processing","new","delivered"];
    const govs = ["القاهرة","الجيزة","الإسكندرية","الدقهلية","الشرقية","أسيوط"];
    const sample = [];
    for (let i = 0; i < 10; i++) {
      const p = allProducts[i % allProducts.length];
      const qty = (i % 3) + 1;
      const total = p.price * qty + 50;
      sample.push({
        orderNumber: `TS-${(20000000 + i * 17).toString().slice(-8)}`,
        customerName: cust[i % cust.length].name,
        customerAvatar: "",
        phone: `0100${String(1000000 + i * 13)}`,
        address: `شارع ${i + 1} - منطقة ${i + 5}`,
        governorate: govs[i % govs.length],
        notes: null,
        paymentMethod: i % 2 === 0 ? "cod" : "card",
        status: statuses[i % statuses.length],
        total,
        itemCount: qty,
        items: [{ id: `seed-${i}`, productId: p.id, name: p.name, price: p.price, image: p.images[0] || "", quantity: qty, color: null, storage: null }],
      });
    }
    await db.insert(ordersTable).values(sample);
  }

  console.log("Seed complete.");
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
