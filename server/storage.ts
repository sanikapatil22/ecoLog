import {
  users,
  actions,
  type User,
  type UpsertUser,
  type Action,
  type InsertAction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import { calculateImpact } from "./impactCalculator";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Action operations
  createAction(action: InsertAction): Promise<Action>;
  getUserActions(userId: string, limit?: number): Promise<Action[]>;
  getAllActions(limit?: number): Promise<Action[]>;

  // Metrics operations
  getUserMetrics(
    userId: string,
    startDate?: Date
  ): Promise<{
    co2Reduced: number;
    waterSaved: number;
    wasteDiverted: number;
    ecoPoints: number;
    actionCount: number;
  }>;

  getCorporateMetrics(
    userId: string,
    startDate?: Date
  ): Promise<{
    co2Reduced: number;
    waterSaved: number;
    wasteDiverted: number;
    ecoPoints: number;
    actionCount: number;
    activeEmployees: number;
  }>;

  // Leaderboard operations
  getLeaderboard(
    type: "individual" | "corporate",
    limit?: number
  ): Promise<
    Array<{
      rank: number;
      userId: string;
      name: string;
      email: string;
      co2Reduced: number;
      ecoPoints: number;
    }>
  >;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createAction(actionData: InsertAction): Promise<Action> {
    // Calculate impact metrics
    const impact = calculateImpact(actionData.category, actionData.quantity);

    // Create action with calculated impact
    const [action] = await db
      .insert(actions)
      .values({
        ...actionData,
        ...impact,
        verified: false,
      })
      .returning();

    // Update user's EcoPoints
    await db
      .update(users)
      .set({
        ecoPoints: sql`${users.ecoPoints} + ${action.pointsEarned}`,
      })
      .where(eq(users.id, action.userId));

    return action;
  }

  async getUserActions(userId: string, limit: number = 50): Promise<Action[]> {
    return await db
      .select()
      .from(actions)
      .where(eq(actions.userId, userId))
      .orderBy(desc(actions.createdAt))
      .limit(limit);
  }

  async getAllActions(limit: number = 100): Promise<Action[]> {
    return await db
      .select()
      .from(actions)
      .orderBy(desc(actions.createdAt))
      .limit(limit);
  }

  async getUserMetrics(userId: string, startDate?: Date) {
    const whereConditions = startDate
      ? and(eq(actions.userId, userId), gte(actions.createdAt, startDate))
      : eq(actions.userId, userId);

    const [metrics] = await db
      .select({
        co2Reduced: sql<number>`COALESCE(SUM(${actions.co2Reduced}), 0)`,
        waterSaved: sql<number>`COALESCE(SUM(${actions.waterSaved}), 0)`,
        wasteDiverted: sql<number>`COALESCE(SUM(${actions.wasteDiverted}), 0)`,
        actionCount: sql<number>`COUNT(*)`,
      })
      .from(actions)
      .where(whereConditions);

    const [user] = await db
      .select({ ecoPoints: users.ecoPoints })
      .from(users)
      .where(eq(users.id, userId));

    return {
      co2Reduced: Number(metrics.co2Reduced),
      waterSaved: Number(metrics.waterSaved),
      wasteDiverted: Number(metrics.wasteDiverted),
      ecoPoints: user?.ecoPoints || 0,
      actionCount: Number(metrics.actionCount),
    };
  }

  async getCorporateMetrics(userId: string, startDate?: Date) {
    // For corporate accounts, aggregate all employee actions
    // In this MVP, we'll just return the corporate user's own metrics
    // In a full implementation, you'd have an employees table linking to companies
    const metrics = await this.getUserMetrics(userId, startDate);

    return {
      ...metrics,
      activeEmployees: 1, // Placeholder - would count actual employees in full version
    };
  }

  async getLeaderboard(type: "individual" | "corporate", limit: number = 10) {
    const leaderboardData = await db
      .select({
        userId: users.id,
        name: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`,
        email: users.email,
        ecoPoints: users.ecoPoints,
        co2Reduced: sql<number>`COALESCE(SUM(${actions.co2Reduced}), 0)`,
      })
      .from(users)
      .leftJoin(actions, eq(users.id, actions.userId))
      .where(eq(users.accountType, type))
      .groupBy(users.id, users.email, users.firstName, users.lastName, users.ecoPoints)
      .orderBy(desc(sql`COALESCE(SUM(${actions.co2Reduced}), 0)`))
      .limit(limit);

    return leaderboardData.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      name: item.name,
      email: item.email || "",
      co2Reduced: Number(item.co2Reduced),
      ecoPoints: item.ecoPoints,
    }));
  }
}

export const storage = new DatabaseStorage();
