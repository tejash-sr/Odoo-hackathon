import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';

type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'draft';

interface Trip {
  id: string;
  title: string;
  destination: string;
  image: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  daysAway?: number;
  progress?: number;
}

const trips: Trip[] = [
  {
    id: '1',
    title: 'Japan Adventure',
    destination: 'Tokyo, Kyoto, Osaka',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    startDate: 'Apr 15, 2026',
    endDate: 'Apr 28, 2026',
    status: 'upcoming',
    daysAway: 102,
  },
  {
    id: '2',
    title: 'Italian Getaway',
    destination: 'Rome, Florence, Venice',
    image: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&q=80',
    startDate: 'Feb 10, 2026',
    endDate: 'Feb 20, 2026',
    status: 'ongoing',
    progress: 65,
  },
  {
    id: '3',
    title: 'Greek Islands',
    destination: 'Santorini, Mykonos',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    startDate: 'Jan 5, 2026',
    endDate: 'Jan 12, 2026',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Bali Retreat',
    destination: 'Ubud, Seminyak',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    startDate: '',
    endDate: '',
    status: 'draft',
  },
];

const statusConfig: Record<TripStatus, { label: string; color: string; bg: string }> = {
  upcoming: { label: 'Upcoming', color: '#3b82f6', bg: '#dbeafe' },
  ongoing: { label: 'Ongoing', color: '#22c55e', bg: '#dcfce7' },
  completed: { label: 'Completed', color: '#64748b', bg: '#f1f5f9' },
  draft: { label: 'Draft', color: '#f59e0b', bg: '#fef3c7' },
};

export default function TripsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [filter, setFilter] = React.useState<TripStatus | 'all'>('all');

  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(t => t.status === filter);

  const renderTrip = ({ item }: { item: Trip }) => {
    const status = statusConfig[item.status];
    
    return (
      <TouchableOpacity
        style={[styles.tripCard, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/trip/${item.id}`)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.tripImage} />
        <View style={styles.tripOverlay} />
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        {/* Days Away Badge */}
        {item.status === 'upcoming' && item.daysAway && (
          <View style={styles.daysAwayBadge}>
            <Text style={styles.daysAwayText}>{item.daysAway} days</Text>
          </View>
        )}

        <View style={styles.tripContent}>
          <Text style={styles.tripTitle}>{item.title}</Text>
          <View style={styles.tripMeta}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.tripLocation}>{item.destination}</Text>
          </View>
          {item.startDate && (
            <View style={styles.tripMeta}>
              <Ionicons name="calendar-outline" size={14} color="#fff" />
              <Text style={styles.tripDate}>
                {item.startDate} - {item.endDate}
              </Text>
            </View>
          )}
          
          {/* Progress Bar for Ongoing */}
          {item.status === 'ongoing' && item.progress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{item.progress}% complete</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Trips</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/trip/new')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {(['all', 'upcoming', 'ongoing', 'completed', 'draft'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterTab,
              filter === status && { backgroundColor: colors.primary },
              filter !== status && { backgroundColor: colors.card },
            ]}
            onPress={() => setFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === status ? '#fff' : colors.text },
              ]}
            >
              {status === 'all' ? 'All' : statusConfig[status].label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trips List */}
      <FlatList
        data={filteredTrips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tripsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No trips found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Start planning your next adventure
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/trip/new')}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.emptyButtonText}>Create Trip</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tripsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tripCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    height: 220,
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  daysAwayBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  daysAwayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  tripContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  tripTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  tripLocation: {
    color: '#fff',
    fontSize: 14,
  },
  tripDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
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
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 24,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
