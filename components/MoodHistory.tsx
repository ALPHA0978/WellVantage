import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

interface MoodEntry {
  mood: number;
  date: string;
  time: string;
  timestamp: string;
  type?: 'daily' | 'meditation' | 'workout';
}

const CircularProgress = ({ score }: { score: number }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let strokeColor = '#F87171'; // Light red
  if (score >= 80) strokeColor = '#34D399'; // Light green  
  else if (score >= 50) strokeColor = '#FBBF24'; // Light orange
  
  return (
    <View style={styles.progressContainer}>
      <Svg width={64} height={64} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={32}
          cy={32}
          r={radius}
          stroke="#F3F4F6"
          strokeWidth={5}
          fill="transparent"
        />
        <Circle
          cx={32}
          cy={32}
          r={radius}
          stroke={strokeColor}
          strokeWidth={5}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[styles.scoreText, { position: 'absolute' }]}>{score}</Text>
    </View>
  );
};

export default function MoodHistory({ onBack }: { onBack: () => void }) {
  const [allMoodData, setAllMoodData] = useState<MoodEntry[]>([]);

  useEffect(() => {
    loadAllMoodData();
  }, []);

  const loadAllMoodData = async () => {
    try {
      const [dailyData, meditationData, workoutData] = await Promise.all([
        AsyncStorage.getItem('moodHistory'),
        AsyncStorage.getItem('meditationMoodData'),
        AsyncStorage.getItem('workoutMoodData')
      ]);
      
      const combinedData: MoodEntry[] = [];
      
      if (dailyData) {
        const daily = JSON.parse(dailyData).map((entry: MoodEntry) => ({ ...entry, type: 'daily' as const }));
        combinedData.push(...daily);
      }
      
      if (meditationData) {
        const meditation = JSON.parse(meditationData).map((entry: MoodEntry) => ({ ...entry, type: 'meditation' as const }));
        combinedData.push(...meditation);
      }
      
      if (workoutData) {
        const workout = JSON.parse(workoutData).map((entry: MoodEntry) => ({ ...entry, type: 'workout' as const }));
        combinedData.push(...workout);
      }
      
      // Sort by date and time, most recent first
      combinedData.sort((a, b) => new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime());
      
      // Debug: Log the actual dates
      console.log('Mood data dates:', combinedData.map(entry => ({ 
        date: entry.date, 
        timestamp: entry.timestamp,
        mood: entry.mood,
        type: entry.type 
      })));
      console.log('Total entries:', combinedData.length);
      
      setAllMoodData(combinedData);
    } catch (error) {
      console.log('Error loading mood data:', error);
    }
  };

  const getMoodInfo = (moodLevel: number) => {
    const moods = [
      { title: 'Unknown', description: 'No data available', score: 0 },
      { title: 'Angry', description: 'Try 15m deep breathing session.', score: 25 },
      { title: 'Sad', description: 'Consider a 20m meditation.', score: 35 },
      { title: 'Stressed', description: 'Please do 25m Mindfulness.', score: 45 },
      { title: 'Neutral', description: 'Keep maintaining balance.', score: 65 },
      { title: 'Content', description: 'You\'ve been consistent recently.', score: 80 },
      { title: 'Very Happy', description: 'Great job! Keep up the good work.', score: 95 }
    ];
    return moods[moodLevel] || moods[0];
  };

  const getTypeInfo = (type: 'daily' | 'meditation' | 'workout') => {
    const types = {
      daily: { label: 'Daily Check-in', color: '#66C4FF' },
      meditation: { label: 'After Meditation', color: '#F59E0B' },
      workout: { label: 'After Workout', color: '#059669' }
    };
    return types[type];
  };

  const formatDateParts = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    return { month, day, year: year !== currentYear ? year : null };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EBF8FF" />
      
      <LinearGradient colors={['#EBF8FF', '#C3DAFE']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Mood Entries</Text>
          <TouchableOpacity onPress={async () => {
            await AsyncStorage.multiRemove(['moodHistory', 'meditationMoodData', 'workoutMoodData']);
            setAllMoodData([]);
          }} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={styles.scrollContent}>
        {allMoodData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No mood entries yet</Text>
            <Text style={styles.emptySubtext}>Start tracking your mood to see history here</Text>
          </View>
        ) : (
          allMoodData.map((entry, index) => {
            const moodInfo = getMoodInfo(entry.mood);
            const { month, day, year } = formatDateParts(entry.date);
            const typeInfo = getTypeInfo(entry.type || 'daily');
            return (
              <View key={index} style={styles.historyItem}>
                <View style={styles.dateSection}>
                  <Text style={styles.monthText}>{month}</Text>
                  <Text style={styles.dayText}>{day}</Text>
                  {year && <Text style={styles.yearText}>{year}</Text>}
                </View>
                
                <View style={styles.contentSection}>
                  <View style={styles.typeHeader}>
                    <View style={[styles.typeDot, { backgroundColor: typeInfo.color }]} />
                    <Text style={styles.typeText}>{typeInfo.label}</Text>
                  </View>
                  <Text style={styles.titleText}>{moodInfo.title}</Text>
                  <Text style={styles.descriptionText}>{moodInfo.description}</Text>
                </View>
                
                <CircularProgress score={moodInfo.score} />
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: -20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dateSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 60,
    backgroundColor: '#69afff85',
    borderRadius: 12,
    marginRight: 16,
  },
  monthText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0004ffff',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#374151',
    lineHeight: 24,
  },
  contentSection: {
    flex: 1,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  progressContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#374151',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  yearText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
});