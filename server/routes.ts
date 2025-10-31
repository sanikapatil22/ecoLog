import type { Express } from "express";
import crypto from "crypto";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertActionSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  // Provide a fallback GET /api/login that creates a guest session in local/dev mode
  // This allows the landing page to point to /api/login and still sign users in as guests.
  app.get("/api/login", async (req: any, res) => {
    try {
      const generatedId = `guest:${crypto.randomUUID()}`;
      const guestClaims = {
        sub: generatedId,
        email: null,
        first_name: "Guest",
        last_name: "User",
        profile_image_url: null,
      };

      try {
        await storage.upsertUser({
          id: generatedId,
          email: null as any,
          firstName: "Guest",
          lastName: "User",
          profileImageUrl: null as any,
        });
      } catch (err) {
        console.warn('Could not upsert guest user into DB (login fallback):', err);
      }

      const userSession: any = {
        claims: guestClaims,
        access_token: null,
        refresh_token: null,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      };

      if (req.login) {
        await new Promise<void>((resolve, reject) => {
          req.login(userSession, (err: any) => {
            if (err) return reject(err);
            resolve();
          });
        });
        return res.redirect('/');
      }

      req.user = userSession;
      return res.redirect('/');
    } catch (err) {
      console.error('Error in /api/login guest fallback:', err);
      return res.status(500).json({ message: 'Login fallback failed' });
    }
  });

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let user;
      try {
        user = await storage.getUser(userId);
      } catch (dbError) {
        console.warn("Database unavailable, returning guest user from session:", dbError);
        // Return a default user object based on session claims when DB is unavailable
        user = {
          id: userId,
          email: req.user.claims.email || null,
          firstName: req.user.claims.first_name || "Guest",
          lastName: req.user.claims.last_name || "User",
          profileImageUrl: req.user.claims.profile_image_url || null,
          accountType: "individual",
          companyName: null,
          ecoPoints: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Guest auth (development convenience) - creates a temporary guest user and logs them in
  app.post("/api/auth/guest", async (req: any, res) => {
    try {
      // Create a lightweight guest identity
      const generatedId = `guest:${crypto.randomUUID()}`;
      const guestClaims = {
        sub: generatedId,
        email: null,
        first_name: "Guest",
        last_name: "User",
        profile_image_url: null,
      };

      // Upsert into users table with default accountType (best-effort)
      try {
        await storage.upsertUser({
          id: generatedId,
          email: null as any,
          firstName: "Guest",
          lastName: "User",
          profileImageUrl: null as any,
        });
      } catch (err) {
        // Not fatal for creating a guest session — log and continue.
        console.warn('Could not upsert guest user into DB, continuing with in-memory session:', err);
      }

      // Attach a minimal session object compatible with the rest of the app
      const userSession: any = {
        claims: guestClaims,
        access_token: null,
        refresh_token: null,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      };

      // Use passport's login if available to establish session
      if (req.login) {
        await new Promise<void>((resolve, reject) => {
          req.login(userSession, (err: any) => {
            if (err) return reject(err);
            resolve();
          });
        });
        return res.json({ message: 'Guest session created' });
      } else {
        // Fallback: set on req.user
        req.user = userSession;
        return res.json({ message: 'Guest session created (no passport)' });
      }
    } catch (error) {
      console.error('Error creating guest session', error);
      return res.status(500).json({ message: 'Failed to create guest session' });
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
