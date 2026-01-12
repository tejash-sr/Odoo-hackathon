# 🔑 Demo Credentials for Judges

## Web Application
**URL**: http://localhost:3000

### Demo Account 1 (Primary)
- **Email**: `demo@globetrotter.com`
- **Password**: `Demo123!`
- **Description**: Main demo account with sample trips and data

### Demo Account 2 (Alternative)
- **Email**: `judge@hackathon.com`
- **Password**: `Judge2026!`
- **Description**: Clean account for testing trip creation flow

### Admin Account (Optional)
- **Email**: `admin@globetrotter.com`
- **Password**: `Admin123!`
- **Description**: Account with elevated permissions (if admin features are enabled)

---

## Mobile Application
**Platform**: iOS / Android (via Expo Go)

Use the same credentials as web application:
- Email: `demo@globetrotter.com`
- Password: `Demo123!`

**To Run Mobile App**:
```bash
cd apps/mobile
npm run start
# Scan QR code with Expo Go app
```

---

## Quick Start for Judges

### 1. **Setup & Installation**
```bash
# Clone or extract the project
cd globetrotter

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Run database migrations (if using PostgreSQL)
npx prisma migrate dev
npx prisma db seed

# Start development servers
pnpm dev
```

### 2. **Access the Application**
- **Web**: http://localhost:3000
- **API**: http://localhost:3001
- **Mobile**: Use Expo Go app + QR code

### 3. **Login**
- Navigate to http://localhost:3000/login
- Use demo credentials above
- Explore the dashboard and features

### 4. **Key Features to Test**

#### ✅ Authentication
1. Go to `/login`
2. Try demo credentials
3. Check password validation on `/register`
4. Test "Remember Me" functionality

#### ✅ Dashboard
1. View upcoming trips on home page
2. Check readiness score breakdown
3. Use quick actions menu
4. Review recent activity feed

#### ✅ Trip Creation
1. Click "Plan New Trip" button
2. Follow the 4-step wizard:
   - **Step 1**: Name & destinations
   - **Step 2**: Dates
   - **Step 3**: Trip type & travelers
   - **Step 4**: Budget
3. Save and view created trip

#### ✅ Trip Management
1. Go to "My Trips" page
2. Filter by status (Planning, Upcoming, etc.)
3. Toggle between Grid and List view
4. Search for trips
5. Click on a trip to view details

#### ✅ Itinerary Builder
1. Open any trip
2. Click "Itinerary" tab
3. Try adding activities (Plus button)
4. Drag and drop to reorder
5. Edit activity times and costs
6. View AI suggestions

#### ✅ Budget Tracking
1. In trip detail page, click "Budget" tab
2. View cost breakdown by category
3. Check spending vs budget progress
4. See average cost per day

#### ✅ City & Activity Search
1. Go to "Explore" page
2. Search for destinations
3. Filter by category
4. Click on a city for details
5. Browse popular destinations

#### ✅ Calendar/Timeline View
1. Open a trip
2. View day-by-day timeline
3. Expand/collapse days
4. See activity time blocks
5. Check weather for each day

#### ✅ Profile & Settings
1. Go to Profile page
2. Edit user information
3. Toggle dark/light mode
4. View achievements and badges
5. Check travel statistics

#### ✅ Analytics (Personal)
1. Go to Analytics page
2. View trip statistics
3. Check spending patterns
4. See top destinations
5. Review monthly trends

---

## Sample Data Available

The demo account includes:
- **4 Sample Trips**:
  - Japan Adventure (Upcoming)
  - European Summer (Planning)
  - Bali Retreat (Planning)
  - New York City Weekend (Completed)

- **Sample Destinations**:
  - Pre-populated popular cities
  - With ratings, reviews, and cost estimates

- **Sample Activities**:
  - Various activity types
  - Realistic timing and costs
  - Location data

---

## Environment Variables

If you need to set up from scratch, create `.env.local`:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/globetrotter"

# NextAuth / JWT
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenWeather API (for weather features)
OPENWEATHER_API_KEY="your-openweather-api-key"

# Optional: Google AI (Genkit)
GOOGLE_API_KEY="your-google-ai-api-key"

# Optional: Map Services
MAPBOX_TOKEN="your-mapbox-token"
```

---

## Troubleshooting

### Issue: Login fails
- **Solution**: Check if database is running and migrations are applied
- Run: `npx prisma migrate dev` and `npx prisma db seed`

### Issue: Demo account doesn't exist
- **Solution**: Run the seed script to create demo users
- Run: `npx prisma db seed`

### Issue: Port already in use
- **Solution**: Change port in `package.json` or kill existing process
- Web runs on port 3000, API on 3001

### Issue: Dependencies not installed
- **Solution**: Make sure pnpm is installed globally
- Run: `npm install -g pnpm` then `pnpm install`

---

## Features Walkthrough Video

[Optional: Add link to demo video if available]

---

## Contact for Issues

If judges encounter any setup issues:
- Check `README.md` for detailed setup instructions
- Review `ERROR_RESOLUTION_SUMMARY.md` for common fixes
- Database setup guide: `DATABASE_SETUP.md`

---

## Quick Test Checklist for Judges

- [ ] Login with demo account
- [ ] Navigate dashboard
- [ ] Create a new trip
- [ ] View trip list
- [ ] Edit itinerary
- [ ] Check budget breakdown
- [ ] Browse explore page
- [ ] View profile & achievements
- [ ] Test dark mode toggle
- [ ] Try mobile responsive views
- [ ] Test search functionality
- [ ] View analytics page

---

*Last Updated: January 12, 2026*
*Project: GlobeTrotter - Ultimate Travel Companion Platform*
*Status: Ready for Demo* ✅
