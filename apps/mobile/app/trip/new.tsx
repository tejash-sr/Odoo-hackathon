import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';

const { width } = Dimensions.get('window');

export default function NewTripScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = React.useState(1);
  const [tripData, setTripData] = React.useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    tripType: 'adventure',
  });

  const tripTypes = [
    { id: 'adventure', icon: 'compass', label: 'Adventure' },
    { id: 'relaxation', icon: 'leaf', label: 'Relaxation' },
    { id: 'cultural', icon: 'business', label: 'Cultural' },
    { id: 'romantic', icon: 'heart', label: 'Romantic' },
    { id: 'family', icon: 'people', label: 'Family' },
    { id: 'business', icon: 'briefcase', label: 'Business' },
  ];

  const popularDestinations = [
    {
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
    },
    {
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
    },
    {
      name: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80',
    },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create trip and navigate
      router.push('/(tabs)/trips');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Where do you want to go?
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textMuted }]}>
        Enter a city or choose from popular destinations
      </Text>

      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search destinations..."
          placeholderTextColor={colors.textMuted}
          value={tripData.destination}
          onChangeText={(text) => setTripData({ ...tripData, destination: text })}
        />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.text }]}>
        Popular Destinations
      </Text>

      <View style={styles.destinationGrid}>
        {popularDestinations.map((dest, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.destinationCard,
              tripData.destination === dest.name && {
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => setTripData({ ...tripData, destination: dest.name })}
          >
            <Image source={{ uri: dest.image }} style={styles.destinationImage} />
            <View style={styles.destinationOverlay} />
            <Text style={styles.destinationName}>{dest.name}</Text>
            {tripData.destination === dest.name && (
              <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        When are you traveling?
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textMuted }]}>
        Select your travel dates and number of travelers
      </Text>

      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Start Date</Text>
          <TouchableOpacity
            style={[styles.dateInput, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {tripData.startDate || 'Select date'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateField}>
          <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>End Date</Text>
          <TouchableOpacity
            style={[styles.dateInput, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {tripData.endDate || 'Select date'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.travelersSection}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
          Number of Travelers
        </Text>
        <View style={[styles.travelersControl, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.travelerBtn, { backgroundColor: colors.cardAlt }]}
            onPress={() =>
              setTripData({
                ...tripData,
                travelers: Math.max(1, tripData.travelers - 1),
              })
            }
          >
            <Ionicons name="remove" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.travelerCount, { color: colors.text }]}>
            {tripData.travelers}
          </Text>
          <TouchableOpacity
            style={[styles.travelerBtn, { backgroundColor: colors.cardAlt }]}
            onPress={() =>
              setTripData({
                ...tripData,
                travelers: Math.min(20, tripData.travelers + 1),
              })
            }
          >
            <Ionicons name="add" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.budgetSection}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Budget (Optional)</Text>
        <View style={[styles.budgetInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
          <TextInput
            style={[styles.budgetTextInput, { color: colors.text }]}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={tripData.budget}
            onChangeText={(text) => setTripData({ ...tripData, budget: text })}
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        What kind of trip?
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textMuted }]}>
        This helps us create the perfect itinerary for you
      </Text>

      <View style={styles.tripTypeGrid}>
        {tripTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.tripTypeCard,
              { backgroundColor: colors.card },
              tripData.tripType === type.id && {
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => setTripData({ ...tripData, tripType: type.id })}
          >
            <View
              style={[
                styles.tripTypeIcon,
                {
                  backgroundColor:
                    tripData.tripType === type.id
                      ? colors.primary
                      : colors.cardAlt,
                },
              ]}
            >
              <Ionicons
                name={type.icon as any}
                size={24}
                color={tripData.tripType === type.id ? '#fff' : colors.text}
              />
            </View>
            <Text style={[styles.tripTypeLabel, { color: colors.text }]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trip Summary */}
      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>
          Trip Summary
        </Text>
        <View style={styles.summaryRow}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <Text style={[styles.summaryText, { color: colors.textMuted }]}>
            {tripData.destination || 'Not selected'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Ionicons name="calendar" size={18} color={colors.primary} />
          <Text style={[styles.summaryText, { color: colors.textMuted }]}>
            {tripData.startDate && tripData.endDate
              ? `${tripData.startDate} - ${tripData.endDate}`
              : 'Dates not selected'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Ionicons name="people" size={18} color={colors.primary} />
          <Text style={[styles.summaryText, { color: colors.textMuted }]}>
            {tripData.travelers} traveler{tripData.travelers > 1 ? 's' : ''}
          </Text>
        </View>
        {tripData.budget && (
          <View style={styles.summaryRow}>
            <Ionicons name="wallet" size={18} color={colors.primary} />
            <Text style={[styles.summaryText, { color: colors.textMuted }]}>
              ${tripData.budget} budget
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.card }]}
          onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          New Trip
        </Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.progressStep,
              {
                backgroundColor: i <= step ? colors.primary : colors.cardAlt,
              },
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            { opacity: step === 1 && !tripData.destination ? 0.5 : 1 },
          ]}
          onPress={handleNext}
          disabled={step === 1 && !tripData.destination}
        >
          <Text style={styles.nextBtnText}>
            {step === 3 ? 'Create Trip' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  stepContent: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  stepSubtitle: {
    fontSize: 15,
    marginTop: -12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  destinationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  destinationCard: {
    width: (width - 44) / 2,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  destinationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  destinationName: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  dateText: {
    fontSize: 15,
  },
  travelersSection: {
    gap: 8,
  },
  travelersControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 16,
  },
  travelerBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  travelerCount: {
    fontSize: 24,
    fontWeight: '700',
  },
  budgetSection: {
    gap: 8,
  },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  budgetTextInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  tripTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tripTypeCard: {
    width: (width - 44) / 3,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  tripTypeIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    gap: 14,
    marginTop: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    fontSize: 14,
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
  nextBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
