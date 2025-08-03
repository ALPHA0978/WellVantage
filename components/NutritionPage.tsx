import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COMMON_FOODS, NUTRITION_CONFIG } from '../utils/nutritionConfig';
import ProgressArc from './ProgressArc';
import WeightSelector from './WeightSelector';

interface FoodEntry {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
}

interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function NutritionPage({ onBack }: { onBack: () => void }) {
  const [foodInput, setFoodInput] = useState('');
  const [todaysFoods, setTodaysFoods] = useState<FoodEntry[]>([]);
  const [dailyTotals, setDailyTotals] = useState<DailyNutrition>({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(false);
  const [showWeightSelector, setShowWeightSelector] = useState(false);
  const [pendingFood, setPendingFood] = useState<any>(null);

  useEffect(() => {
    loadFoodEntries();
  }, []);

  useEffect(() => {
    calculateDailyTotals();
    saveFoodEntries();
  }, [todaysFoods]);

  const loadFoodEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem('nutrition_entries');
      if (saved) {
        const entries = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        const todaysEntries = entries.filter((entry: FoodEntry) => 
          entry.timestamp.startsWith(today)
        );
        setTodaysFoods(todaysEntries);
      }
    } catch (error) {
      console.log('Error loading food entries:', error);
    }
  };

  const saveFoodEntries = async () => {
    try {
      await AsyncStorage.setItem('nutrition_entries', JSON.stringify(todaysFoods));
    } catch (error) {
      console.log('Error saving food entries:', error);
    }
  };

  const calculateDailyTotals = () => {
    const totals = todaysFoods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    setDailyTotals(totals);
  };

  const analyzeFood = async (foodDescription: string) => {
    setLoading(true);
    try {
      let nutritionData;
      
      if (NUTRITION_CONFIG.USE_FREE_DATABASE || NUTRITION_CONFIG.OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
        // Use free database fallback
        const searchTerm = foodDescription.toLowerCase();
        const matchedFood = Object.keys(COMMON_FOODS).find(food => 
          searchTerm.includes(food) || food.includes(searchTerm)
        );
        
        if (matchedFood) {
          nutritionData = {
            name: foodDescription,
            ...COMMON_FOODS[matchedFood as keyof typeof COMMON_FOODS]
          };
        } else {
          // Default values for unknown foods
          nutritionData = {
            name: foodDescription,
            calories: 100,
            protein: 5,
            carbs: 15,
            fat: 3
          };
          Alert.alert('Estimated Values', 'Using estimated nutrition values. For accurate data, set up OpenRouter API key.');
        }
      } else {
        // Use OpenRouter API with Gemini
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${NUTRITION_CONFIG.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://wellvantage.app',
            'X-Title': 'WellVantage Nutrition Tracker',
          },
          body: JSON.stringify({
            model: NUTRITION_CONFIG.MODEL,
            messages: [{
              role: 'user',
              content: `Analyze this food: "${foodDescription}". Return ONLY a valid JSON object with nutrition values for 100g serving. Format: {"name": "food name", "calories": 150, "protein": 25, "carbs": 10, "fat": 5}. Use realistic numbers, never null or zero for main macros.`
            }],
            max_tokens: 150,
            temperature: 0.1
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log('API Error:', response.status, errorText);
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.error) {
          throw new Error(data.error.message || 'API returned error');
        }
        
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('No content in API response');
        }
        
        try {
          // Remove markdown code blocks if present
          const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
          nutritionData = JSON.parse(cleanContent);
          
          // Validate that we have valid nutrition data
          if (!nutritionData.calories || nutritionData.calories === null) {
            throw new Error('Invalid nutrition data received');
          }
        } catch (parseError) {
          console.log('Parse error, raw content:', content);
          throw new Error('Could not parse nutrition data');
        }
      }
      
      // Store nutrition data and show weight selector
      setPendingFood({
        name: nutritionData.name,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        carbs: nutritionData.carbs,
        fat: nutritionData.fat,
      });
      setShowWeightSelector(true);
      setFoodInput('');
    } catch (error) {
      console.log('Full error:', error);
      Alert.alert('Error', `Failed to analyze food: ${error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const addFood = () => {
    if (!foodInput.trim()) return;
    analyzeFood(foodInput.trim());
  };

  const removeFood = (id: string) => {
    setTodaysFoods(prev => prev.filter(food => food.id !== id));
  };

  const handlePortionConfirm = (multiplier: number, portionLabel: string) => {
    if (!pendingFood) return;
    
    const newFood: FoodEntry = {
      id: Date.now().toString(),
      name: pendingFood.name,
      portion: portionLabel,
      calories: Math.round(pendingFood.calories * multiplier),
      protein: Math.round(pendingFood.protein * multiplier * 10) / 10,
      carbs: Math.round(pendingFood.carbs * multiplier * 10) / 10,
      fat: Math.round(pendingFood.fat * multiplier * 10) / 10,
      timestamp: new Date().toISOString()
    };

    setTodaysFoods(prev => [newFood, ...prev]);
    setPendingFood(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EBF8FF" />
      
      <LinearGradient colors={['#EBF8FF', '#C3DAFE']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Nutrition</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={{ paddingBottom: 16 }}>
        {/* Daily Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's</Text>
          
          {/* Calorie Progress Arc */}
          <View style={styles.progressSection}>
            <ProgressArc 
              current={Math.round(dailyTotals.calories)}
              target={2800}
              size={230}
              strokeWidth={16}
            />
          </View>
          
          {/* Other Macros */}
          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailyTotals.protein)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailyTotals.carbs)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailyTotals.fat)}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Add Food */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Food</Text>
          <Text style={styles.cardSubtitle}>
            {NUTRITION_CONFIG.USE_FREE_DATABASE || NUTRITION_CONFIG.OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE' 
              ? 'Enter food name (e.g., "chicken breast", "rice", "banana")'
              : 'Describe what you ate'}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter food description..."
              value={foodInput}
              onChangeText={setFoodInput}
              multiline
            />
            <TouchableOpacity 
              style={[styles.addButton, loading && styles.addButtonDisabled]} 
              onPress={addFood}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="add" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Food List */}
        {todaysFoods.map((food) => {
          const foodTime = new Date(food.timestamp);
          const timeStr = foodTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
          
          return (
            <View key={food.id} style={styles.foodItem}>
              <View style={styles.timeSection}>
                <Text style={styles.timeText}>{timeStr.split(' ')[0]}</Text>
                <Text style={styles.ampmText}>{timeStr.split(' ')[1]}</Text>
              </View>
              
              <View style={styles.foodInfo}>
                <View style={styles.foodHeader}>
                  <View style={styles.foodDot} />
                  <Text style={styles.portionText}>{food.portion}</Text>
                </View>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodNutrition}>
                  {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                </Text>
              </View>
              
              <TouchableOpacity onPress={() => removeFood(food.id)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      
      <WeightSelector
        visible={showWeightSelector}
        onClose={() => {
          setShowWeightSelector(false);
          setPendingFood(null);
        }}
        onConfirm={handlePortionConfirm}
        foodName={pendingFood?.name || ''}
      />
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
    marginTop: -25,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: -10,
  },

  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    maxHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  foodItem: {
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
  timeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 60,
    backgroundColor: '#22C55E20',
    borderRadius: 12,
    marginRight: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16A34A',
    lineHeight: 16,
  },
  ampmText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#22C55E',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  foodInfo: {
    flex: 1,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  portionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  foodNutrition: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  removeButton: {
    padding: 8,
  },
});