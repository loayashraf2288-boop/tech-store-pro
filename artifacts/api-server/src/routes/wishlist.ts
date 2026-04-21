import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { inArray } from "drizzle-orm";
import { getSession } from "../lib/cart-store";

const router: IRouter = Router();

async function buildWishlist(sid: string) {
  const s = getSession(sid);
  if (!s.wishlist.length) return [];
  const products = await db.select().from(productsTable).where(inArray(productsTable.id, s.wishlist));
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.originalPrice && p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null,
    rating: p.rating,
    reviewCount: p.reviewCount,
    images: p.images,
    categoryId: p.categoryId,
  }));
}

router.get("/wishlist", async (req, res) => {
  res.json(await buildWishlist(req.sessionId));
});

router.post("/wishlist/toggle", async (req, res) => {
  const productId = Number(req.body?.productId);
  if (!productId) {
    res.status(400).json({ message: "productId مطلوب" });
    return;
  }
  const s = getSession(req.sessionId);
  if (s.wishlist.includes(productId)) {
    s.wishlist = s.wishlist.filter((id) => id !== productId);
  } else {
    s.wishlist.push(productId);
  }
  res.json(await buildWishlist(req.sessionId));
});

export default router;
