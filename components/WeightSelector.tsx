import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (multiplier: number, portionLabel: string) => void;
  foodName: string;
}

const AMOUNTS = Array.from({ length: 100 }, (_, i) => i + 1);
const FRACTIONS = [0, 0.25, 0.5, 0.75];
const UNITS = ['g', 'cup', 'piece', 'bowl'];

export default function WeightSelector({ visible, onClose, onConfirm, foodName }: Props) {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [selectedFraction, setSelectedFraction] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState('g');

  const calculateMultiplier = () => {
    const total = selectedAmount + selectedFraction;
    switch (selectedUnit) {
      case 'g': return total / 100;
      case 'cup': return total;
      case 'piece': return total * 0.5;
      case 'bowl': return total * 1.5;
      default: return total;
    }
  };

  const getPortionLabel = () => {
    const total = selectedAmount + selectedFraction;
    return `${total} ${selectedUnit}`;
  };

  const handleConfirm = () => {
    const multiplier = calculateMultiplier();
    const label = getPortionLabel();
    onConfirm(multiplier, label);
    onClose();
  };

  const renderWheel = (data: any[], selectedValue: any, onSelect: (value: any) => void) => (
    <View style={styles.wheelContainer}>
      <View style={styles.selectionIndicator} />
      <ScrollView
        style={styles.wheel}
        showsVerticalScrollIndicator={false}
        snapToInterval={40}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: 80 }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / 40);
          const value = data[index];
          if (value !== undefined) onSelect(value);
        }}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.wheelItem}>
            <Text style={[
              styles.wheelText,
              item === selectedValue && styles.selectedText
            ]}>
              {item === 0 && data === FRACTIONS ? '' : item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.question}>How much did you eat?</Text>
            
            <View style={styles.wheelRow}>
              {renderWheel(AMOUNTS, selectedAmount, setSelectedAmount)}
              {renderWheel(FRACTIONS, selectedFraction, setSelectedFraction)}
              {renderWheel(UNITS, selectedUnit, setSelectedUnit)}
            </View>
            
            <Text style={styles.previewText}>{getPortionLabel()}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <LinearGradient colors={['#22C55E', '#16A34A']} style={styles.confirmGradient}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.confirmText}>Add Food</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    
  },
  content: {
    padding: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  wheelRow: {
    flexDirection: 'row',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    overflow: 'hidden',
  },
  wheelContainer: {
    flex: 1,
    position: 'relative',
  },
  wheel: {
    flex: 1,
  },
  wheelItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 20,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 80,
    left: 8,
    right: 8,
    height: 40,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  previewText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22C55E',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});