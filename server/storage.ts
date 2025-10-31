import {
  users,
  actions,
  type User,
  type UpsertUser,
  type Action,
  type InsertAction,
} from "@shared/schema";
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

// In-memory storage for local development without database
export class InMemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private actions: Action[] = [];
  private nextActionId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!userData.id) {
      throw new Error("User ID is required");
    }
    
    const existingUser = this.users.get(userData.id);
    const now = new Date();
    
    const user: User = {
      id: userData.id,
      email: userData.email || existingUser?.email || null,
      firstName: userData.firstName || existingUser?.firstName || "Guest",
      lastName: userData.lastName || existingUser?.lastName || "User",
      profileImageUrl: userData.profileImageUrl || existingUser?.profileImageUrl || null,
      accountType: userData.accountType || existingUser?.accountType || "individual",
      companyName: userData.companyName || existingUser?.companyName || null,
      ecoPoints: existingUser?.ecoPoints || 0,
      createdAt: existingUser?.createdAt || now,
      updatedAt: now,
    };

    this.users.set(userData.id, user);
    return user;
  }

  async createAction(actionData: InsertAction): Promise<Action> {
    // Calculate impact metrics
    const impact = calculateImpact(actionData.category, actionData.quantity || "1");

    // Create action with calculated impact
    const action: Action = {
      id: `action_${this.nextActionId++}`,
      userId: actionData.userId,
      category: actionData.category,
      title: actionData.title,
      description: actionData.description || null,
      quantity: actionData.quantity || null,
      unit: actionData.unit || null,
      co2Reduced: impact.co2Reduced.toString(),
      waterSaved: impact.waterSaved.toString(),
      wasteDiverted: impact.wasteDiverted.toString(),
      pointsEarned: impact.pointsEarned,
      verified: false,
      proofUrl: actionData.proofUrl || null,
      createdAt: new Date(),
    };

    this.actions.push(action);

    // Update user's EcoPoints
    const user = this.users.get(action.userId);
    if (user) {
      user.ecoPoints += action.pointsEarned;
      user.updatedAt = new Date();
    }

    return action;
  }

  async getUserActions(userId: string, limit: number = 50): Promise<Action[]> {
    return this.actions
      .filter(action => action.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getAllActions(limit: number = 100): Promise<Action[]> {
    return this.actions
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getUserMetrics(userId: string, startDate?: Date) {
    const userActions = this.actions.filter(action => {
      if (action.userId !== userId) return false;
      if (startDate && action.createdAt && action.createdAt < startDate) return false;
      return true;
    });

    const metrics = userActions.reduce(
      (acc, action) => ({
        co2Reduced: acc.co2Reduced + parseFloat(action.co2Reduced || "0"),
        waterSaved: acc.waterSaved + parseFloat(action.waterSaved || "0"),
        wasteDiverted: acc.wasteDiverted + parseFloat(action.wasteDiverted || "0"),
        actionCount: acc.actionCount + 1,
      }),
      { co2Reduced: 0, waterSaved: 0, wasteDiverted: 0, actionCount: 0 }
    );

    const user = this.users.get(userId);

    return {
      ...metrics,
      ecoPoints: user?.ecoPoints || 0,
    };
  }

  async getCorporateMetrics(userId: string, startDate?: Date) {
    const metrics = await this.getUserMetrics(userId, startDate);
    return {
      ...metrics,
      activeEmployees: 1,
    };
  }

  async getLeaderboard(type: "individual" | "corporate", limit: number = 10) {
    const filteredUsers = Array.from(this.users.values())
      .filter(user => user.accountType === type);

    const leaderboardData = await Promise.all(
      filteredUsers.map(async (user) => {
        const userActions = this.actions.filter(action => action.userId === user.id);
        const co2Reduced = userActions.reduce((sum, action) => sum + parseFloat(action.co2Reduced || "0"), 0);
        
        return {
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`.trim() || user.email || "Anonymous",
          email: user.email || "",
          co2Reduced,
          ecoPoints: user.ecoPoints,
        };
      })
    );

    return leaderboardData
      .sort((a, b) => b.co2Reduced - a.co2Reduced)
      .slice(0, limit)
      .map((item, index) => ({
        rank: index + 1,
        ...item,
      }));
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  private db: any;

  constructor() {
    try {
      const { db } = require("./db");
      this.db = db;
    } catch (error) {
      throw new Error("Database connection failed");
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await this.db
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
    const [action] = await this.db
      .insert(actions)
      .values({
        ...actionData,
        ...impact,
        verified: false,
      })
      .returning();

    // Update user's EcoPoints
    await this.db
      .update(users)
      .set({
        ecoPoints: sql`${users.ecoPoints} + ${action.pointsEarned}`,
      })
      .where(eq(users.id, action.userId));

    return action;
  }

  async getUserActions(userId: string, limit: number = 50): Promise<Action[]> {
    return await this.db
      .select()
      .from(actions)
      .where(eq(actions.userId, userId))
      .orderBy(desc(actions.createdAt))
      .limit(limit);
  }

  async getAllActions(limit: number = 100): Promise<Action[]> {
    return await this.db
      .select()
      .from(actions)
      .orderBy(desc(actions.createdAt))
      .limit(limit);
  }

  async getUserMetrics(userId: string, startDate?: Date) {
    const whereConditions = startDate
      ? and(eq(actions.userId, userId), gte(actions.createdAt, startDate))
      : eq(actions.userId, userId);

    const [metrics] = await this.db
      .select({
        co2Reduced: sql<number>`COALESCE(SUM(${actions.co2Reduced}), 0)`,
        waterSaved: sql<number>`COALESCE(SUM(${actions.waterSaved}), 0)`,
        wasteDiverted: sql<number>`COALESCE(SUM(${actions.wasteDiverted}), 0)`,
        actionCount: sql<number>`COUNT(*)`,
      })
      .from(actions)
      .where(whereConditions);

    const [user] = await this.db
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
    const metrics = await this.getUserMetrics(userId, startDate);
    return {
      ...metrics,
      activeEmployees: 1,
    };
  }

  async getLeaderboard(type: "individual" | "corporate", limit: number = 10) {
    const leaderboardData = await this.db
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

    return leaderboardData.map((item: any, index: number) => ({
      rank: index + 1,
      userId: item.userId,
      name: item.name,
      email: item.email || "",
      co2Reduced: Number(item.co2Reduced),
      ecoPoints: item.ecoPoints,
    }));
  }
}

// Create storage instance based on environment
function createStorage(): IStorage {
  try {
    // Try to create database storage first
    if (process.env.DATABASE_URL) {
      return new DatabaseStorage();
    }
  } catch (error) {
    console.warn("Database unavailable, falling back to in-memory storage:", error);
  }
  
  console.log("Using in-memory storage for local development");
  return new InMemoryStorage();
}

export const storage = createStorage();
