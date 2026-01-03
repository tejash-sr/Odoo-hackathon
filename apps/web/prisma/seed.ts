// Prisma Seed Data - GlobeTrotter Development
// Run with: npx prisma db seed

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Starting GlobeTrotter seed...');

  // Create demo user
  const passwordHash = await hash('demo123', 12);
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@globetrotter.app' },
  });

  if (existingUser) {
    console.log('✅ Demo user already exists');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: 'demo@globetrotter.app',
      passwordHash,
      firstName: 'Tejash',
      lastName: '',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      phone: '123',
      nationality: 'India',
      isVerified: true,
      isActive: true,
      xp: 2500,
      level: 5,
      streak: 7,
      profile: {
        create: {
          bio: 'Passionate traveler exploring the world one destination at a time! 🌍',
          currentTitle: 'Seasoned Voyager',
          totalTrips: 8,
          totalCountries: 12,
          totalDistance: 45000,
          theme: 'default',
          accentColor: '#4F46E5',
        },
      },
      preferences: {
        create: {
          currency: 'USD',
          language: 'en',
          distanceUnit: 'km',
          temperatureUnit: 'celsius',
          travelStyle: 'mid-range',
          pushEnabled: true,
          emailEnabled: true,
          flightAlerts: true,
          priceAlerts: true,
          weatherAlerts: true,
          tripReminders: true,
        },
      },
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create badges one by one (SQLite compatible)
  const badgeData = [
    {
      name: 'First Flight',
      description: 'Complete your first flight booking',
      category: 'traveler',
      iconUrl: '/badges/first-flight.svg',
      color: '#60A5FA',
      requirement: '{"type": "flights", "count": 1}',
      xpReward: 100,
      rarity: 'common',
    },
    {
      name: 'Globe Trotter',
      description: 'Visit 5 different countries',
      category: 'explorer',
      iconUrl: '/badges/globe-trotter.svg',
      color: '#34D399',
      requirement: '{"type": "countries", "count": 5}',
      xpReward: 500,
      rarity: 'rare',
    },
    {
      name: 'Master Planner',
      description: 'Complete all checklists for a trip',
      category: 'planner',
      iconUrl: '/badges/master-planner.svg',
      color: '#A78BFA',
      requirement: '{"type": "checklists", "complete": true}',
      xpReward: 250,
      rarity: 'uncommon',
    },
    {
      name: 'Early Bird',
      description: 'Book a trip 3 months in advance',
      category: 'planner',
      iconUrl: '/badges/early-bird.svg',
      color: '#F59E0B',
      requirement: '{"type": "advance_booking", "days": 90}',
      xpReward: 150,
      rarity: 'common',
    },
  ];

  const badges = [];
  for (const data of badgeData) {
    const badge = await prisma.badge.create({ data });
    badges.push(badge);
  }

  console.log(`✅ Created ${badges.length} badges`);

  // Create achievements one by one
  const achievementData = [
    {
      name: 'Distance Traveler',
      description: 'Travel a total of 50,000 km',
      category: 'explorer',
      iconUrl: '/achievements/distance.svg',
      color: '#60A5FA',
      targetValue: 50000,
      unit: 'km',
      xpReward: 1000,
      rarity: 'epic',
    },
    {
      name: 'Trip Master',
      description: 'Complete 25 trips',
      category: 'traveler',
      iconUrl: '/achievements/trips.svg',
      color: '#34D399',
      targetValue: 25,
      unit: 'trips',
      xpReward: 800,
      rarity: 'rare',
    },
  ];

  const achievements = [];
  for (const data of achievementData) {
    const achievement = await prisma.achievement.create({ data });
    achievements.push(achievement);
  }

  console.log(`✅ Created ${achievements.length} achievements`);

  // Create sample trip - Japan Adventure
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: 'Japan Adventure',
      description: 'An amazing journey through Japan, exploring Tokyo, Kyoto, and Osaka',
      coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
      status: 'planned',
      visibility: 'private',
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-04-28'),
      timezone: 'Asia/Tokyo',
      readinessScore: 75,
      totalBudget: 5000,
      totalSpent: 1200,
      currency: 'USD',
      destinations: {
        create: [
          {
            name: 'Tokyo',
            country: 'Japan',
            countryCode: 'JP',
            city: 'Tokyo',
            latitude: 35.6762,
            longitude: 139.6503,
            timezone: 'Asia/Tokyo',
            arrivalDate: new Date('2026-04-15'),
            departureDate: new Date('2026-04-20'),
            orderIndex: 0,
          },
          {
            name: 'Kyoto',
            country: 'Japan',
            countryCode: 'JP',
            city: 'Kyoto',
            latitude: 35.0116,
            longitude: 135.7681,
            timezone: 'Asia/Tokyo',
            arrivalDate: new Date('2026-04-20'),
            departureDate: new Date('2026-04-25'),
            orderIndex: 1,
          },
        ],
      },
      budget: {
        create: {
          totalBudget: 5000,
          currency: 'USD',
        },
      },
    },
  });

  console.log(`✅ Created trip: ${trip.name}`);

  // Create user documents
  await prisma.document.create({
    data: {
      userId: user.id,
      type: 'passport',
      name: 'US Passport',
      documentNumber: 'XXXXXXX1234',
      issueDate: new Date('2020-06-15'),
      expiryDate: new Date('2030-06-14'),
      issuingCountry: 'United States',
      isVerified: true,
    },
  });

  console.log('✅ Created user documents');

  // Award a badge to user
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (userProfile) {
    const firstFlightBadge = badges.find(b => b.name === 'First Flight');

    if (firstFlightBadge) {
      await prisma.userBadge.create({
        data: {
          profileId: userProfile.id,
          badgeId: firstFlightBadge.id,
          userId: user.id,
        },
      });
    }

    console.log('✅ Awarded badges to user');
  }

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📧 Demo Account:');
  console.log('   Email: demo@globetrotter.app');
  console.log('   Password: demo123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
