import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";

export const couponsTable = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  percentOff: integer("percent_off").notNull(),
  active: boolean("active").notNull().default(true),
});

export type Coupon = typeof couponsTable.$inferSelect;
