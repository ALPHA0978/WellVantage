import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Index from '../app/index';
import { ANIMATION_DURATION } from '../utils/constants';
import IssuesList from './IssuesList';
import IssuesMap from './IssuesMap';
import ReportIssue from './ReportIssue';

const PROFILE_DATA = {
  name: "Civic Reporter",
  userId: "CR-2024001",
  stats: [
    { id: 'reported', label: 'Issues Reported', value: '12', icon: 'report', color: '#3B82F6' },
    { id: 'resolved', label: 'Issues Resolved', value: '8', icon: 'check-circle', color: '#10B981' },
    { id: 'pending', label: 'Pending Issues', value: '4', icon: 'hourglass-empty', color: '#F59E0B' },
    { id: 'points', label: 'Civic Points', value: '240', icon: 'star', color: '#8B5CF6' },
    { id: 'rank', label: 'Community Rank', value: '#15', icon: 'trending-up', color: '#EF4444' },
    { id: 'area', label: 'Area Coverage', value: '2.5km', icon: 'location-on', color: '#06B6D4' },
  ],
  menuItems: [
    { id: 'my-reports', label: 'My Reports', description: 'View all issues you have reported and their current status', icon: 'assignment', color: '#3B82F6' },
    { id: 'nearby-issues', label: 'Nearby Issues', description: 'See civic issues reported in your area', icon: 'location-on', color: '#10B981' },
    { id: 'civic-points', label: 'Civic Points & Rewards', description: 'Earn points for reporting and get community recognition', icon: 'star', color: '#F59E0B' },
    { id: 'community', label: 'Community Leaderboard', description: 'See top civic reporters in your area', icon: 'leaderboard', color: '#8B5CF6' },
    { id: 'notifications', label: 'Issue Updates', description: 'Get notified about status changes on your reports', icon: 'notifications', color: '#EF4444' },
    { id: 'feedback', label: 'App Feedback', description: 'Help us improve the civic reporting experience', icon: 'feedback', color: '#06B6D4' },
  ],
  settingsItems: [
    { id: 'personal', label: 'Personal Info', icon: 'person', color: '#3B82F6' },
    { id: 'location', label: 'Location Settings', icon: 'location-on', color: '#10B981' },
    { id: 'notification', label: 'Notifications', icon: 'notifications', color: '#F59E0B' },
    { id: 'help', label: 'Help & Support', icon: 'help', color: '#8B5CF6' },
  ]
};

const NAV_ITEMS = [
  { id: 'Report', label: 'Report', icon: 'add-circle', iconSet: 'MaterialIcons' },
  { id: 'Issues', label: 'Issues', icon: 'list', iconSet: 'MaterialIcons' },
  { id: 'Home', label: 'Home', icon: 'home', iconSet: 'Ionicons' },
  { id: 'Map', label: 'Map', icon: 'map', iconSet: 'MaterialIcons' },
  { id: 'Profile', label: 'Profile', icon: 'person', iconSet: 'Ionicons' },
];

function ProfileContent({ onBackPress }: { onBackPress: () => void }) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const handleNext = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    animationRef.current = Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: ANIMATION_DURATION.fast,
      useNativeDriver: true,
    });
    
    animationRef.current.start(() => {
      setCurrentStatIndex((prevIndex) => (prevIndex + 3) % PROFILE_DATA.stats.length);
      animationRef.current = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.fast,
        useNativeDriver: true,
      });
      animationRef.current.start();
    });
  }, [fadeAnim]);

  return (
    <SafeAreaView style={profileStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EBF8FF" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#EBF8FF', '#C3DAFE']} style={profileStyles.header}>
          <View style={profileStyles.headerTop}>
            <TouchableOpacity 
              onPress={onBackPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={profileStyles.headerTitle}>Profile</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <MaterialIcons name="edit" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <View style={profileStyles.profileSection}>
            <View style={profileStyles.avatar}>
              <Text style={profileStyles.avatarText}>MR</Text>
            </View>
            <Text style={profileStyles.name}>{PROFILE_DATA.name}</Text>
            <Text style={profileStyles.userId}>{PROFILE_DATA.userId}</Text>
          </View>
        </LinearGradient>

        <View style={profileStyles.content}>
          <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
            <LinearGradient colors={['#60A5FA', '#6366F1']} style={profileStyles.statsCard}>
              <Animated.View style={[profileStyles.statsRow, { opacity: fadeAnim }]}>
                {PROFILE_DATA.stats.slice(currentStatIndex, currentStatIndex + 3).map(stat => (
                  <View key={stat.id} style={profileStyles.statItem}>
                    <MaterialIcons name={stat.icon} size={24} color={stat.color} />
                    <Text style={profileStyles.statValue}>{stat.value}</Text>
                    <Text style={profileStyles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={profileStyles.cardRow}>
            <LinearGradient colors={['#FEF3C7', '#FCD34D']} style={profileStyles.voucherCard}>
              <View style={profileStyles.cardHeader}>
                <MaterialIcons name="account-balance-wallet" size={20} color="#92400E" />
                <Text style={[profileStyles.cardHeaderText, {color: '#92400E'}]}>VOUCHER BALANCE</Text>
              </View>
              <Text style={profileStyles.voucherAmount}>₹0</Text>
              <TouchableOpacity style={profileStyles.addButton}>
                <Text style={profileStyles.addButtonText}>+ Add Balance</Text>
              </TouchableOpacity>
            </LinearGradient>
            
            <LinearGradient colors={['#DBEAFE', '#93C5FD']} style={profileStyles.inviteCard}>
              <View style={profileStyles.cardHeader}>
                <MaterialIcons name="person-add" size={20} color="#1E40AF" />
                <Text style={[profileStyles.cardHeaderText, {color: '#1E40AF'}]}>Invite Friends</Text>
              </View>
              <Text style={profileStyles.inviteText}>Get friends to join WELLVANTAGE & get benefits</Text>
              <TouchableOpacity style={profileStyles.inviteButton}>
                <Text style={profileStyles.inviteButtonText}>+ Invite now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={profileStyles.menuCard}>
            {PROFILE_DATA.menuItems.map((item, index) => (
              <TouchableOpacity key={item.id} style={[profileStyles.menuItem, index < PROFILE_DATA.menuItems.length - 1 && profileStyles.menuItemBorder]}>
                <View style={profileStyles.menuIcon}>
                  <MaterialIcons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={profileStyles.menuContent}>
                  <Text style={profileStyles.menuLabel}>{item.label}</Text>
                  <Text style={profileStyles.menuDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={profileStyles.menuCard}>
            <Text style={profileStyles.sectionTitle}>SETTINGS</Text>
            {PROFILE_DATA.settingsItems.map((item, index) => (
              <TouchableOpacity key={item.id} style={[profileStyles.menuItem, index < PROFILE_DATA.settingsItems.length - 1 && profileStyles.menuItemBorder]}>
                <View style={profileStyles.menuIcon}>
                  <MaterialIcons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={profileStyles.menuContent}>
                  <Text style={profileStyles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showReportIssue, setShowReportIssue] = useState(false);

  const handleTabChange = useCallback((tabId: string) => {
    if (activeTab === tabId) return;
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsLoading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 40);
    
    setTimeout(() => {
      setActiveTab(tabId);
    }, 80);
  }, [activeTab]);

  const renderIcon = useCallback((item: any, isActive: boolean) => {
    const color = isActive ? '#007AFF' : '#999';
    const size = 24;
    
    if (item.iconSet === 'MaterialIcons') {
      return <MaterialIcons name={item.icon} size={size} color={color} />;
    }
    return <Ionicons name={item.icon} size={size} color={color} />;
  }, []);

  const handleBackPress = useCallback(() => {
    if (showReportIssue) {
      setShowReportIssue(false);
    } else {
      setActiveTab('Home');
    }
  }, [showReportIssue]);

  const renderContent = useMemo(() => {
    if (showReportIssue) {
      return <ReportIssue onBack={() => {
        setShowReportIssue(false);
        setActiveTab('Home');
      }} />;
    }
    
    switch (activeTab) {
      case 'Home':
        return <Index />;
      case 'Report':
        setShowReportIssue(true);
        return <Index />;
      case 'Issues':
        return <IssuesList onBack={() => setActiveTab('Home')} />;
      case 'Map':
        return <IssuesMap />;
      case 'Profile':
        return <ProfileContent onBackPress={handleBackPress} />;
      default:
        return <View style={styles.content} />;
    }
  }, [activeTab, handleBackPress, showReportIssue]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#EBF8FF" />
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (activeTab === 'Profile' || showReportIssue) {
    return renderContent;
  }

  return (
    <View style={styles.fullScreen}>
      {activeTab !== 'Home' && <StatusBar barStyle="dark-content" backgroundColor="#EBF8FF" />}
      <View style={styles.content}>
        {renderContent}
      </View>
      <View style={styles.container}>
        <View style={styles.navbar}>
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                activeTab === item.id && styles.activeNavItem
              ]}
              onPress={() => handleTabChange(item.id)}
              activeOpacity={0.7}

            >
              {renderIcon(item, activeTab === item.id)}
              <Text style={[
                styles.navLabel,
                activeTab === item.id && styles.activeNavLabel
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  navbar: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
  },
  activeNavItem: {
    backgroundColor: '#E3F2FD',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
  },
});

const profileStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  header: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  profileSection: { alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#4B5563' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  userId: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  content: { padding: 12, marginTop: -20 },
  statsCard: { borderRadius: 14, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', flex: 1, paddingHorizontal: 4 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#fff', marginTop: 4 },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4, fontWeight: '300', letterSpacing: 0.5 },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  voucherCard: { flex: 1, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  inviteCard: { flex: 1, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardHeaderText: { fontSize: 10, fontWeight: '600', marginLeft: 6 },
  voucherAmount: { fontSize: 28, fontWeight: '900', color: '#92400E', marginVertical: 12 },
  addButton: { backgroundColor: '#f59e0b', borderRadius: 10, paddingVertical: 6, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  inviteText: { fontSize: 12, color: '#1E40AF', marginTop: 4, marginBottom: 12, lineHeight: 16 },
  inviteButton: { backgroundColor: '#3b82f6', borderRadius: 10, paddingVertical: 6, alignItems: 'center' },
  inviteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  menuCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  menuDescription: { fontSize: 11, color: '#6b7280', marginTop: 2, lineHeight: 14 },
});