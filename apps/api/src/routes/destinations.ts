import { Router } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Mock destination data
const destinations = [
  {
    id: '1',
    name: 'Tokyo',
    country: 'Japan',
    description: 'A fascinating blend of ancient traditions and cutting-edge technology.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    rating: 4.9,
    reviewCount: 12453,
    priceLevel: 3,
    category: ['Cultural', 'Urban', 'Food'],
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Mount Fuji', 'Tsukiji Market'],
    bestTime: 'March-May, September-November',
    avgCost: { min: 100, max: 200, currency: 'USD' },
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    id: '2',
    name: 'Paris',
    country: 'France',
    description: 'The City of Light captivates with world-class art, cuisine, and romance.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    rating: 4.8,
    reviewCount: 15678,
    priceLevel: 4,
    category: ['Romantic', 'Cultural', 'Food'],
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre'],
    bestTime: 'April-June, September-October',
    avgCost: { min: 150, max: 300, currency: 'USD' },
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: '3',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Tropical paradise with stunning temples, rice terraces, and beaches.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.7,
    reviewCount: 9834,
    priceLevel: 2,
    category: ['Beach', 'Nature', 'Spiritual'],
    highlights: ['Uluwatu Temple', 'Tegallalang Rice Terraces', 'Ubud', 'Seminyak Beach'],
    bestTime: 'April-October',
    avgCost: { min: 50, max: 100, currency: 'USD' },
    coordinates: { lat: -8.4095, lng: 115.1889 },
  },
  {
    id: '4',
    name: 'New York City',
    country: 'USA',
    description: 'The city that never sleeps offers endless entertainment and iconic landmarks.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    rating: 4.8,
    reviewCount: 18923,
    priceLevel: 5,
    category: ['Urban', 'Cultural', 'Shopping'],
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    bestTime: 'April-June, September-November',
    avgCost: { min: 200, max: 400, currency: 'USD' },
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: '5',
    name: 'Santorini',
    country: 'Greece',
    description: 'Breathtaking sunsets, white-washed buildings, and crystal-clear waters.',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    rating: 4.9,
    reviewCount: 7654,
    priceLevel: 4,
    category: ['Romantic', 'Beach', 'Scenic'],
    highlights: ['Oia Sunset', 'Red Beach', 'Ancient Thera', 'Wine Tasting'],
    bestTime: 'May-October',
    avgCost: { min: 120, max: 250, currency: 'USD' },
    coordinates: { lat: 36.3932, lng: 25.4615 },
  },
  {
    id: '6',
    name: 'Barcelona',
    country: 'Spain',
    description: 'Vibrant city with stunning architecture, beaches, and incredible nightlife.',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    rating: 4.7,
    reviewCount: 11234,
    priceLevel: 3,
    category: ['Cultural', 'Beach', 'Urban'],
    highlights: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Gothic Quarter'],
    bestTime: 'May-June, September-October',
    avgCost: { min: 80, max: 150, currency: 'USD' },
    coordinates: { lat: 41.3851, lng: 2.1734 },
  },
  {
    id: '7',
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'Ancient Incan citadel set high in the Andes Mountains.',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
    rating: 4.9,
    reviewCount: 6543,
    priceLevel: 3,
    category: ['Adventure', 'Historical', 'Nature'],
    highlights: ['Inca Trail', 'Sun Gate', 'Temple of the Sun', 'Huayna Picchu'],
    bestTime: 'April-October',
    avgCost: { min: 100, max: 200, currency: 'USD' },
    coordinates: { lat: -13.1631, lng: -72.545 },
  },
  {
    id: '8',
    name: 'Dubai',
    country: 'UAE',
    description: 'Futuristic city of superlatives with luxury shopping and ultramodern architecture.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    rating: 4.6,
    reviewCount: 8765,
    priceLevel: 5,
    category: ['Luxury', 'Urban', 'Shopping'],
    highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
    bestTime: 'November-March',
    avgCost: { min: 150, max: 350, currency: 'USD' },
    coordinates: { lat: 25.2048, lng: 55.2708 },
  },
];

// Get all destinations
router.get('/', optionalAuth, (req: AuthRequest, res) => {
  const { category, search, priceLevel, page = 1, limit = 10 } = req.query;

  let filtered = [...destinations];

  // Filter by category
  if (category && typeof category === 'string') {
    filtered = filtered.filter(d => 
      d.category.some(c => c.toLowerCase() === category.toLowerCase())
    );
  }

  // Search by name or country
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(searchLower) ||
      d.country.toLowerCase().includes(searchLower)
    );
  }

  // Filter by price level
  if (priceLevel) {
    filtered = filtered.filter(d => d.priceLevel <= Number(priceLevel));
  }

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginated = filtered.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginated,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / Number(limit)),
    },
  });
});

// Get single destination
router.get('/:id', optionalAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const destination = destinations.find(d => d.id === id);

  if (!destination) {
    return res.status(404).json({
      success: false,
      error: 'Destination not found',
    });
  }

  res.json({
    success: true,
    data: destination,
  });
});

// Get popular destinations
router.get('/featured/popular', optionalAuth, (req: AuthRequest, res) => {
  const popular = destinations
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 6);

  res.json({
    success: true,
    data: popular,
  });
});

// Get destinations by category
router.get('/category/:category', optionalAuth, (req: AuthRequest, res) => {
  const { category } = req.params;
  const filtered = destinations.filter(d =>
    d.category.some(c => c.toLowerCase() === category.toLowerCase())
  );

  res.json({
    success: true,
    data: filtered,
  });
});

// Get nearby destinations
router.get('/nearby/:lat/:lng', optionalAuth, (req: AuthRequest, res) => {
  const { lat, lng } = req.params;
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  // Simple distance calculation (not accurate for large distances)
  const withDistance = destinations.map(d => ({
    ...d,
    distance: Math.sqrt(
      Math.pow(d.coordinates.lat - userLat, 2) +
      Math.pow(d.coordinates.lng - userLng, 2)
    ),
  }));

  const nearby = withDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  res.json({
    success: true,
    data: nearby,
  });
});

export default router;
