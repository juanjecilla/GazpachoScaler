import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gazpachoCounter = pgTable("gazpacho_counter", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCounterSchema = createInsertSchema(gazpachoCounter).pick({
  count: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GazpachoCounter = typeof gazpachoCounter.$inferSelect;
export type InsertCounter = z.infer<typeof insertCounterSchema>;
