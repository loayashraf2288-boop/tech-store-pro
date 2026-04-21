import { pgTable, serial, text, integer, doublePrecision, jsonb, timestamp } from "drizzle-orm/pg-core";

export type OrderItem = {
  id: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string | null;
  storage?: string | null;
};

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerAvatar: text("customer_avatar").notNull().default(""),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  governorate: text("governorate").notNull(),
  notes: text("notes"),
  paymentMethod: text("payment_method").notNull().default("cod"),
  status: text("status").notNull().default("new"),
  total: doublePrecision("total").notNull(),
  itemCount: integer("item_count").notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Order = typeof ordersTable.$inferSelect;
