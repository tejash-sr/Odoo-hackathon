import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';

const { width } = Dimensions.get('window');

// Mock trip data
const getTripData = (id: string) => ({
  id,
  title: 'Japanese Adventure',
  destination: 'Tokyo, Japan',
  coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  startDate: '2024-04-15',
  endDate: '2024-04-25',
  status: 'upcoming',
  budget: {
    total: 5000,
    spent: 2150,
    currency: 'USD',
  },
  travelers: [
    { id: '1', name: 'Alex', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=3' },
  ],
  itinerary: [
    {
      day: 1,
      date: '2024-04-15',
      title: 'Arrival & Shibuya',
      activities: [
        {
          id: '1',
          time: '10:00 AM',
          title: 'Arrive at Narita Airport',
          type: 'transport',
          icon: 'airplane',
        },
        {
          id: '2',
          time: '2:00 PM',
          title: 'Check in at Hotel Gracery',
          type: 'accommodation',
          icon: 'bed',
        },
        {
          id: '3',
          time: '5:00 PM',
          title: 'Shibuya Crossing',
          type: 'sightseeing',
          icon: 'camera',
        },
        {
          id: '4',
          time: '7:00 PM',
          title: 'Dinner at Ichiran Ramen',
          type: 'food',
          icon: 'restaurant',
        },
      ],
    },
    {
      day: 2,
      date: '2024-04-16',
      title: 'Traditional Tokyo',
      activities: [
        {
          id: '5',
          time: '9:00 AM',
          title: 'Senso-ji Temple',
          type: 'sightseeing',
          icon: 'business',
        },
        {
          id: '6',
          time: '12:00 PM',
          title: 'Lunch at Nakamise Street',
          type: 'food',
          icon: 'restaurant',
        },
        {
          id: '7',
          time: '3:00 PM',
          title: 'Ueno Park & Museums',
          type: 'sightseeing',
          icon: 'leaf',
        },
        {
          id: '8',
          time: '7:30 PM',
          title: 'Izakaya Experience',
          type: 'food',
          icon: 'beer',
        },
      ],
    },
    {
      day: 3,
      date: '2024-04-17',
      title: 'Modern Tokyo',
      activities: [
        {
          id: '9',
          time: '10:00 AM',
          title: 'teamLab Borderless',
          type: 'activity',
          icon: 'color-palette',
        },
        {
          id: '10',
          time: '2:00 PM',
          title: 'Harajuku & Takeshita Street',
          type: 'shopping',
          icon: 'bag',
        },
        {
          id: '11',
          time: '6:00 PM',
          title: 'Tokyo Tower at Sunset',
          type: 'sightseeing',
          icon: 'camera',
        },
      ],
    },
  ],
});

const getActivityColor = (type: string) => {
  switch (type) {
    case 'transport':
      return '#3b82f6';
    case 'accommodation':
      return '#8b5cf6';
    case 'sightseeing':
      return '#22c55e';
    case 'food':
      return '#f59e0b';
    case 'activity':
      return '#ec4899';
    case 'shopping':
      return '#06b6d4';
    default:
      return '#6b7280';
  }
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [activeDay, setActiveDay] = React.useState(1);

  const trip = getTripData(id || '1');
  const progress = (trip.budget.spent / trip.budget.total) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Image */}
      <View style={styles.headerImage}>
        <Image source={{ uri: trip.coverImage }} style={styles.coverImage} />
        <View style={styles.headerOverlay} />
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerNav}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn}>
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{trip.title}</Text>
            <View style={styles.headerMeta}>
              <Ionicons name="location" size={16} color="#fff" />
              <Text style={styles.headerDestination}>{trip.destination}</Text>
            </View>
            <Text style={styles.headerDates}>
              {trip.startDate} - {trip.endDate}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Travelers */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Travelers
            </Text>
            <TouchableOpacity>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.travelers}>
            {trip.travelers.map((traveler, index) => (
              <View key={traveler.id} style={[styles.travelerItem, { marginLeft: index > 0 ? -12 : 0 }]}>
                <Image source={{ uri: traveler.avatar }} style={styles.travelerAvatar} />
              </View>
            ))}
            <View style={[styles.travelerAdd, { backgroundColor: colors.cardAlt }]}>
              <Ionicons name="add" size={20} color={colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Budget */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Budget
            </Text>
            <TouchableOpacity>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.budgetInfo}>
            <Text style={[styles.budgetSpent, { color: colors.text }]}>
              ${trip.budget.spent.toLocaleString()}
            </Text>
            <Text style={[styles.budgetTotal, { color: colors.textMuted }]}>
              of ${trip.budget.total.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.cardAlt }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: progress > 80 ? '#ef4444' : colors.primary,
                },
              ]}
            />
          </View>
          <View style={styles.budgetCategories}>
            {[
              { label: 'Flights', amount: 800, icon: 'airplane' },
              { label: 'Hotels', amount: 600, icon: 'bed' },
              { label: 'Food', amount: 400, icon: 'restaurant' },
              { label: 'Activities', amount: 350, icon: 'ticket' },
            ].map((cat, index) => (
              <View key={index} style={[styles.budgetCategory, { backgroundColor: colors.cardAlt }]}>
                <Ionicons name={cat.icon as any} size={18} color={colors.primary} />
                <Text style={[styles.budgetCatLabel, { color: colors.textMuted }]}>
                  {cat.label}
                </Text>
                <Text style={[styles.budgetCatAmount, { color: colors.text }]}>
                  ${cat.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Itinerary */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Itinerary
            </Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Day Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.daySelector}
          >
            {trip.itinerary.map((day) => (
              <TouchableOpacity
                key={day.day}
                style={[
                  styles.dayTab,
                  {
                    backgroundColor:
                      activeDay === day.day ? colors.primary : colors.cardAlt,
                  },
                ]}
                onPress={() => setActiveDay(day.day)}
              >
                <Text
                  style={[
                    styles.dayTabDay,
                    { color: activeDay === day.day ? '#fff' : colors.text },
                  ]}
                >
                  Day {day.day}
                </Text>
                <Text
                  style={[
                    styles.dayTabTitle,
                    {
                      color:
                        activeDay === day.day
                          ? 'rgba(255,255,255,0.8)'
                          : colors.textMuted,
                    },
                  ]}
                >
                  {day.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Activities */}
          <View style={styles.activities}>
            {trip.itinerary
              .find((d) => d.day === activeDay)
              ?.activities.map((activity, index) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityTimeline}>
                    <View
                      style={[
                        styles.activityDot,
                        { backgroundColor: getActivityColor(activity.type) },
                      ]}
                    />
                    {index <
                      (trip.itinerary.find((d) => d.day === activeDay)?.activities
                        .length || 0) -
                        1 && (
                      <View
                        style={[styles.activityLine, { backgroundColor: colors.border }]}
                      />
                    )}
                  </View>
                  <View style={[styles.activityContent, { backgroundColor: colors.cardAlt }]}>
                    <View style={styles.activityHeader}>
                      <View
                        style={[
                          styles.activityIcon,
                          { backgroundColor: getActivityColor(activity.type) + '20' },
                        ]}
                      >
                        <Ionicons
                          name={activity.icon as any}
                          size={18}
                          color={getActivityColor(activity.type)}
                        />
                      </View>
                      <Text style={[styles.activityTime, { color: colors.textMuted }]}>
                        {activity.time}
                      </Text>
                    </View>
                    <Text style={[styles.activityTitle, { color: colors.text }]}>
                      {activity.title}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { icon: 'map', label: 'Map View', color: '#3b82f6' },
            { icon: 'document-text', label: 'Documents', color: '#8b5cf6' },
            { icon: 'chatbubbles', label: 'Group Chat', color: '#22c55e' },
            { icon: 'images', label: 'Photos', color: '#f59e0b' },
          ].map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickAction, { backgroundColor: colors.card }]}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + '15' },
                ]}
              >
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.aiButton}>
          <Ionicons name="sparkles" size={20} color="#fff" />
          <Text style={styles.aiButtonText}>Ask AI Assistant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    height: 280,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerInfo: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  headerDestination: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  headerDates: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  travelers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  travelerItem: {
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 24,
  },
  travelerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  travelerAdd: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 12,
  },
  budgetSpent: {
    fontSize: 28,
    fontWeight: '700',
  },
  budgetTotal: {
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  budgetCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  budgetCatLabel: {
    fontSize: 12,
  },
  budgetCatAmount: {
    fontSize: 12,
    fontWeight: '600',
  },
  daySelector: {
    marginBottom: 20,
    marginHorizontal: -4,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    minWidth: 100,
  },
  dayTabDay: {
    fontSize: 14,
    fontWeight: '700',
  },
  dayTabTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  activities: {
    gap: 0,
  },
  activityItem: {
    flexDirection: 'row',
  },
  activityTimeline: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  activityLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  activityContent: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  aiButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
