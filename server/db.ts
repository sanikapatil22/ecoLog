import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Only create database connection if DATABASE_URL is provided
let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log("✅ Database connection established");
  } catch (error) {
    console.warn("⚠️ Failed to establish database connection:", error);
  }
} else {
  console.log("⚠️ DATABASE_URL not set — using in-memory storage for local development");
}

export { pool, db };
