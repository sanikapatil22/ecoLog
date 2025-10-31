import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// ✅ FIX: safely handle missing REPL_ID (local mode)
const getOidcConfig = memoize(
  async () => {
    if (!process.env.REPL_ID) {
      console.log("⚠️ REPL_ID not set — skipping Replit OIDC config (local mode)");
      return null;
    }

    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  // If DATABASE_URL is provided, use a Postgres-backed session store.
  // Otherwise fall back to the default memory store for local development.
  // Only use Postgres-backed session store when explicitly enabled to avoid
  // runtime errors when a DATABASE_URL is present but the DB is not reachable.
  if (process.env.DATABASE_URL && process.env.USE_PG_SESSION === "true") {
    try {
      const pgStore = connectPg(session);
      const sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        // automatically create sessions table if missing (helps local/dev)
        createTableIfMissing: true,
        ttl: sessionTtl,
        tableName: "sessions",
      });
      return session({
        secret: process.env.SESSION_SECRET!,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: false, // 👈 safer for local dev (change to true in prod)
          maxAge: sessionTtl,
        },
      });
    } catch (err) {
      console.warn("Could not initialize Postgres session store — falling back to in-memory sessions:", err);
    }
  }

  // In-memory sessions for local development (not suitable for production)
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Always provide a minimal serialize/deserialize so req.login works for guest/local sessions
  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  const config = await getOidcConfig();

  // Provide a login route even when OIDC is not configured so client calls do not 404.
  // If OIDC is not configured, redirect to the local signup flow.
  // If OIDC is configured, perform normal OIDC authentication.

  const registeredStrategies = new Set<string>();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  const ensureStrategy = (domain: string) => {
    if (!config) return;
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  // Login route: if no OIDC config, redirect to client signup where guest login is available.
  app.get("/api/login", (req, res, next) => {
    if (!config) {
      return res.redirect("/signup");
    }
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  // Callback and logout endpoints only valid when OIDC is configured
  if (config) {
    app.get("/api/callback", (req, res, next) => {
      ensureStrategy(req.hostname);
      passport.authenticate(`replitauth:${req.hostname}`, {
        successReturnToOrRedirect: "/",
        failureRedirect: "/api/login",
      })(req, res, next);
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect(
          client.buildEndSessionUrl(config, {
            client_id: process.env.REPL_ID || process.env.OIDC_CLIENT_ID || "",
            post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
          }).href
        );
      });
    });
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  // For guest users, don't try to refresh tokens - just check if they're still valid
  if (user.claims?.sub?.startsWith('guest:')) {
    return res.status(401).json({ message: "Guest session expired" });
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    if (!config) throw new Error("Missing OIDC config");
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
