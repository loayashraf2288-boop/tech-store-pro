import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar").notNull().default(""),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export type Customer = typeof customersTable.$inferSelect;
