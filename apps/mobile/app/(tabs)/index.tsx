import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';

const { width } = Dimensions.get('window');

const upcomingTrips = [
  {
    id: '1',
    title: 'Japan Adventure',
    destination: 'Tokyo, Kyoto',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    startDate: 'Apr 15, 2026',
    daysAway: 102,
  },
];

const quickActions = [
  { id: '1', icon: 'add-circle', label: 'New Trip', route: '/trip/new' },
  { id: '2', icon: 'compass', label: 'Explore', route: '/(tabs)/explore' },
  { id: '3', icon: 'sparkles', label: 'AI Plan', route: '/(tabs)/ai' },
  { id: '4', icon: 'map', label: 'Nearby', route: '/nearby' },
];

const popularDestinations = [
  { id: '1', name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&q=80' },
  { id: '2', name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
  { id: '3', name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>
              Good morning,
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'Traveler'} 👋
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationBtn, { backgroundColor: colors.card }]}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: colors.card }]}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <Text style={[styles.searchText, { color: colors.textMuted }]}>
            Where do you want to go?
          </Text>
        </TouchableOpacity>

        {/* Upcoming Trip */}
        {upcomingTrips.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Upcoming Trip
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/trips')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.tripCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/trip/${upcomingTrips[0].id}`)}
            >
              <Image
                source={{ uri: upcomingTrips[0].image }}
                style={styles.tripImage}
              />
              <View style={styles.tripOverlay} />
              <View style={styles.tripContent}>
                <View style={styles.tripBadge}>
                  <Text style={styles.tripBadgeText}>
                    {upcomingTrips[0].daysAway} days away
                  </Text>
                </View>
                <Text style={styles.tripTitle}>{upcomingTrips[0].title}</Text>
                <View style={styles.tripMeta}>
                  <Ionicons name="location" size={14} color="#fff" />
                  <Text style={styles.tripLocation}>
                    {upcomingTrips[0].destination}
                  </Text>
                  <Ionicons name="calendar" size={14} color="#fff" style={{ marginLeft: 12 }} />
                  <Text style={styles.tripDate}>{upcomingTrips[0].startDate}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickAction, { backgroundColor: colors.card }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name={action.icon as any} size={24} color={colors.primary} />
                </View>
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Popular Destinations
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsScroll}
          >
            {popularDestinations.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={styles.destinationCard}
                onPress={() => router.push(`/destination/${dest.id}`)}
              >
                <Image
                  source={{ uri: dest.image }}
                  style={styles.destinationImage}
                />
                <View style={styles.destinationOverlay} />
                <View style={styles.destinationContent}>
                  <Text style={styles.destinationName}>{dest.name}</Text>
                  <Text style={styles.destinationCountry}>{dest.country}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Suggestion Banner */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.aiBanner}
            onPress={() => router.push('/(tabs)/ai')}
          >
            <View style={styles.aiContent}>
              <View style={styles.aiIcon}>
                <Ionicons name="sparkles" size={24} color="#fff" />
              </View>
              <View style={styles.aiText}>
                <Text style={styles.aiTitle}>AI Trip Planner</Text>
                <Text style={styles.aiSubtitle}>
                  Let AI create your perfect itinerary
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
  },
  searchText: {
    fontSize: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  tripCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  tripContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  tripBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  tripBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tripTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripLocation: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  tripDate: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  destinationsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  destinationCard: {
    width: 160,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  destinationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  destinationContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  destinationName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  destinationCountry: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  aiBanner: {
    marginHorizontal: 20,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiText: {},
  aiTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  aiSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
  },
});
