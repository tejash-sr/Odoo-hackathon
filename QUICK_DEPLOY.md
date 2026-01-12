# ⚡ Quick Vercel Deploy - TL;DR

## 🎯 5-Minute Deploy

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. Go to [vercel.com](https://vercel.com)
- Click "Add New" → "Project"
- Import your GitHub repo

### 3. Configure:
**Root Directory:** `apps/web` ⚠️

**Build Command:**
```bash
cd ../.. && pnpm install && pnpm build --filter=@globetrotter/web
```

### 4. Environment Variables:
```env
DATABASE_URL=your_postgres_url
DIRECT_URL=your_postgres_url
JWT_SECRET=generate_random_64_chars
JWT_REFRESH_SECRET=generate_random_64_chars
NODE_ENV=production
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Click Deploy! 🚀

### 6. After Deploy - Run Migrations:
```bash
vercel link
cd apps/web
npx prisma migrate deploy
```

---

## 🗄️ Database Options

**Easy:** [Vercel Postgres](https://vercel.com/storage/postgres)

**Free Options:**
- [Neon](https://neon.tech) (Recommended)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

---

## ✅ Demo Credentials

Email: `demo@globetrotter.com`
Password: `Demo123!`

---

## 🐛 Quick Fixes

**Build fails?**
```bash
pnpm build  # Test locally first
```

**Database errors?**
- Check DATABASE_URL format
- Ensure database allows external connections

**Missing environment variables?**
- Redeploy after adding them
- Use `NEXT_PUBLIC_` for client-side vars

---

## 📚 Full Guide

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.
