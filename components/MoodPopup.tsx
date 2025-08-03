import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../utils/constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaveMood: (mood: number) => void;
  type?: 'daily' | 'meditation' | 'workout';
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 100;
const CONTAINER_WIDTH = width - 48;

const moodOptions = [
  { value: 1, label: 'Angry', image: require('../assets/mood-image/angry.png'), color: '#EF4444' },
  { value: 2, label: 'Sad', image: require('../assets/mood-image/sad.png'), color: '#8B5CF6' },
  { value: 3, label: 'Stressed', image: require('../assets/mood-image/Stressed.png'), color: '#F97316' },
  { value: 4, label: 'Neutral', image: require('../assets/mood-image/neutral.png'), color: '#A3A3A3' },
  { value: 5, label: 'Content', image: require('../assets/mood-image/Content.png'), color: '#EAB308' },
  { value: 6, label: 'Happy', image: require('../assets/mood-image/happy.png'), color: '#22C55E' },
];

export default function MoodPopup({ visible, onClose, onSaveMood, type = 'daily' }: Props) {
  const [selectedMood, setSelectedMood] = useState<number>(4);
  const [isHandlePressed, setIsHandlePressed] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      backgroundOpacity.setValue(0);
      modalOpacity.setValue(0);
      setShowThankYou(false);
      
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(backgroundOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(modalOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }, 50);

      if (scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ x: (selectedMood - 1) * ITEM_WIDTH, animated: false });
        }, 100);
      }
    }
  }, [visible]);

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / ITEM_WIDTH);
    const moodValue = Math.max(1, Math.min(6, index + 1));
    setSelectedMood(moodValue);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      setIsHandlePressed(true);
      return true;
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
        const opacity = Math.max(0, 1 - gestureState.dy / 200);
        backgroundOpacity.setValue(opacity);

      }
    },
    onPanResponderRelease: (_, gestureState) => {
      setIsHandlePressed(false);
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(backgroundOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }),

        ]).start();
      }
    },
  });

  const handleSave = () => {
    // Start fade out animation
    Animated.parallel([
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    // Use setTimeout to avoid state updates in animation callback
    setTimeout(async () => {
      // Show thank you message
      setShowThankYou(true);
      
      // Save mood data with timestamp
      const now = new Date();
      console.log('Current date/time:', now.toString());
      console.log('ISO date:', now.toISOString().split('T')[0]);
      
      const moodData = {
        mood: selectedMood,
        date: now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0'),
        time: now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        timestamp: now.toISOString()
      };
      
      // Save to AsyncStorage
      try {
        const storageKey = type === 'meditation' ? 'meditationMoodData' : 
                          type === 'workout' ? 'workoutMoodData' : 'moodHistory';
        
        const existingData = await AsyncStorage.getItem(storageKey);
        const moodHistory = existingData ? JSON.parse(existingData) : [];
        moodHistory.unshift({...moodData, type});
        await AsyncStorage.setItem(storageKey, JSON.stringify(moodHistory.slice(0, 50)));
      } catch (error) {
        console.log('Error saving mood data:', error);
      }
      
      onSaveMood(selectedMood);
    }, 300);
  };

  const selectedMoodData = moodOptions.find(m => m.value === selectedMood);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, { opacity: backgroundOpacity }]}>
          <View style={styles.backdrop} />
        </Animated.View>
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }], opacity: modalOpacity }]}>
          <View style={styles.handleArea}>
            <View style={[styles.handle, { backgroundColor: isHandlePressed ? COLORS.primary : 'rgba(0, 0, 0, 0.1)' }]} {...panResponder.panHandlers} />
          </View>
          
          <Text style={styles.title}>
            {type === 'meditation' 
              ? 'How are you feeling after meditation today?' 
              : type === 'workout'
              ? 'How are you feeling after workout today?'
              : 'How are you feeling today?'}
          </Text>
          
          <View style={styles.selectedMoodContainer}>
            <View style={[styles.selectedImageContainer, { backgroundColor: selectedMoodData?.color + '15' }]}>
              <Image source={selectedMoodData?.image} style={styles.selectedImage} />
            </View>
            <Text style={styles.selectedMoodLabel}>{selectedMoodData?.label}</Text>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodScrollContainer}
            style={styles.moodScrollView}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
          >
            {moodOptions.map((option) => (
              <View key={option.value} style={styles.moodItem}>
                <View style={[
                  styles.moodImageContainer,
                  selectedMood === option.value && { 
                    backgroundColor: option.color + '20',
                    transform: [{ scale: 1.1 }]
                  }
                ]}>
                  <Image 
                    source={option.image} 
                    style={[
                      styles.moodImage,
                      selectedMood !== option.value && { opacity: 0.5 }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={handleSave}>
            <LinearGradient colors={['#60A5FA', '#6366F1']} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        {showThankYou && (
          <TouchableOpacity 
            style={styles.thankYouContainer}
            onPress={() => {
              setShowThankYou(false);
              onClose();
            }}
            activeOpacity={1}
          >
            <View style={styles.thankYouCard}>
              <Text style={styles.thankYouText}>Thank you!</Text>
              <Text style={styles.thankYouSubText}>Your mood has been saved</Text>
              <Text style={styles.tapToDismiss}>Tap to continue</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SIZES.xxl,
    paddingBottom: 40,
    paddingTop: SIZES.sm,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  handleArea: {
    alignItems: 'center',
    marginBottom: SIZES.xs,
    paddingVertical: 4,
  },
  handle: {
    width: 100,
    height: 8,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  selectedMoodContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  selectedImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  selectedMoodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  moodScrollView: {
    marginBottom: 32,
  },
  moodScrollContainer: {
    paddingHorizontal: CONTAINER_WIDTH / 2 - ITEM_WIDTH / 2,
  },
  moodItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  moodImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  moodImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  thankYouContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  thankYouCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  thankYouText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  thankYouSubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  tapToDismiss: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
});