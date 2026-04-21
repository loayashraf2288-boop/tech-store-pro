import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable } from "@workspace/db/schema";
import { desc, inArray } from "drizzle-orm";
import { getSession, clearSessionCart } from "../lib/cart-store";

const router: IRouter = Router();

router.get("/orders", async (_req, res) => {
  const rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(50);
  res.json(
    rows.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
      itemCount: o.itemCount,
      createdAt: o.createdAt.toISOString(),
      items: o.items,
    })),
  );
});

router.post("/orders", async (req, res) => {
  const body = req.body ?? {};
  if (body.fullName === undefined && body.full_name) body.fullName = body.full_name;
  const required = ["fullName", "phone", "address", "governorate"];
  for (const k of required) {
    if (!body[k]) {
      res.status(400).json({ message: `${k} مطلوب` });
      return;
    }
  }
  const s = getSession(req.sessionId);
  if (!s.cart.length) {
    res.status(400).json({ message: "السلة فارغة" });
    return;
  }
  const ids = s.cart.map((i) => i.productId);
  const products = await db.select().from(productsTable).where(inArray(productsTable.id, ids));
  const map = new Map(products.map((p) => [p.id, p]));
  const items = s.cart.map((c) => {
    const p = map.get(c.productId)!;
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
  });
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const discount = s.coupon ? Math.round(subtotal * (s.coupon.percentOff / 100)) : 0;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = Math.max(0, subtotal - discount + shipping);
  const orderNumber = `TS-${Date.now().toString().slice(-8)}`;

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber,
      customerName: body.fullName,
      phone: body.phone,
      address: [body.address, body.apartment, body.landmark, body.floor, body.houseNumber, body.building, body.district].filter(Boolean).join(" - "),
      governorate: body.governorate,
      notes: body.notes ?? null,
      paymentMethod: body.paymentMethod ?? "cod",
      status: "new",
      total,
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
      items,
    })
    .returning();

  clearSessionCart(req.sessionId);

  res.json({
    id: order.id,
    orderNumber: order.orderNumber,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  });
});

export default router;
