import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import MoodPopup from "../components/MoodPopup";
import MoodScheduler from "../components/MoodScheduler";
import NutritionPage from "../components/NutritionPage";
import Statistics from "../components/Statistics";
import ViewPager from "../components/ViewPager";

interface EmotionData {
  date: string;
  mood: number;
  energy: number;
  stress: number;
}

export default function Index({ onShowAllStats }: { onShowAllStats?: () => void }) {
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [showTestMoodPopup, setShowTestMoodPopup] = useState(false);
  const [showMeditationPopup, setShowMeditationPopup] = useState(false);
  const [showWorkoutPopup, setShowWorkoutPopup] = useState(false);
  const [showNutritionPage, setShowNutritionPage] = useState(false);

  const handleMoodSaved = (mood: number) => {
    const now = new Date();
    const newEntry: EmotionData = {
      date: now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0'),
      mood,
      energy: 3,
      stress: 3,
    };
    
    setEmotionData(prev => {
      const filtered = prev.filter(entry => entry.date !== newEntry.date);
      return [newEntry, ...filtered].slice(0, 30);
    });
  };



  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <ViewPager />
        <Statistics onShowAll={onShowAllStats || (() => {})} />
        
        <View style={{ marginHorizontal: 24, marginTop: 24, marginBottom: 12, height: 120, flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ flex: 1, marginRight: 6 }}
            activeOpacity={0.95}
            onPress={() => setShowNutritionPage(true)}
          >
            <View style={{
              flex: 1,
              padding: 16,
              borderRadius: 16,
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.05)',
            }}>
              <View>
                <Text style={{ color: '#22C55E', fontSize: 12, fontWeight: '500', marginBottom: 2 }}>
                  Set up your
                </Text>
                <Text style={{ color: '#16A34A', fontSize: 16, fontWeight: 'bold' }}>
                  Nutrition
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: '#22C55E', fontSize: 12, fontWeight: '600' }}>Get started</Text>
                <Text style={{ fontSize: 20 }}>🥗</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1, marginLeft: 6 }} activeOpacity={0.95}>
            <View style={{
              flex: 1,
              padding: 16,
              borderRadius: 16,
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.05)',
            }}>
              <View>
                <Text style={{ color: '#3B82F6', fontSize: 12, fontWeight: '500', marginBottom: 2 }}>
                  Track your
                </Text>
                <Text style={{ color: '#1D4ED8', fontSize: 16, fontWeight: 'bold' }}>
                  Exercise
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: '#3B82F6', fontSize: 12, fontWeight: '600' }}>Get started</Text>
                <Text style={{ fontSize: 20 }}>🏋️</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Test Mood Buttons */}
        <TouchableOpacity
          style={{ margin: 24, borderRadius: 12 }}
          onPress={() => setShowTestMoodPopup(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#71affaff', '#2578fdff']}
            style={{ padding: 16, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Test Daily Popup
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginHorizontal: 24, marginBottom: 12, borderRadius: 12 }}
          onPress={() => setShowMeditationPopup(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FBBF24', '#9b6404ff']}
            style={{ padding: 16, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Test Meditation Popup
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginHorizontal: 24, marginBottom: 24, borderRadius: 12 }}
          onPress={() => setShowWorkoutPopup(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#10B981', '#016344ff']}
            style={{ padding: 16, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Test Workout Popup
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Other Components */}
      <MoodScheduler onMoodSaved={handleMoodSaved} />

      <MoodPopup
        visible={showTestMoodPopup}
        onClose={() => setShowTestMoodPopup(false)}
        onSaveMood={(mood) => {
          handleMoodSaved(mood);
          setShowTestMoodPopup(false);
        }}
      />

      <MoodPopup
        visible={showMeditationPopup}
        onClose={() => setShowMeditationPopup(false)}
        onSaveMood={(mood) => {
          handleMoodSaved(mood);
          setShowMeditationPopup(false);
        }}
        type="meditation"
      />

      <MoodPopup
        visible={showWorkoutPopup}
        onClose={() => setShowWorkoutPopup(false)}
        onSaveMood={(mood) => {
          handleMoodSaved(mood);
          setShowWorkoutPopup(false);
        }}
        type="workout"
      />

      {showNutritionPage && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: '#F9FAFB',
        }}>
          <NutritionPage onBack={() => setShowNutritionPage(false)} />
        </View>
      )}
    </View>
  );
}
