import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';

const menuItems = [
  { id: '1', icon: 'person-outline', label: 'Personal Information', route: '/profile/personal' },
  { id: '2', icon: 'notifications-outline', label: 'Notifications', route: '/profile/notifications' },
  { id: '3', icon: 'shield-outline', label: 'Privacy & Security', route: '/profile/privacy' },
  { id: '4', icon: 'card-outline', label: 'Payment Methods', route: '/profile/payments' },
  { id: '5', icon: 'globe-outline', label: 'Language & Region', route: '/profile/language' },
  { id: '6', icon: 'moon-outline', label: 'Appearance', route: '/profile/appearance' },
  { id: '7', icon: 'help-circle-outline', label: 'Help & Support', route: '/profile/help' },
  { id: '8', icon: 'document-text-outline', label: 'Terms & Privacy', route: '/profile/terms' },
];

const stats = [
  { label: 'Trips', value: 12, icon: 'airplane' },
  { label: 'Countries', value: 18, icon: 'globe' },
  { label: 'Photos', value: 456, icon: 'camera' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity
            style={[styles.settingsBtn, { backgroundColor: colors.card }]}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.profileText}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.name || 'Traveler'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
                {user?.email || 'traveler@example.com'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: colors.primaryLight }]}
          >
            <Text style={[styles.editBtnText, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={[styles.statCard, { backgroundColor: colors.card }]}
            >
              <Ionicons name={stat.icon as any} size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Badges */}
        <View style={[styles.badgesCard, { backgroundColor: colors.card }]}>
          <View style={styles.badgesHeader}>
            <Text style={[styles.badgesTitle, { color: colors.text }]}>
              Badges
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.badgesList}>
            {['🚀', '🌍', '🍜', '📸'].map((emoji, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeEmoji}>{emoji}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.version, { color: colors.textMuted }]}>
          Version 1.0.0
        </Text>

        <View style={{ height: 40 }} />
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileText: {},
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  badgesCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgesList: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  menuCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  version: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 13,
  },
});
