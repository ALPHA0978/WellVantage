import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { IssueCategory, IssuePriority } from '../types';

const CATEGORIES = [
  { id: 'pothole', label: 'Pothole', icon: 'construction' },
  { id: 'electricity', label: 'Electricity', icon: 'flash-on' },
  { id: 'water', label: 'Water Supply', icon: 'water-drop' },
  { id: 'garbage', label: 'Garbage', icon: 'delete' },
  { id: 'streetlight', label: 'Street Light', icon: 'lightbulb' },
  { id: 'drainage', label: 'Drainage', icon: 'water' },
  { id: 'traffic', label: 'Traffic', icon: 'traffic' },
  { id: 'other', label: 'Other', icon: 'more-horiz' },
];

const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#10B981' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'high', label: 'High', color: '#EF4444' },
  { id: 'critical', label: 'Critical', color: '#DC2626' },
];

interface ReportIssueProps {
  onBack: () => void;
  initialCategory?: string | null;
}

export default function ReportIssue({ onBack, initialCategory }: ReportIssueProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>(initialCategory as IssueCategory || 'other');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [location, setLocation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to report issues');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: address[0] ? `${address[0].street}, ${address[0].city}` : 'Unknown location',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please add location for the issue');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'issues'), {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        location,
        status: 'reported',
        reportedBy: 'Anonymous User',
        reportedAt: new Date(),
        updatedAt: new Date(),
      });

      Alert.alert('Success', 'Issue reported successfully!', [
        { text: 'OK', onPress: onBack }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to report issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>Report Issue</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Issue Title *
          </Text>
          <TextInput
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
            placeholder="Brief description of the issue"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Description *
          </Text>
          <TextInput
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              height: 100,
              textAlignVertical: 'top',
            }}
            placeholder="Provide detailed information about the issue"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Category */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Category
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id as IssueCategory)}
                style={{
                  backgroundColor: category === cat.id ? '#3B82F6' : '#fff',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: category === cat.id ? '#3B82F6' : '#E5E7EB',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name={cat.icon} size={16} color={category === cat.id ? '#fff' : '#6B7280'} style={{ marginRight: 4 }} />
                <Text style={{
                  color: category === cat.id ? '#fff' : '#374151',
                  fontWeight: '500',
                }}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Priority
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {PRIORITIES.map((pri) => (
              <TouchableOpacity
                key={pri.id}
                onPress={() => setPriority(pri.id as IssuePriority)}
                style={{
                  backgroundColor: priority === pri.id ? pri.color : '#fff',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: priority === pri.id ? pri.color : '#E5E7EB',
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: priority === pri.id ? '#fff' : '#374151',
                  fontWeight: '500',
                }}>
                  {pri.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Location *
          </Text>
          {location ? (
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <MaterialIcons name="location-on" size={20} color="#10B981" />
              <Text style={{ marginLeft: 8, flex: 1, color: '#374151' }}>{location.address}</Text>
              <TouchableOpacity onPress={getCurrentLocation}>
                <MaterialIcons name="refresh" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={getCurrentLocation}
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="my-location" size={20} color="#3B82F6" />
              <Text style={{ marginLeft: 8, color: '#3B82F6', fontWeight: '500' }}>
                Get Current Location
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#9CA3AF' : '#3B82F6',
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}