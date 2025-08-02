import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/constants';

export default function Statistics({ onShowAll }: { onShowAll: () => void }) {

  const statsData = {
    weeklyData: [
      { day: "Mo", calories: 500 },
      { day: "Tu", calories: 180 },
      { day: "We", calories: 80 },
      { day: "Th", calories: 150 },
      { day: "Fr", calories: 90 },
      { day: "Sa", calories: 600 },
      { day: "Su", calories: 160 },
    ],
    time: "1:03:30",
  };

  const totalCalories = statsData.weeklyData.reduce((sum, day) => sum + day.calories, 0);
  const maxDailyCalories = Math.max(...statsData.weeklyData.map(day => day.calories));

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <TouchableOpacity onPress={onShowAll}>
          <Text style={styles.showAll}>Show all</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>This week</Text>

      <LinearGradient colors={['#60A5FA', '#6366F1']} style={styles.statsContainer}>
        <View style={styles.statsInfo}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{totalCalories}kcal</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{statsData.time}</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          {statsData.weeklyData.map((dayData) => (
            <View key={dayData.day} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max((dayData.calories / maxDailyCalories) * 100, 5),
                  }
                ]}
              />
              <Text style={styles.dayLabel}>{dayData.day}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  showAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  statsInfo: {
    marginRight: 24,
  },
  statItem: {
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});