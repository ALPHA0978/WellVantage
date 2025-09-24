import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IssuesMap() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Issues Map</Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
          View reported issues on map
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
        <MaterialIcons name="map" size={64} color="#D1D5DB" />
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
          Map View Coming Soon
        </Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
          Interactive map showing all reported issues in your area will be available soon
        </Text>
      </View>
    </SafeAreaView>
  );
}