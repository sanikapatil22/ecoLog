# EcoLog: Replit to Local Development Migration Guide

This guide will help you migrate the EcoLog application from Replit to a local development environment, with full support for guest authentication and action logging functionality.

## 📋 Prerequisites

- **Node.js 20** or later (matches Replit nodejs-20 module)
- **PostgreSQL 16** database (local or hosted)
- **Git** for version control
- **Terminal/Command Line** access

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd EcoLogWeb

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```bash
# Database - Replace with your PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/ecolog

# Session secret - Generate a secure random string
SESSION_SECRET=your_super_secure_random_string_here

# Server configuration
PORT=5050
NODE_ENV=development

# Optional: Use PostgreSQL for session storage (recommended for production)
USE_PG_SESSION=false

# Optional: OIDC settings (can be left blank for guest mode)
OIDC_CLIENT_ID=
ISSUER_URL=
```

### 3. Database Setup

Set up your PostgreSQL database:

```bash
# Create database (if using local PostgreSQL)
createdb ecolog

# Push database schema
npm run db:push
```

### 4. Start Development

```bash
# Start both client and server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5050

## 🔧 Detailed Migration Steps

### Removing Replit Dependencies

The following Replit-specific files and configurations have been removed/modified:

#### Files Removed
- `.replit` configuration file can be deleted
- Any `replit.nix` files (not present in this project)

#### Code Changes Made

1. **Vite Configuration** (`vite.config.ts`)
   - Removed Replit-specific plugins
   - Added local development proxy configuration

2. **Authentication System** (`server/replitAuth.ts`)
   - Added fallback for missing `REPL_ID` environment variable
   - Implemented guest authentication mode
   - Added memory store fallback for sessions

3. **Package Scripts** (`package.json`)
   - Updated dev scripts to use `concurrently`
   - Configured proper server/client startup

4. **Server Configuration** (`server/index.ts`)
   - Changed from `app.listen(PORT)` to `app.listen(PORT, 'localhost')`
   - Added proper error handling for local development

### Environment Variables Migration

| Replit Variable | Local Equivalent | Purpose |
|----------------|------------------|---------|
| `REPL_ID` | Not needed | Remove or leave empty |
| `DATABASE_URL` | Required | Your PostgreSQL connection string |
| `SESSION_SECRET` | Required | Secure random string for sessions |
| `PORT` | Optional (defaults to 5050) | Server port |

## 🔐 Authentication System

### Guest Authentication

The app now supports guest users without requiring full OIDC setup:

1. **Guest Signup Flow**
   - Navigate to `/signup` page
   - Click "Start as Guest"
   - System creates temporary guest user
   - Redirects to dashboard

2. **API Endpoints**
   - `POST /api/auth/guest` - Creates guest session
   - `GET /api/login` - Fallback login endpoint

### Session Management

Sessions are handled via `express-session` with options:
- **Memory Store** (default for development)
- **PostgreSQL Store** (set `USE_PG_SESSION=true`)

## 🗄️ Database Configuration

### Local PostgreSQL Setup

1. **Install PostgreSQL 16**
   ```bash
   # macOS (via Homebrew)
   brew install postgresql@16
   brew services start postgresql@16
   
   # Ubuntu/Debian
   sudo apt install postgresql-16 postgresql-client-16
   
   # Windows (download from postgresql.org)
   ```

2. **Create Database**
   ```bash
   createdb ecolog
   ```

3. **Update Connection String**
   ```bash
   # In .env file
   DATABASE_URL=postgresql://username:password@localhost:5432/ecolog
   ```

### Hosted Database Options

- **Neon**: https://neon.tech (recommended, PostgreSQL-compatible)
- **Supabase**: https://supabase.com
- **PlanetScale**: https://planetscale.com
- **Railway**: https://railway.app

## 🧪 Testing the Migration

### 1. Verify Server Startup
```bash
npm run dev:server
```
Should see: `✅ Server running on http://localhost:5050`

### 2. Verify Client Startup
```bash
npm run dev:client
```
Should see: `Local: http://localhost:5173`

### 3. Test Guest Authentication
1. Open http://localhost:5173
2. Click "Get Started" on landing page
3. Click "Start as Guest" on signup page
4. Should redirect to dashboard successfully

### 4. Test Action Logging
1. After guest login, go to dashboard
2. Try creating a new eco-action
3. Verify it saves and displays correctly

## 🚨 Common Issues & Solutions

### Port Conflicts
```bash
# If port 5050 is in use, update .env
PORT=3001
```

### Database Connection Errors
```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL
```

### Session Store Issues
```bash
# For development, use memory store
USE_PG_SESSION=false

# For production, ensure sessions table exists
npm run db:push
```

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

```
EcoLogWeb/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Route components
│   │   ├── components/    # Reusable UI components
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── replitAuth.ts     # Authentication middleware
│   └── storage.ts        # Database operations
├── shared/               # Shared types/schemas
├── migrations/           # Database migrations
└── package.json         # Dependencies & scripts
```

## 🔄 Development Workflow

### Starting Development
```bash
npm run dev              # Start both client & server
npm run dev:client       # Frontend only
npm run dev:server       # Backend only
```

### Building for Production
```bash
npm run build           # Build both client & server
npm run start           # Start production server
```

### Database Operations
```bash
npm run db:push         # Apply schema changes
npx drizzle-kit studio  # Open database GUI
```

## 🎯 Next Steps

1. **Customize Authentication**
   - Add proper user registration
   - Integrate with your preferred OAuth provider
   - Implement user profiles

2. **Deploy to Production**
   - Choose hosting platform (Vercel, Railway, DigitalOcean)
   - Set up production database
   - Configure environment variables

3. **Enhance Features**
   - Add more eco-action types
   - Implement leaderboards
   - Add data visualization

## 🆘 Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check the server terminal for error messages
3. Verify all environment variables are set correctly
4. Ensure PostgreSQL is running and accessible
5. Try deleting `node_modules` and reinstalling

The migration preserves all original functionality while making the app fully functional for local development with guest authentication support.