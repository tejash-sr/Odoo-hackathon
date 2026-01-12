# 🚀 FINISH DEPLOYMENT - Quick Steps

## Step 1: Copy Your Database URLs (1 minute)

Open your `.env.local` file and paste your Vercel URLs:

```env
# Replace these two lines with your actual URLs (without the asterisks):

DATABASE_URL="paste_your_STORAGE_PRISMA_DATABASE_URL_here"
# ↑ Paste your STORAGE_PRISMA_DATABASE_URL

DIRECT_URL="paste_your_STORAGE_POSTGRES_URL_here"
# ↑ Paste your STORAGE_POSTGRES_URL
```

**Where to find them:**
- Go to Vercel Dashboard → Storage → prisma-postgres-purple-island
- Click ".env.local" tab
- Copy the full URLs (they start with `postgres://` or `postgresql://`)

---

## Step 2: Generate JWT Secrets (30 seconds)

Run this command TWICE in terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the outputs and paste in `.env.local`:
- First output → `JWT_SECRET`
- Second output → `JWT_REFRESH_SECRET`

---

## Step 3: Initialize Database (1 minute)

```bash
cd d:\oddo\globetrotter\apps\web

# Generate Prisma client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push
```

---

## Step 4: Test Locally (30 seconds)

```bash
cd d:\oddo\globetrotter
pnpm dev
```

Visit http://localhost:3000 and test demo login:
- Email: `demo@globetrotter.com`
- Password: `Demo123!`

---

## Step 5: Deploy to Vercel (2 minutes)

### Push to GitHub:
```bash
cd d:\oddo\globetrotter
git add .
git commit -m "Configure Vercel Postgres database"
git push origin main
```

### Deploy on Vercel:
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. **Set Root Directory:** `apps/web`
5. **Set Build Command:**
   ```bash
   cd ../.. && pnpm install && pnpm build --filter=@globetrotter/web
   ```
6. **Add Environment Variables** (same as your .env.local):
   - `DATABASE_URL` = your STORAGE_PRISMA_DATABASE_URL
   - `DIRECT_URL` = your STORAGE_POSTGRES_URL
   - `JWT_SECRET` = (generate with node command)
   - `JWT_REFRESH_SECRET` = (generate different one)
   - `NODE_ENV` = production

7. Click **Deploy**!

---

## ✅ Done!

After deployment:
- Your app will be live at `https://your-project.vercel.app`
- Database is connected and ready
- Demo login works for judges

**Total time: ~5 minutes** 🎉
