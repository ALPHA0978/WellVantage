import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Stats {
  totalReports: number;
  resolvedIssues: number;
  pendingIssues: number;
  categoryBreakdown: { [key: string]: number };
}

const CATEGORY_LABELS = {
  pothole: 'Potholes',
  electricity: 'Electricity',
  water: 'Water Supply',
  garbage: 'Garbage',
  streetlight: 'Street Lights',
  drainage: 'Drainage',
  traffic: 'Traffic',
  other: 'Other',
};

const CATEGORY_COLORS = {
  pothole: '#EF4444',
  electricity: '#F59E0B',
  water: '#3B82F6',
  garbage: '#10B981',
  streetlight: '#8B5CF6',
  drainage: '#06B6D4',
  traffic: '#F97316',
  other: '#6B7280',
};

export default function Progress() {
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    categoryBreakdown: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'issues')), (snapshot) => {
      const issues = snapshot.docs.map(doc => doc.data());
      
      const totalReports = issues.length;
      const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;
      const pendingIssues = issues.filter(issue => issue.status !== 'resolved' && issue.status !== 'rejected').length;
      
      const categoryBreakdown: { [key: string]: number } = {};
      issues.forEach(issue => {
        categoryBreakdown[issue.category] = (categoryBreakdown[issue.category] || 0) + 1;
      });
      
      setStats({ totalReports, resolvedIssues, pendingIssues, categoryBreakdown });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resolutionRate = stats.totalReports > 0 ? (stats.resolvedIssues / stats.totalReports * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcons name="analytics" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8 }}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>Statistics</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>Community civic reporting overview</Text>
        </View>

        {/* Main Stats Cards */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={{ flex: 1, padding: 16, borderRadius: 12 }}
          >
            <MaterialIcons name="report" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>{stats.totalReports}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Total Reports</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={{ flex: 1, padding: 16, borderRadius: 12 }}
          >
            <MaterialIcons name="check-circle" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>{stats.resolvedIssues}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Resolved</Text>
          </LinearGradient>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={{ flex: 1, padding: 16, borderRadius: 12 }}
          >
            <MaterialIcons name="hourglass-empty" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>{stats.pendingIssues}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Pending</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={{ flex: 1, padding: 16, borderRadius: 12 }}
          >
            <MaterialIcons name="trending-up" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>{resolutionRate}%</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Resolution Rate</Text>
          </LinearGradient>
        </View>

        {/* Category Breakdown */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>Issues by Category</Text>
          
          {Object.entries(stats.categoryBreakdown).length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <MaterialIcons name="pie-chart" size={48} color="#D1D5DB" />
              <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8 }}>No data available</Text>
            </View>
          ) : (
            Object.entries(stats.categoryBreakdown)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => {
                const percentage = ((count / stats.totalReports) * 100).toFixed(1);
                return (
                  <View key={category} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                        {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#6B7280' }}>{count} ({percentage}%)</Text>
                    </View>
                    <View style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: 3 }}>
                      <View style={{
                        height: 6,
                        backgroundColor: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6B7280',
                        borderRadius: 3,
                        width: `${percentage}%`,
                      }} />
                    </View>
                  </View>
                );
              })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}