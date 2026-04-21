import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable, bannersTable, reviewsTable } from "@workspace/db/schema";
import { eq, ilike, or, and, isNotNull, ne, desc } from "drizzle-orm";
import type { Product } from "@workspace/db/schema";

const router: IRouter = Router();

function discountPercent(p: Product): number | null {
  if (!p.originalPrice || p.originalPrice <= p.price) return null;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

function toListItem(p: Product) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: discountPercent(p),
    rating: p.rating,
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    images: p.images,
    categoryId: p.categoryId,
  };
}

router.get("/categories", async (_req, res) => {
  const rows = await db.select().from(categoriesTable).orderBy(categoriesTable.id);
  res.json(rows);
});

router.get("/banners", async (_req, res) => {
  const rows = await db.select().from(bannersTable).orderBy(bannersTable.id);
  res.json(rows);
});

router.get("/products", async (req, res) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const onSale = req.query.onSale === "true";
  const limit = req.query.limit ? Math.min(100, Number(req.query.limit)) : 50;

  const conds = [] as ReturnType<typeof eq>[];
  if (categoryId) conds.push(eq(productsTable.categoryId, categoryId));
  if (q) {
    const cond = or(ilike(productsTable.name, `%${q}%`), ilike(productsTable.description, `%${q}%`));
    if (cond) conds.push(cond);
  }
  if (onSale) conds.push(isNotNull(productsTable.originalPrice));

  const rows = await db
    .select()
    .from(productsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(productsTable.id))
    .limit(limit);
  res.json(rows.map(toListItem));
});

router.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [p] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
  if (!p) {
    res.status(404).json({ message: "المنتج غير موجود" });
    return;
  }
  const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.productId, id)).orderBy(desc(reviewsTable.createdAt)).limit(20);
  res.json({
    ...toListItem(p),
    description: p.description,
    shortDescription: p.shortDescription,
    stock: p.stock,
    colors: p.colors,
    storageOptions: p.storageOptions,
    soldCount: p.soldCount,
    reviews: reviews.map((r) => ({
      id: r.id,
      author: r.author,
      avatar: r.avatar,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
  });
});

router.get("/products/:id/related", async (req, res) => {
  const id = Number(req.params.id);
  const [p] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
  if (!p) {
    res.json([]);
    return;
  }
  const rows = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.categoryId, p.categoryId), ne(productsTable.id, id)))
    .limit(8);
  res.json(rows.map(toListItem));
});

export default router;
