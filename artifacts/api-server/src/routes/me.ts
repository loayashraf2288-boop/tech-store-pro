import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/me", async (_req, res) => {
  const orders = await db.select().from(ordersTable);
  const total = orders.length;
  const processing = orders.filter((o) => o.status === "processing" || o.status === "new").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const totalSpent = orders.reduce((n, o) => n + o.total, 0);
  res.json({
    name: "أحمد محمد",
    email: "ahmed@techstore.eg",
    avatar: "",
    joinedAt: "2025-01-15T00:00:00.000Z",
    stats: { total, processing, delivered, totalSpent },
  });
});

export default router;
