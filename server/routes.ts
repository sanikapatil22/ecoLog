import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertActionSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user account type
  app.post("/api/auth/account-type", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { accountType, companyName } = req.body;

      const user = await storage.upsertUser({
        id: userId,
        accountType,
        companyName: accountType === "corporate" ? companyName : null,
      });

      res.json(user);
    } catch (error) {
      console.error("Error updating account type:", error);
      res.status(500).json({ message: "Failed to update account type" });
    }
  });

  // Action routes
  app.post("/api/actions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Validate request body
      const validation = insertActionSchema.safeParse({
        ...req.body,
        userId,
      });

      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid request data",
          error: fromError(validation.error).toString(),
        });
      }

      const action = await storage.createAction(validation.data);
      res.status(201).json(action);
    } catch (error) {
      console.error("Error creating action:", error);
      res.status(500).json({ message: "Failed to create action" });
    }
  });

  app.get("/api/actions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const actions = await storage.getUserActions(userId, limit);
      res.json(actions);
    } catch (error) {
      console.error("Error fetching actions:", error);
      res.status(500).json({ message: "Failed to fetch actions" });
    }
  });

  // Metrics routes
  app.get("/api/metrics/personal", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Optional: filter by date range
      let startDate: Date | undefined;
      if (req.query.period === "month") {
        startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      }

      const metrics = await storage.getUserMetrics(userId, startDate);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching personal metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.get("/api/metrics/corporate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Check if user is corporate account
      const user = await storage.getUser(userId);
      if (user?.accountType !== "corporate") {
        return res
          .status(403)
          .json({ message: "Only corporate accounts can access this endpoint" });
      }

      let startDate: Date | undefined;
      if (req.query.period === "quarter") {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        startDate.setHours(0, 0, 0, 0);
      }

      const metrics = await storage.getCorporateMetrics(userId, startDate);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching corporate metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", isAuthenticated, async (req: any, res) => {
    try {
      const type = (req.query.type as "individual" | "corporate") || "individual";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const leaderboard = await storage.getLeaderboard(type, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
