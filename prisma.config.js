// prisma.config.js
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
}

/** @type {import('@prisma/config').Config} */
module.exports = {
  schema: "./prisma/schema.prisma",
};
