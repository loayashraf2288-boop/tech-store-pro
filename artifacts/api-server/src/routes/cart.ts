import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { productsTable, couponsTable } from "@workspace/db/schema";
import { inArray, eq } from "drizzle-orm";
import { getSession, type CartItemRecord } from "../lib/cart-store";

const router: IRouter = Router();

async function buildCart(sid: string) {
  const s = getSession(sid);
  const ids = s.cart.map((i) => i.productId);
  const products = ids.length
    ? await db.select().from(productsTable).where(inArray(productsTable.id, ids))
    : [];
  const map = new Map(products.map((p) => [p.id, p]));
  const items = s.cart
    .map((c) => {
      const p = map.get(c.productId);
      if (!p) return null;
      return {
        id: c.id,
        productId: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0] || "",
        quantity: c.quantity,
        color: c.color ?? null,
        storage: c.storage ?? null,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = s.coupon ? Math.round(subtotal * (s.coupon.percentOff / 100)) : 0;
  const shipping = subtotal > 0 ? (subtotal > 1000 ? 0 : 50) : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  return {
    items,
    subtotal,
    discount,
    shipping,
    total,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    couponCode: s.coupon?.code ?? null,
  };
}

router.get("/cart", async (req, res) => {
  res.json(await buildCart(req.sessionId));
});

router.post("/cart/items", async (req, res) => {
  const { productId, quantity = 1, color, storage } = req.body ?? {};
  if (!productId) {
    res.status(400).json({ message: "productId مطلوب" });
    return;
  }
  const [p] = await db.select().from(productsTable).where(eq(productsTable.id, Number(productId))).limit(1);
  if (!p) {
    res.status(404).json({ message: "المنتج غير موجود" });
    return;
  }
  const s = getSession(req.sessionId);
  const existing = s.cart.find(
    (i) => i.productId === Number(productId) && (i.color ?? null) === (color ?? null) && (i.storage ?? null) === (storage ?? null),
  );
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    const item: CartItemRecord = {
      id: randomUUID(),
      productId: Number(productId),
      quantity: Number(quantity),
      color: color ?? null,
      storage: storage ?? null,
    };
    s.cart.push(item);
  }
  res.json(await buildCart(req.sessionId));
});

router.patch("/cart/items/:id", async (req, res) => {
  const s = getSession(req.sessionId);
  const item = s.cart.find((i) => i.id === req.params.id);
  if (!item) {
    res.status(404).json({ message: "السطر غير موجود" });
    return;
  }
  const qty = Number(req.body?.quantity);
  if (!Number.isFinite(qty) || qty < 1) {
    res.status(400).json({ message: "الكمية غير صالحة" });
    return;
  }
  item.quantity = qty;
  res.json(await buildCart(req.sessionId));
});

router.delete("/cart/items/:id", async (req, res) => {
  const s = getSession(req.sessionId);
  s.cart = s.cart.filter((i) => i.id !== req.params.id);
  res.json(await buildCart(req.sessionId));
});

router.delete("/cart", async (req, res) => {
  const s = getSession(req.sessionId);
  s.cart = [];
  s.coupon = null;
  res.json(await buildCart(req.sessionId));
});

router.post("/cart/coupon", async (req, res) => {
  const code = String(req.body?.code ?? "").trim().toUpperCase();
  if (!code) {
    res.status(400).json({ message: "أدخل كود الخصم" });
    return;
  }
  const [c] = await db.select().from(couponsTable).where(eq(couponsTable.code, code)).limit(1);
  if (!c || !c.active) {
    res.status(404).json({ message: "كود غير صالح" });
    return;
  }
  const s = getSession(req.sessionId);
  s.coupon = { code: c.code, percentOff: c.percentOff };
  res.json(await buildCart(req.sessionId));
});

export default router;
