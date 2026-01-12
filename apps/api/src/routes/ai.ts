import { Router, type Router as ExpressRouter } from 'express';
import OpenAI from 'openai';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import NodeCache from 'node-cache';

const router: ExpressRouter = Router();

// Cache for AI responses (TTL: 1 hour)
const cache = new NodeCache({ stdTTL: 3600 });

// OpenAI client (will be null if API key not provided)
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Trip planning suggestions
router.post('/plan-trip', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { destination, startDate, endDate, budget, travelers, interests, tripType } = req.body;

    if (!destination) {
      throw new AppError('Destination is required', 400);
    }

    // Check cache first
    const cacheKey = `plan-${destination}-${startDate}-${endDate}-${interests?.join(',')}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // If OpenAI not configured, return mock data
    if (!openai) {
      const mockPlan = generateMockTripPlan(destination, startDate, endDate, interests);
      cache.set(cacheKey, mockPlan);
      return res.json({
        success: true,
        data: mockPlan,
        cached: false,
      });
    }

    // Generate with OpenAI
    const prompt = `Create a detailed travel itinerary for a trip to ${destination} from ${startDate} to ${endDate}.
    
Budget: ${budget || 'Moderate'}
Number of travelers: ${travelers || 1}
Interests: ${interests?.join(', ') || 'General sightseeing'}
Trip type: ${tripType || 'Mixed'}

Please provide:
1. A day-by-day itinerary with specific activities, times, and locations
2. Estimated costs for major activities
3. Restaurant recommendations
4. Practical tips for the destination
5. Must-see attractions and hidden gems

Format the response as JSON with the following structure:
{
  "overview": "Brief trip overview",
  "dailyItinerary": [
    {
      "day": 1,
      "theme": "Theme of the day",
      "activities": [
        {
          "time": "9:00 AM",
          "title": "Activity name",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": "$20",
          "location": "Address or area",
          "tips": "Any useful tips"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": "$X per night",
    "food": "$X per day",
    "activities": "$X total",
    "transport": "$X total"
  },
  "packingList": ["item1", "item2"],
  "practicalTips": ["tip1", "tip2"],
  "emergencyInfo": {
    "embassy": "Contact info",
    "emergency": "911 equivalent",
    "hospital": "Nearest hospital"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert travel planner with deep knowledge of destinations worldwide. Provide detailed, practical, and personalized travel recommendations.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    });

    const plan = JSON.parse(completion.choices[0].message.content || '{}');
    cache.set(cacheKey, plan);

    res.json({
      success: true,
      data: plan,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
});

// Chat with AI assistant
router.post('/chat', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    // If OpenAI not configured, return mock response
    if (!openai) {
      return res.json({
        success: true,
        data: {
          response: generateMockChatResponse(message),
          suggestions: [
            'What are the best restaurants in the area?',
            'How do I get from the airport to the city center?',
            'What\'s the weather like this time of year?',
          ],
        },
      });
    }

    const systemPrompt = context?.tripId
      ? `You are a helpful travel assistant for a trip to ${context.destination || 'the destination'}. The trip is from ${context.startDate} to ${context.endDate}. Provide concise, helpful answers about the trip, local recommendations, and travel tips.`
      : 'You are a helpful travel planning assistant. Help users plan their trips, discover destinations, and provide travel advice. Be concise and practical.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
    });

    res.json({
      success: true,
      data: {
        response: completion.choices[0].message.content,
        suggestions: generateFollowUpSuggestions(message),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get destination recommendations
router.post('/recommend-destinations', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { preferences, budget, duration, season } = req.body;

    // Return mock recommendations
    const recommendations = [
      {
        destination: 'Tokyo, Japan',
        matchScore: 95,
        reason: 'Perfect blend of culture, technology, and cuisine that matches your interests.',
        highlights: ['Cherry blossoms in spring', 'World-class food scene', 'Efficient public transport'],
        estimatedBudget: { min: 150, max: 250, currency: 'USD', perDay: true },
      },
      {
        destination: 'Barcelona, Spain',
        matchScore: 88,
        reason: 'Great for your love of architecture, beaches, and vibrant nightlife.',
        highlights: ['Gaudí architecture', 'Mediterranean beaches', 'Amazing tapas'],
        estimatedBudget: { min: 100, max: 180, currency: 'USD', perDay: true },
      },
      {
        destination: 'Bali, Indonesia',
        matchScore: 85,
        reason: 'Affordable destination with beautiful nature and spiritual experiences.',
        highlights: ['Rice terraces', 'Temple visits', 'Yoga retreats'],
        estimatedBudget: { min: 50, max: 100, currency: 'USD', perDay: true },
      },
    ];

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
});

// Get activity suggestions
router.post('/suggest-activities', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { destination, date, existingActivities, preferences } = req.body;

    // Return mock activity suggestions
    const suggestions = [
      {
        id: '1',
        title: 'Morning Temple Visit',
        type: 'sightseeing',
        duration: '3 hours',
        bestTime: '7:00 AM - 10:00 AM',
        cost: { amount: 15, currency: 'USD' },
        description: 'Visit the famous temple before the crowds arrive.',
        tips: 'Dress modestly, bring water, arrive early for sunrise views.',
      },
      {
        id: '2',
        title: 'Food Tour in Old Town',
        type: 'food',
        duration: '4 hours',
        bestTime: '11:00 AM - 3:00 PM',
        cost: { amount: 45, currency: 'USD' },
        description: 'Sample local delicacies with a knowledgeable guide.',
        tips: 'Come hungry! The tour includes 8-10 food stops.',
      },
      {
        id: '3',
        title: 'Sunset Rooftop Bar',
        type: 'experience',
        duration: '2 hours',
        bestTime: '5:00 PM - 7:00 PM',
        cost: { amount: 25, currency: 'USD' },
        description: 'Watch the sunset over the city skyline.',
        tips: 'Make reservations in advance, smart casual dress code.',
      },
    ];

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
});

// Generate packing list
router.post('/packing-list', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { destination, startDate, endDate, activities, climate } = req.body;

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const packingList = {
      essentials: [
        'Passport and travel documents',
        'Credit/debit cards',
        'Travel insurance documents',
        'Phone and charger',
        'Portable power bank',
        'Universal adapter',
      ],
      clothing: [
        `${Math.min(days, 7)} t-shirts/tops`,
        `${Math.min(Math.ceil(days / 2), 4)} pants/shorts`,
        `${days + 2} underwear`,
        `${Math.min(days, 7)} pairs of socks`,
        'Light jacket or sweater',
        'Comfortable walking shoes',
        'Sandals or flip-flops',
      ],
      toiletries: [
        'Toothbrush and toothpaste',
        'Shampoo and conditioner (travel size)',
        'Deodorant',
        'Sunscreen (SPF 30+)',
        'Medications',
        'First aid kit basics',
      ],
      electronics: [
        'Camera',
        'Headphones',
        'E-reader or book',
        'Laptop (if needed)',
      ],
      miscellaneous: [
        'Reusable water bottle',
        'Daypack or small backpack',
        'Sunglasses',
        'Travel pillow',
        'Snacks for travel',
      ],
    };

    res.json({
      success: true,
      data: packingList,
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions for mock data
function generateMockTripPlan(destination: string, startDate: string, endDate: string, interests?: string[]) {
  return {
    overview: `An exciting trip to ${destination} filled with unique experiences and discoveries.`,
    dailyItinerary: [
      {
        day: 1,
        theme: 'Arrival & Exploration',
        activities: [
          {
            time: '10:00 AM',
            title: 'Arrive and check in',
            description: 'Settle into your accommodation and freshen up',
            duration: '2 hours',
            cost: 'Included in accommodation',
            location: 'Hotel/Accommodation',
            tips: 'Request early check-in if possible',
          },
          {
            time: '1:00 PM',
            title: 'Lunch at local restaurant',
            description: 'Try the local cuisine',
            duration: '1.5 hours',
            cost: '$15-25',
            location: 'City center',
            tips: 'Ask locals for recommendations',
          },
          {
            time: '3:00 PM',
            title: 'Walking tour of main attractions',
            description: 'Get oriented with the city layout',
            duration: '3 hours',
            cost: '$20-30',
            location: 'Historic district',
            tips: 'Wear comfortable shoes',
          },
        ],
      },
      {
        day: 2,
        theme: 'Culture & History',
        activities: [
          {
            time: '9:00 AM',
            title: 'Visit main museum',
            description: 'Explore local history and art',
            duration: '3 hours',
            cost: '$15',
            location: 'Museum district',
            tips: 'Book tickets online to skip lines',
          },
          {
            time: '12:30 PM',
            title: 'Lunch at market',
            description: 'Experience local market food',
            duration: '1.5 hours',
            cost: '$10-15',
            location: 'Central market',
            tips: 'Try multiple small dishes',
          },
          {
            time: '2:30 PM',
            title: 'Historic site visit',
            description: 'Learn about local heritage',
            duration: '2 hours',
            cost: '$12',
            location: 'Historic quarter',
            tips: 'Join a guided tour for best experience',
          },
        ],
      },
    ],
    budgetBreakdown: {
      accommodation: '$80-150 per night',
      food: '$40-60 per day',
      activities: '$100-200 total',
      transport: '$50-100 total',
    },
    packingList: [
      'Comfortable walking shoes',
      'Light layers',
      'Sunscreen',
      'Reusable water bottle',
      'Camera',
      'Travel adapter',
    ],
    practicalTips: [
      'Download offline maps before your trip',
      'Learn a few basic phrases in the local language',
      'Keep copies of important documents',
      'Register with your embassy if traveling long-term',
    ],
    emergencyInfo: {
      emergency: '112',
      police: 'Local police number',
      hospital: 'Nearest international hospital',
    },
  };
}

function generateMockChatResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
    return 'I recommend trying local restaurants in the old town area. They offer authentic cuisine at reasonable prices. Look for places where locals eat - that\'s usually a sign of good food! Would you like specific restaurant recommendations?';
  }
  
  if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
    return 'The weather varies by season. For the most comfortable experience, pack layers and be prepared for occasional rain. Check the local forecast a few days before your trip for the most accurate information.';
  }
  
  if (lowerMessage.includes('transport') || lowerMessage.includes('getting around')) {
    return 'Public transportation is usually the most efficient way to get around. Consider getting a travel card for unlimited rides. Rideshare apps are also available in most cities. For shorter distances, walking is a great way to discover hidden gems!';
  }
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('money')) {
    return 'A moderate daily budget would be around $100-150 including accommodation, food, and activities. You can save money by eating at local spots, using public transport, and visiting free attractions. Always have some local currency for smaller shops.';
  }
  
  return 'That\'s a great question! I\'d be happy to help you plan your trip. Could you provide more details about what specific aspect you\'d like assistance with? I can help with itineraries, recommendations, budgeting, or practical travel tips.';
}

function generateFollowUpSuggestions(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('restaurant') || lowerMessage.includes('food')) {
    return [
      'What are vegetarian-friendly options?',
      'Where can I find street food?',
      'What\'s the typical tipping culture?',
    ];
  }
  
  return [
    'What activities do you recommend?',
    'What should I pack for this trip?',
    'What are the must-see attractions?',
  ];
}

export default router;
