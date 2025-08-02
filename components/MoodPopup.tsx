import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaveMood: (mood: number) => void;
}

const { width, height } = Dimensions.get('window');

const moodOptions = [
  { value: 6, label: 'Happy', emoji: '😄', color: '#22C55E' },
  { value: 5, label: 'Content', emoji: '😊', color: '#EAB308' },
  { value: 4, label: 'Neutral', emoji: '😐', color: '#A3A3A3' },
  { value: 3, label: 'Stressed', emoji: '😰', color: '#F97316' },
  { value: 2, label: 'Sad', emoji: '😢', color: '#8B5CF6' },
  { value: 1, label: 'Angry', emoji: '😠', color: '#EF4444' },
];

export default function MoodPopup({ visible, onClose, onSaveMood }: Props) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const sliderPosition = useRef(new Animated.Value(200)).current;
  const SLIDER_HEIGHT = 400;
  const ITEM_HEIGHT = SLIDER_HEIGHT / 6;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newY = Math.max(0, Math.min(SLIDER_HEIGHT - 20, gestureState.moveY - 100));
      sliderPosition.setValue(newY);
      
      const moodIndex = Math.round(newY / ITEM_HEIGHT);
      const newMood = 6 - moodIndex;
      if (newMood >= 1 && newMood <= 6) {
        setSelectedMood(newMood);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      const finalY = Math.max(0, Math.min(SLIDER_HEIGHT - 20, gestureState.moveY - 100));
      const moodIndex = Math.round(finalY / ITEM_HEIGHT);
      const finalMood = 6 - moodIndex;
      
      if (finalMood >= 1 && finalMood <= 6) {
        const snapY = moodIndex * ITEM_HEIGHT;
        Animated.spring(sliderPosition, {
          toValue: snapY,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
        setSelectedMood(finalMood);
      }
    },
  });

  const handleSave = () => {
    if (selectedMood) {
      onSaveMood(selectedMood);
      setSelectedMood(null);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Assessment</Text>
              <Text style={styles.progressNumber}>4 OF 7</Text>
            </View>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.question}>How are you feeling today?</Text>
          </View>

          <View style={styles.moodContainer}>
            <View style={styles.sliderTrack}>
              <View style={styles.sliderLine} />
              <Animated.View 
                style={[
                  styles.sliderHandle,
                  { 
                    top: sliderPosition,
                    backgroundColor: selectedMood ? moodOptions.find(m => m.value === selectedMood)?.color : '#E5E7EB'
                  }
                ]}
                {...panResponder.panHandlers}
              />
            </View>

            <View style={styles.optionsContainer}>
              {moodOptions.map((option, index) => (
                <View
                  key={option.value}
                  style={[
                    styles.moodOption,
                    selectedMood === option.value && styles.selectedOption
                  ]}
                >
                  <View style={styles.optionLeft}>
                    <Text style={[
                      styles.moodLabel,
                      selectedMood === option.value && styles.selectedLabel
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  
                  <Animated.View 
                    style={[
                      styles.emojiContainer, 
                      { 
                        backgroundColor: option.color,
                        transform: [{
                          scale: selectedMood === option.value ? 1.1 : 1
                        }]
                      }
                    ]}
                  >
                    <Text style={styles.emoji}>{option.emoji}</Text>
                  </Animated.View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '57%' }]} />
            </View>
            
            <TouchableOpacity
              style={[
                styles.saveButton,
                selectedMood ? styles.saveButtonActive : styles.saveButtonInactive
              ]}
              onPress={handleSave}
              disabled={!selectedMood}
            >
              <Text style={styles.saveButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  questionContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 36,
  },
  moodContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingRight: 40,
  },
  sliderTrack: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
    marginRight: 24,
  },
  sliderLine: {
    width: 4,
    height: 400,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderHandle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    left: -10,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    transform: [{ scale: 1.02 }],
  },
  selectedLabel: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  optionLeft: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },

  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonActive: {
    backgroundColor: COLORS.primary,
  },
  saveButtonInactive: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});