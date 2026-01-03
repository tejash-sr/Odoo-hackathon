import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', name: 'All', icon: 'globe-outline' },
  { id: 'trending', name: 'Trending', icon: 'trending-up' },
  { id: 'beach', name: 'Beach', icon: 'sunny-outline' },
  { id: 'adventure', name: 'Adventure', icon: 'compass-outline' },
  { id: 'city', name: 'City', icon: 'business-outline' },
  { id: 'nature', name: 'Nature', icon: 'leaf-outline' },
];

const destinations = [
  {
    id: '1',
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    rating: 4.9,
    reviews: 12453,
    price: '$$',
    trending: true,
  },
  {
    id: '2',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    rating: 4.8,
    reviews: 8932,
    price: '$$$',
    trending: true,
  },
  {
    id: '3',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.7,
    reviews: 15678,
    price: '$',
    trending: false,
  },
  {
    id: '4',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80',
    rating: 4.8,
    reviews: 24567,
    price: '$$$',
    trending: false,
  },
  {
    id: '5',
    name: 'Machu Picchu',
    country: 'Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
    rating: 4.9,
    reviews: 6789,
    price: '$$',
    trending: true,
  },
  {
    id: '6',
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    rating: 4.7,
    reviews: 11234,
    price: '$$$$',
    trending: true,
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'trending' && dest.trending);
    return matchesSearch && matchesCategory;
  });

  const renderDestination = ({ item }: { item: typeof destinations[0] }) => (
    <TouchableOpacity
      style={[styles.destCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/destination/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.destImageContainer}>
        <Image source={{ uri: item.image }} style={styles.destImage} />
        <TouchableOpacity
          style={[
            styles.favoriteBtn,
            favorites.includes(item.id) && styles.favoriteBtnActive,
          ]}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={favorites.includes(item.id) ? '#fff' : colors.text}
          />
        </TouchableOpacity>
        {item.trending && (
          <View style={styles.trendingBadge}>
            <Ionicons name="trending-up" size={12} color="#fff" />
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        )}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
      <View style={styles.destContent}>
        <Text style={[styles.destName, { color: colors.text }]}>{item.name}</Text>
        <View style={styles.destMeta}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.destCountry, { color: colors.textMuted }]}>
            {item.country}
          </Text>
        </View>
        <View style={styles.destRating}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={[styles.ratingText, { color: colors.text }]}>
            {item.rating}
          </Text>
          <Text style={[styles.reviewsText, { color: colors.textMuted }]}>
            ({item.reviews.toLocaleString()})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: colors.card }]}
        >
          <Ionicons name="options-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search destinations..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryBtn,
              activeCategory === cat.id
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon as any}
              size={18}
              color={activeCategory === cat.id ? '#fff' : colors.text}
            />
            <Text
              style={[
                styles.categoryText,
                { color: activeCategory === cat.id ? '#fff' : colors.text },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: colors.textMuted }]}>
          {filteredDestinations.length} destinations found
        </Text>
      </View>

      {/* Destinations Grid */}
      <FlatList
        data={filteredDestinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.destList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No destinations found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Try adjusting your search
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const cardWidth = (width - 52) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
  },
  destList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  destCard: {
    width: cardWidth,
    borderRadius: 16,
    overflow: 'hidden',
  },
  destImageContainer: {
    position: 'relative',
  },
  destImage: {
    width: '100%',
    height: 140,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBtnActive: {
    backgroundColor: '#ef4444',
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f97316',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22c55e',
  },
  destContent: {
    padding: 12,
  },
  destName: {
    fontSize: 16,
    fontWeight: '700',
  },
  destMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  destCountry: {
    fontSize: 13,
  },
  destRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
