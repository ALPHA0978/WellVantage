import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CivicIssue } from '../types';

const STATUS_COLORS = {
  reported: '#F59E0B',
  'in-progress': '#3B82F6',
  resolved: '#10B981',
  rejected: '#EF4444',
};

const PRIORITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

const CATEGORY_ICONS = {
  pothole: 'construction',
  electricity: 'flash-on',
  water: 'water-drop',
  garbage: 'delete',
  streetlight: 'lightbulb',
  drainage: 'water',
  traffic: 'traffic',
  other: 'more-horiz',
};

interface IssuesListProps {
  onBack?: () => void;
}

export default function IssuesList({ onBack }: IssuesListProps = {}) {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('reportedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: doc.data().reportedAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CivicIssue[];
      
      setIssues(issuesData);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderIssueItem = ({ item }: { item: CivicIssue }) => (
    <View style={{
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <MaterialIcons name={CATEGORY_ICONS[item.category]} size={18} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', flex: 1 }}>
              {item.title}
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
            {item.description}
          </Text>
        </View>
        <View style={{
          backgroundColor: STATUS_COLORS[item.status] + '20',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          marginLeft: 8,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: STATUS_COLORS[item.status],
            textTransform: 'capitalize',
          }}>
            {item.status.replace('-', ' ')}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <MaterialIcons name="location-on" size={16} color="#6B7280" />
        <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4, flex: 1 }}>
          {item.location.address}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            backgroundColor: PRIORITY_COLORS[item.priority] + '20',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
            marginRight: 8,
          }}>
            <Text style={{
              fontSize: 10,
              fontWeight: '600',
              color: PRIORITY_COLORS[item.priority],
              textTransform: 'uppercase',
            }}>
              {item.priority}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
            by {item.reportedBy}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
          {formatDate(item.reportedAt)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcons name="hourglass-empty" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8 }}>Loading issues...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <TouchableOpacity onPress={onBack || (() => {})} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>All Issues</Text>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
            {issues.length} {issues.length === 1 ? 'issue' : 'issues'} reported
          </Text>
        </View>
      </View>

      {issues.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <MaterialIcons name="inbox" size={64} color="#D1D5DB" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
            No Issues Reported
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
            When issues are reported in your area, they will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={issues}
          renderItem={renderIssueItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}