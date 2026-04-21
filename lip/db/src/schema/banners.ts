import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const bannersTable = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  discount: text("discount"),
  ctaText: text("cta_text").notNull().default("تسوق الآن"),
  imageUrl: text("image_url").notNull(),
});

export type Banner = typeof bannersTable.$inferSelect;
