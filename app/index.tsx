import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import ReportIssue from "../components/ReportIssue";

const ISSUE_CATEGORIES = [
  { id: 'pothole', label: 'Pothole', icon: 'construction', color: '#EF4444' },
  { id: 'electricity', label: 'Electricity', icon: 'flash-on', color: '#F59E0B' },
  { id: 'water', label: 'Water Supply', icon: 'water-drop', color: '#3B82F6' },
  { id: 'garbage', label: 'Garbage', icon: 'delete', color: '#10B981' },
  { id: 'streetlight', label: 'Street Light', icon: 'lightbulb', color: '#8B5CF6' },
  { id: 'drainage', label: 'Drainage', icon: 'water', color: '#06B6D4' },
];

export default function Index({ onShowAllStats }: { onShowAllStats?: () => void }) {
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowReportIssue(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <LinearGradient colors={['#EBF8FF', '#DBEAFE']} style={{ paddingTop: 60, paddingBottom: 30, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1E40AF', marginBottom: 8 }}>WellVantage</Text>
          <Text style={{ fontSize: 16, color: '#3B82F6' }}>Report civic issues in your area</Text>
        </LinearGradient>

        {/* Quick Report Button */}
        <TouchableOpacity
          style={{ margin: 24, borderRadius: 16 }}
          onPress={() => setShowReportIssue(true)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={{ padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
          >
            <MaterialIcons name="add-circle" size={24} color="#fff" style={{ marginRight: 12 }} />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Report New Issue</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Issue Categories */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>Quick Report</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {ISSUE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={{ width: '48%' }}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.8}
              >
                <View style={{
                  backgroundColor: '#fff',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.05)',
                }}>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: category.color + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <MaterialIcons name={category.icon} size={24} color={category.color} />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', textAlign: 'center' }}>
                    {category.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>Recent Activity</Text>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <MaterialIcons name="inbox" size={48} color="#9CA3AF" />
              <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8 }}>No recent issues</Text>
              <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 4 }}>
                Your reported issues will appear here
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {showReportIssue && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: '#F9FAFB',
        }}>
          <ReportIssue 
            onBack={() => {
              setShowReportIssue(false);
              setSelectedCategory(null);
            }}
            initialCategory={selectedCategory}
          />
        </View>
      )}
    </View>
  );
}
