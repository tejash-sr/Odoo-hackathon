# 🚀 Vercel Deployment Guide for GlobeTrotter

## ✅ Pre-Deployment Checklist

Your project is now **build-ready**! All compilation errors have been fixed:
- ✅ Web application builds successfully
- ✅ API builds successfully
- ✅ Prisma client generates correctly
- ✅ TypeScript errors resolved
- ✅ Demo login feature implemented

---

## 📋 Step-by-Step Deployment

### 1. **Prepare Your GitHub Repository**

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for Vercel deployment"

# Add your GitHub repository as remote
git remote add origin YOUR_GITHUB_REPO_URL

# Push to main branch
git push -u origin main
```

---

### 2. **Set Up Database (Choose One Option)**

#### **Option A: Vercel Postgres (Recommended for ease)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose your database name and region
5. Copy the connection string provided

#### **Option B: External PostgreSQL (Recommended for production)**

Use any external provider:
- [Neon](https://neon.tech) - Serverless Postgres (Free tier available)
- [Supabase](https://supabase.com) - Open source alternative (Free tier)
- [Railway](https://railway.app) - Deploy Postgres with $5 credit
- [ElephantSQL](https://www.elephantsql.com) - Managed Postgres

**Get your connection string** in this format:
```
postgresql://username:password@host:5432/database_name
```

---

### 3. **Deploy to Vercel**

#### **Via Vercel Dashboard (Easiest Method)**

1. **Go to [Vercel](https://vercel.com) and sign in**

2. **Click "Add New..." → "Project"**

3. **Import Your Git Repository**
   - Select your GlobeTrotter repository
   - Click "Import"

4. **Configure Project Settings**

   **Framework Preset:** `Next.js`

   **Root Directory:** `apps/web` ⚠️ **IMPORTANT!**

   **Build Command:**
   ```bash
   cd ../.. && pnpm install && pnpm build --filter=@globetrotter/web
   ```

   **Output Directory:** `.next` (default)

   **Install Command:**
   ```bash
   pnpm install
   ```

5. **Add Environment Variables**

   Click "Environment Variables" and add these:

   | Name | Value | Notes |
   |------|-------|-------|
   | `DATABASE_URL` | `your_postgres_connection_string` | From Step 2 |
   | `DIRECT_URL` | `your_postgres_connection_string` | Same as DATABASE_URL |
   | `JWT_SECRET` | `your-super-secret-jwt-key-here` | Generate a random 64-char string |
   | `JWT_REFRESH_SECRET` | `your-refresh-secret-key-here` | Different from JWT_SECRET |
   | `NEXT_PUBLIC_API_URL` | `https://your-api-url.vercel.app` | Leave blank for now, update after API deploy |
   | `NODE_ENV` | `production` | Set to production |

   **To generate secure secrets:**
   ```bash
   # Run this in terminal to generate random secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-5 minutes for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

---

### 4. **Run Database Migrations**

After deployment, you need to initialize your database:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Link your project:**
   ```bash
   cd d:\oddo\globetrotter
   vercel link
   ```

3. **Pull environment variables:**
   ```bash
   vercel env pull
   ```

4. **Run Prisma migrations:**
   ```bash
   cd apps/web
   npx prisma migrate deploy
   ```

   Or use Prisma Studio to seed initial data:
   ```bash
   npx prisma studio
   ```

---

### 5. **Deploy the API (Optional - Separate Deployment)**

If you want to deploy the Express API separately:

1. **Create a new Vercel project** for the API
2. **Root Directory:** `apps/api`
3. **Build Command:**
   ```bash
   cd ../.. && pnpm install && pnpm build --filter=@globetrotter/api
   ```
4. **Add same environment variables** as the web app
5. **Update `NEXT_PUBLIC_API_URL`** in the web app with the API URL

---

### 6. **Post-Deployment Tasks**

#### **A. Test Your Deployment**

1. Visit your deployed URL
2. Test the **Demo Login** feature:
   - Email: `demo@globetrotter.com`
   - Password: `Demo123!`
3. Check all main pages work
4. Test creating a trip

#### **B. Set Up Custom Domain (Optional)**

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

#### **C. Configure Production Settings**

Update your `.env.production` file:
```env
# Production Environment Variables
DATABASE_URL="your_production_database_url"
DIRECT_URL="your_production_database_url"
JWT_SECRET="your_production_jwt_secret"
JWT_REFRESH_SECRET="your_production_refresh_secret"
NEXT_PUBLIC_API_URL="https://your-production-api.vercel.app"
NODE_ENV="production"
```

---

## 🔧 Troubleshooting Common Issues

### **Issue 1: Build Fails with "Cannot find module '@prisma/client'"**

**Solution:**
- Ensure `prisma generate` runs before `next build`
- Check your build command includes: `prisma generate && next build`

### **Issue 2: Database Connection Errors**

**Solution:**
- Verify `DATABASE_URL` is set correctly in Vercel
- Check if database allows connections from Vercel IPs
- For Vercel Postgres, use the "Prisma" connection string format

### **Issue 3: API Routes Return 404**

**Solution:**
- Make sure you're deploying from `apps/web` root directory
- Verify API routes are in `apps/web/src/app/api/` directory
- Check Vercel deployment logs for errors

### **Issue 4: Environment Variables Not Working**

**Solution:**
- Redeploy after adding new environment variables
- Environment variables only apply to new deployments
- Use `NEXT_PUBLIC_` prefix for client-side variables

### **Issue 5: Monorepo Build Fails**

**Solution:**
- Ensure pnpm workspace is configured correctly
- Update build command to include parent directory:
  ```bash
  cd ../.. && pnpm install && pnpm build --filter=@globetrotter/web
  ```

---

## 📊 Verify Build Success

Before deploying, run this command to ensure everything works:

```bash
# From root directory
pnpm build

# Should show:
# ✓ @globetrotter/api:build
# ✓ @globetrotter/web:build
# Tasks: 2 successful, 2 total
```

---

## 🎯 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Database created and connection string obtained
- [ ] Vercel project created
- [ ] Root directory set to `apps/web`
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Database migrations run
- [ ] Demo login tested
- [ ] All pages accessible
- [ ] Custom domain configured (optional)

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma on Vercel:** https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

---

## 🎉 Success!

Your GlobeTrotter app is now live! Share this with hackathon judges:

**Live Demo:** `https://your-project.vercel.app`

**Demo Credentials:**
- Email: `demo@globetrotter.com`
- Password: `Demo123!`

**Features Implemented:** 11/13 hackathon requirements (85% completion)

Good luck with your hackathon! 🚀
