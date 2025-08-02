import { ScrollView, StatusBar, View, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import ViewPager from "../components/ViewPager";
import Statistics from "../components/Statistics";
import MoodScheduler from "../components/MoodScheduler";
import MoodPopup from "../components/MoodPopup";

interface EmotionData {
  date: string;
  mood: number;
  energy: number;
  stress: number;
}

export default function Index({ onShowAllStats }: { onShowAllStats?: () => void }) {
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [showTestMoodPopup, setShowTestMoodPopup] = useState(false);

  const handleMoodSaved = (mood: number) => {
    const newEntry: EmotionData = {
      date: new Date().toISOString().split('T')[0],
      mood,
      energy: 3, // Default values for automatic mood tracking
      stress: 3,
    };
    
    setEmotionData(prev => {
      const filtered = prev.filter(entry => entry.date !== newEntry.date);
      return [newEntry, ...filtered].slice(0, 30);
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ViewPager />
        <Statistics onShowAll={onShowAllStats || (() => {})} />
        
        <TouchableOpacity
          style={{
            backgroundColor: '#3B82F6',
            margin: 24,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
          onPress={() => setShowTestMoodPopup(true)}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Test Mood Popup (9pm-11pm Auto)
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <MoodScheduler onMoodSaved={handleMoodSaved} />
      
      <MoodPopup
        visible={showTestMoodPopup}
        onClose={() => setShowTestMoodPopup(false)}
        onSaveMood={(mood) => {
          handleMoodSaved(mood);
          setShowTestMoodPopup(false);
        }}
      />
    </View>
  );
}
