import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';

const screenWidth = Dimensions.get('window').width;

export default function ShowAllStats({ onBack, onNavigateToHistory }: { onBack: () => void; onNavigateToHistory?: () => void }) {
  const [visibleLines, setVisibleLines] = useState({
    daily: true,
    meditation: true,
    workout: true
  });
  const [fadeAnims] = useState({
    daily: new Animated.Value(1),
    meditation: new Animated.Value(1),
    workout: new Animated.Value(1)
  });
  const [moodData, setMoodData] = useState<any[]>([]);
  const [meditationData, setMeditationData] = useState<any[]>([]);
  const [workoutData, setWorkoutData] = useState<any[]>([]);

  useEffect(() => {
    const loadAllMoodData = async () => {
      try {
        const [dailyData, meditationMoodData, workoutMoodData] = await Promise.all([
          AsyncStorage.getItem('moodHistory'),
          AsyncStorage.getItem('meditationMoodData'),
          AsyncStorage.getItem('workoutMoodData')
        ]);
        
        setMoodData(dailyData ? JSON.parse(dailyData) : []);
        setMeditationData(meditationMoodData ? JSON.parse(meditationMoodData) : []);
        setWorkoutData(workoutMoodData ? JSON.parse(workoutMoodData) : []);
      } catch (error) {
        console.log('Error loading mood data:', error);
      }
    };
    loadAllMoodData();
  }, []);

  const toggleLine = (lineType: 'daily' | 'meditation' | 'workout') => {
    const isVisible = visibleLines[lineType];
    
    Animated.timing(fadeAnims[lineType], {
      toValue: isVisible ? 0.3 : 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
    
    setTimeout(() => {
      setVisibleLines(prev => ({
        ...prev,
        [lineType]: !isVisible
      }));
    }, 300);
  };

  const getVisibleDatasets = () => {
    const datasets = [];
    const today = new Date();
    
    // Get current week (Monday to Sunday)
    const getWeekData = (dataSource: any[]) => {
      const weekData = [];
      const currentDate = new Date();
      
      // Get Monday of current week
      const monday = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so 6 days from Monday
      monday.setDate(currentDate.getDate() - daysFromMonday);
      
      // Get data for each day of the week (Mon-Sun)
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
       const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        const dayMood = dataSource.find(entry => entry.date === dateStr);
        weekData.push(dayMood ? dayMood.mood : 4); // Default to neutral (4)
      }
      
      return weekData;
    };
    
    if (visibleLines.daily) {
      datasets.push({
        data: getWeekData(moodData),
        color: () => COLORS.primary,
        strokeWidth: 3,
      });
    }
    
    if (visibleLines.meditation) {
      datasets.push({
        data: getWeekData(meditationData),
        color: () => '#F59E0B',
        strokeWidth: 3,
      });
    }
    
    if (visibleLines.workout) {
      datasets.push({
        data: getWeekData(workoutData),
        color: () => '#059669',
        strokeWidth: 3,
      });
    }
    
    // Always add invisible data points to force full Y-axis range
    if (datasets.length > 0) {
      datasets.push({
        data: [1, 6, 1, 6, 1, 6, 1], // Invisible points at min/max to force full range
        color: () => 'transparent',
        strokeWidth: 0,
        withDots: false,
      });
    }
    
    return datasets.length > 0 ? datasets : [{ data: [1, 6, 1, 6, 1, 6, 1], color: () => 'transparent', strokeWidth: 0 }];
  };
  const monthlyData = [
    { month: "Jan", calories: 2400, workouts: 12 },
    { month: "Feb", calories: 2800, workouts: 15 },
    { month: "Mar", calories: 3200, workouts: 18 },
    { month: "Apr", calories: 2900, workouts: 16 },
    { month: "May", calories: 3500, workouts: 20 },
    { month: "Jun", calories: 3100, workouts: 17 },
  ];

  const maxCalories = Math.max(...monthlyData.map(m => m.calories));

  const showMoodHistory = () => {
    if (onNavigateToHistory) {
      onNavigateToHistory();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EBF8FF" />
      
      <LinearGradient colors={['#EBF8FF', '#C3DAFE']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>All Statistics</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.emotionCard}>
          <Text style={styles.emotionTitle}>Daily Emotional Check-in</Text>
          
          <TouchableOpacity onPress={showMoodHistory}>
            <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: getVisibleDatasets(),
            }}
            width={screenWidth - 70}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            fromZero={false}
            segments={5}
            withInnerLines={true}
            withOuterLines={true}
            formatYLabel={(value) => {
              const val = Math.round(parseFloat(value));
              const emotions = { 1: 'Angry', 2: 'Sad', 3: 'Stressed', 4: 'Neutral', 5: 'Content', 6: 'Happy' };
              return emotions[val] || '';
            }}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#fff',
              },

            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.emotionLegend}>
            <TouchableOpacity style={styles.legendItem} onPress={() => toggleLine('daily')}>
              <Animated.View style={[styles.legendDot, { backgroundColor: COLORS.primary, opacity: fadeAnims.daily }]} />
              <Animated.Text style={[styles.legendText, { opacity: fadeAnims.daily }]}>Daily Check-in</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.legendItem} onPress={() => toggleLine('meditation')}>
              <Animated.View style={[styles.legendDot, { backgroundColor: '#F59E0B', opacity: fadeAnims.meditation }]} />
              <Animated.Text style={[styles.legendText, { opacity: fadeAnims.meditation }]}>After Meditation</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.legendItem} onPress={() => toggleLine('workout')}>
              <Animated.View style={[styles.legendDot, { backgroundColor: '#059669', opacity: fadeAnims.workout }]} />
              <Animated.Text style={[styles.legendText, { opacity: fadeAnims.workout }]}>After Workout</Animated.Text>
            </TouchableOpacity>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Progress</Text>
          <View style={styles.monthlyChart}>
            {monthlyData.map((data) => (
              <View key={data.month} style={styles.monthColumn}>
                <View
                  style={[
                    styles.monthBar,
                    { height: (data.calories / maxCalories) * 120 }
                  ]}
                />
                <Text style={styles.monthLabel}>{data.month}</Text>
                <Text style={styles.calorieValue}>{data.calories}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15,200</Text>
            <Text style={styles.statLabel}>Total Calories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>98</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24.5</Text>
            <Text style={styles.statLabel}>Avg Session (min)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5.2</Text>
            <Text style={styles.statLabel}>Weekly Average</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    padding: 20,
    marginTop: -20,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  graphContainer: {
    flexDirection: 'row',
    height: 120,
    marginBottom: 10,
  },
  yAxisContainer: {
    width: 60,
    height: 100,
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    height: 100,
    position: 'relative',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  horizontalGrid: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  dataContainer: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  dayColumn: {
    width: 20,
    height: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  dataPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#fff',
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 60,
    paddingHorizontal: 10,
    marginTop: -5,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  monthlyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  monthColumn: {
    alignItems: 'center',
    flex: 1,
  },
  monthBar: {
    width: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  emotionLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 50,
  },


});