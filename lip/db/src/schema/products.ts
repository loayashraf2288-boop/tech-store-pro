import { pgTable, serial, text, integer, doublePrecision, boolean, jsonb } from "drizzle-orm/pg-core";

export type ProductColor = { name: string; hex: string };

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  price: doublePrecision("price").notNull(),
  originalPrice: doublePrecision("original_price"),
  categoryId: integer("category_id").notNull(),
  rating: doublePrecision("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(10),
  isNew: boolean("is_new").notNull().default(false),
  isBestSeller: boolean("is_best_seller").notNull().default(false),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<ProductColor[]>().notNull().default([]),
  storageOptions: jsonb("storage_options").$type<string[]>().notNull().default([]),
  soldCount: integer("sold_count").notNull().default(0),
});

export type Product = typeof productsTable.$inferSelect;
