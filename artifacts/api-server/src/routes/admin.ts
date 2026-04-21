import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import {
  adminsTable,
  productsTable,
  categoriesTable,
  ordersTable,
  customersTable,
  couponsTable,
} from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { setAdminCookie, clearAdminCookie, requireAdmin } from "../lib/session";

const router: IRouter = Router();

router.post("/login", async (req, res) => {
  const username = String(req.body?.username ?? "").trim();
  const password = String(req.body?.password ?? "");
  if (!username || !password) {
    res.status(400).json({ message: "أدخل اسم المستخدم وكلمة المرور" });
    return;
  }
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.username, username)).limit(1);
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    return;
  }
  setAdminCookie(res, admin.username);
  res.json({ username: admin.username, avatar: admin.avatar });
});

router.post("/logout", async (_req, res) => {
  clearAdminCookie(res);
  res.json({ ok: true });
});

router.get("/me", requireAdmin, async (req, res) => {
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.username, req.adminUsername!)).limit(1);
  if (!admin) {
    res.status(401).json({ message: "غير مصرح" });
    return;
  }
  res.json({ username: admin.username, avatar: admin.avatar });
});

router.get("/stats", requireAdmin, async (_req, res) => {
  const [productCount] = await db.select({ c: sql<number>`cast(count(*) as int)` }).from(productsTable);
  const [customerCount] = await db.select({ c: sql<number>`cast(count(*) as int)` }).from(customersTable);
  const orders = await db.select().from(ordersTable);
  const totalSales = orders.reduce((n, o) => n + o.total, 0);
  const profit = Math.round(totalSales * 0.22);
  const products = await db.select().from(productsTable).limit(50);
  const lowStock = products.filter((p) => p.stock <= 5).map((p) => ({ id: p.id, name: p.name, stock: p.stock, image: p.images[0] || "" }));
  const topProducts = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5).map((p) => ({
    id: p.id, name: p.name, image: p.images[0] || "", soldCount: p.soldCount, revenue: p.price * p.soldCount,
  }));
  const cats = await db.select().from(categoriesTable);
  const catRevs = cats.map((c) => {
    const ps = products.filter((p) => p.categoryId === c.id);
    const rev = ps.reduce((n, p) => n + p.price * p.soldCount, 0);
    return { name: c.name, value: rev };
  }).filter((x) => x.value > 0);
  const totalCatRev = catRevs.reduce((n, x) => n + x.value, 0) || 1;
  const salesByCategory = catRevs.map((c) => ({ name: c.name, percent: Math.round((c.value / totalCatRev) * 100) }));

  const recentOrdersRows = orders.slice(0, 8);
  const recentOrders = recentOrdersRows.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    total: o.total,
    itemCount: o.itemCount,
    createdAt: o.createdAt.toISOString(),
    customerName: o.customerName,
    customerAvatar: o.customerAvatar,
    items: o.items,
  }));

  res.json({
    products: { value: productCount.c, change: 12 },
    customers: { value: customerCount.c, change: 8 },
    orders: { value: orders.length, change: 24 },
    profit: { value: profit, change: 18 },
    sales: { value: totalSales, change: 32 },
    topProducts,
    lowStock,
    salesByCategory,
    recentOrders,
  });
});

router.get("/sales-chart", requireAdmin, async (_req, res) => {
  const days = 30;
  const today = new Date();
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const seed = d.getDate() + d.getMonth() * 31;
    const value = 8000 + ((seed * 137) % 12000) + (i % 7 === 0 ? 5000 : 0);
    arr.push({ label: d.toISOString().slice(5, 10), value });
  }
  res.json(arr);
});

router.get("/orders", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  res.json(rows.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerAvatar: o.customerAvatar,
    status: o.status,
    total: o.total,
    itemCount: o.itemCount,
    createdAt: o.createdAt.toISOString(),
    items: o.items,
  })));
});

router.patch("/orders/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body?.status ?? "");
  if (!["new", "processing", "delivered", "cancelled"].includes(status)) {
    res.status(400).json({ message: "حالة غير صالحة" });
    return;
  }
  await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id));
  res.json({ ok: true });
});

router.get("/products", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(productsTable).orderBy(desc(productsTable.id));
  res.json(rows);
});

router.post("/products", requireAdmin, async (req, res) => {
  const b = req.body ?? {};
  const [p] = await db.insert(productsTable).values({
    name: b.name, description: b.description ?? "", shortDescription: b.shortDescription ?? "",
    price: Number(b.price), originalPrice: b.originalPrice ? Number(b.originalPrice) : null,
    categoryId: Number(b.categoryId), stock: Number(b.stock ?? 10), isNew: !!b.isNew,
    isBestSeller: !!b.isBestSeller, images: b.images ?? [], colors: b.colors ?? [],
    storageOptions: b.storageOptions ?? [],
  }).returning();
  res.json(p);
});

router.patch("/products/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const b = req.body ?? {};
  const update: Record<string, unknown> = {};
  for (const k of ["name","description","shortDescription","categoryId","stock","isNew","isBestSeller","images","colors","storageOptions"]) {
    if (b[k] !== undefined) update[k] = b[k];
  }
  if (b.price !== undefined) update.price = Number(b.price);
  if (b.originalPrice !== undefined) update.originalPrice = b.originalPrice ? Number(b.originalPrice) : null;
  await db.update(productsTable).set(update).where(eq(productsTable.id, id));
  const [p] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  res.json(p);
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  await db.delete(productsTable).where(eq(productsTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

router.get("/categories", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(categoriesTable).orderBy(categoriesTable.id);
  res.json(rows);
});

router.post("/categories", requireAdmin, async (req, res) => {
  const b = req.body ?? {};
  const [c] = await db.insert(categoriesTable).values({
    name: b.name, slug: b.slug, icon: b.icon ?? "Box",
  }).returning();
  res.json(c);
});

router.get("/customers", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(customersTable).orderBy(customersTable.id);
  const orders = await db.select().from(ordersTable);
  res.json(rows.map((c) => {
    const myOrders = orders.filter((o) => o.customerName === c.name);
    return {
      id: c.id, name: c.name, email: c.email, avatar: c.avatar,
      joinedAt: c.joinedAt.toISOString(),
      ordersCount: myOrders.length,
      totalSpent: myOrders.reduce((n, o) => n + o.total, 0),
    };
  }));
});

router.get("/admins", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(adminsTable).orderBy(adminsTable.id);
  res.json(rows.map((a) => ({ id: a.id, username: a.username, avatar: a.avatar })));
});

router.post("/admins", requireAdmin, async (req, res) => {
  const username = String(req.body?.username ?? "").trim();
  const password = String(req.body?.password ?? "");
  if (!username || !password) {
    res.status(400).json({ message: "أدخل اسم المستخدم وكلمة المرور" });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const [a] = await db.insert(adminsTable).values({ username, passwordHash: hash }).returning();
    res.json({ id: a.id, username: a.username, avatar: a.avatar });
  } catch {
    res.status(409).json({ message: "اسم المستخدم موجود مسبقاً" });
  }
});

router.delete("/admins/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const [target] = await db.select().from(adminsTable).where(eq(adminsTable.id, id));
  if (!target) {
    res.status(404).json({ message: "غير موجود" });
    return;
  }
  if (target.username === req.adminUsername) {
    res.status(400).json({ message: "لا يمكنك حذف حسابك الحالي" });
    return;
  }
  await db.delete(adminsTable).where(eq(adminsTable.id, id));
  res.json({ ok: true });
});

router.get("/coupons", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(couponsTable).orderBy(desc(couponsTable.id));
  res.json(rows);
});

router.post("/coupons", requireAdmin, async (req, res) => {
  const code = String(req.body?.code ?? "").trim().toUpperCase();
  const percentOff = Number(req.body?.percentOff);
  if (!code || !Number.isFinite(percentOff)) {
    res.status(400).json({ message: "بيانات غير صالحة" });
    return;
  }
  try {
    const [c] = await db.insert(couponsTable).values({ code, percentOff, active: true }).returning();
    res.json(c);
  } catch {
    res.status(409).json({ message: "الكود موجود مسبقاً" });
  }
});

export default router;
