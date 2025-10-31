# Vercel Deployment Guide for EcoLog

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sanikapatil22/ecoLog)

## Manual Deployment Steps

### 1. Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `sanikapatil22/ecoLog`

### 2. Configure Build Settings

Vercel should automatically detect the settings from `vercel.json`, but verify:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### 3. Environment Variables

Add these environment variables in your Vercel project settings:

**Required:**
- `SESSION_SECRET` - A random secure string for session encryption (generate with: `openssl rand -base64 32`)
- `NODE_ENV` - Set to `production`

**Optional (for database):**
- `DATABASE_URL` - Your Neon/PostgreSQL connection string (if using database instead of in-memory storage)
- `USE_PG_SESSION` - Set to `true` if using PostgreSQL for sessions

**Optional (for OIDC authentication):**
- `OIDC_CLIENT_ID` - Your OIDC client ID
- `OIDC_CLIENT_SECRET` - Your OIDC client secret
- `OIDC_ISSUER` - Your OIDC issuer URL

### 4. Deploy

Click "Deploy" and Vercel will:
1. Clone your repository
2. Install dependencies
3. Run the build command
4. Deploy your application

## Features

- ✅ Guest authentication (works without database)
- ✅ In-memory storage for local/guest usage
- ✅ Optional PostgreSQL database support
- ✅ Session management
- ✅ API endpoints for eco-actions
- ✅ Static file serving

## Post-Deployment

After deployment:

1. Visit your Vercel URL
2. Click "Start as Guest" to test the app
3. Log eco-friendly actions
4. View your impact metrics

## Troubleshooting

### Build Fails

If the build fails, check:
- All dependencies are in `package.json`
- `npm run build` works locally
- Environment variables are set correctly

### Database Connection Issues

If you see database errors:
- The app will automatically fall back to in-memory storage
- Guest authentication will still work
- Data will be stored in memory (not persistent across restarts)

To use persistent storage:
- Set up a Neon database (free tier available)
- Add `DATABASE_URL` environment variable
- Redeploy

### Session Issues

If you have session/authentication issues:
- Make sure `SESSION_SECRET` is set
- Check that cookies are enabled in your browser
- For production, use `USE_PG_SESSION=false` for in-memory sessions

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:5174
```

## Production Build Locally

```bash
# Build the app
npm run build

# Run production server
npm start

# Visit http://localhost:5050
```

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL (optional, uses in-memory fallback)
- **Authentication**: Passport.js with guest fallback
- **Deployment**: Vercel

## Support

For issues or questions:
- Check the [Migration Guide](./MIGRATION_GUIDE.md)
- Review server logs in Vercel dashboard
- Open an issue on GitHub
