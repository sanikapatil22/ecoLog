import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  accountType: varchar("account_type", { enum: ["individual", "corporate"] })
    .notNull()
    .default("individual"),
  companyName: varchar("company_name"),
  ecoPoints: integer("eco_points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Eco-actions table
export const actions = pgTable(
  "actions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    category: varchar("category", {
      enum: ["energy_saving", "recycling", "upcycling", "sustainable_commute"],
    }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    quantity: decimal("quantity", { precision: 10, scale: 2 }),
    unit: varchar("unit"),
    co2Reduced: decimal("co2_reduced", { precision: 10, scale: 2 }).notNull(),
    waterSaved: decimal("water_saved", { precision: 10, scale: 2 }).notNull(),
    wasteDiverted: decimal("waste_diverted", { precision: 10, scale: 2 }).notNull(),
    pointsEarned: integer("points_earned").notNull(),
    verified: boolean("verified").notNull().default(false),
    proofUrl: varchar("proof_url"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_actions_user_id").on(table.userId),
    index("idx_actions_created_at").on(table.createdAt),
  ]
);

export const insertActionSchema = createInsertSchema(actions).omit({
  id: true,
  createdAt: true,
  co2Reduced: true,
  waterSaved: true,
  wasteDiverted: true,
  pointsEarned: true,
  verified: true,
});

export type InsertAction = z.infer<typeof insertActionSchema>;
export type Action = typeof actions.$inferSelect;
