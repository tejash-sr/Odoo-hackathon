# 🔧 Environment Setup - Complete These 3 Steps

## Step 1: Add Database URLs ✅

You have Vercel Postgres database: **prisma-postgres-purple-island**

Open `apps/web/.env.local` and replace these lines:

```env
# Replace this line:
DATABASE_URL="PASTE_YOUR_PRISMA_DATABASE_URL_HERE"
# With your PRISMA_DATABASE_URL (the one shown with many asterisks)

# Replace this line:
DIRECT_URL="PASTE_YOUR_POSTGRES_URL_HERE"
# With your POSTGRES_URL (another one from Vercel)
```

**Where to find these:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to Storage → Your database "prisma-postgres-purple-island"
3. Click ".env.local" tab
4. Copy the actual values (not the asterisks shown in UI)

---

## Step 2: Generate JWT Secrets 🔐

Run this command **twice** to generate two different secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**First run output** → Use for `JWT_SECRET`  
**Second run output** → Use for `JWT_REFRESH_SECRET`

Update these in `apps/web/.env.local`:
```env
JWT_SECRET="paste_first_generated_secret_here"
JWT_REFRESH_SECRET="paste_second_generated_secret_here"
```

---

## Step 3: Initialize Database 🗄️

After adding the URLs, run:

```bash
cd apps/web
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Set up the schema
- Prepare for data seeding

---

## ✅ Verification

Test your configuration:

```bash
# From apps/web directory
npx prisma studio
```

This should open Prisma Studio in your browser if everything is configured correctly.

---

## 🚀 Ready to Test Locally

After completing all 3 steps:

```bash
cd d:\oddo\globetrotter
pnpm dev
```

Then visit http://localhost:3000 and try the demo login:
- Email: `demo@globetrotter.com`
- Password: `Demo123!`

---

## 📋 Final Checklist

- [ ] DATABASE_URL set (from PRISMA_DATABASE_URL)
- [ ] DIRECT_URL set (from POSTGRES_URL)
- [ ] JWT_SECRET generated and set
- [ ] JWT_REFRESH_SECRET generated and set
- [ ] Database migrated (`prisma migrate dev`)
- [ ] Local dev server running (`pnpm dev`)

---

## 🆘 Need Your Database URLs?

In your Vercel dashboard:
1. Go to **Storage** → **prisma-postgres-purple-island**
2. Click **".env.local"** tab
3. Copy the actual connection strings (they'll be very long strings starting with `postgresql://` or `postgres://`)
4. You'll see something like:
   ```env
   POSTGRES_URL="postgres://default:abc123@ep-cool-name.region.postgres.vercel-storage.com:5432/verceldb"
   PRISMA_DATABASE_URL="postgresql://default:abc123@ep-cool-name.region.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connection_limit=1"
   ```

Use these exact strings in your `.env.local` file!
