import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function ComingSoonDialog() {

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <View style={styles.header}>
          <MaterialIcons name="info" size={20} color="#3B82F6" />
          <Text style={styles.headerText}>Coming Soon!</Text>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.circle}>
            <MaterialIcons name="build" size={50} color="#3B82F6" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>This page is under development.</Text>
          <Text style={styles.message}>
            Stay tuned for amazing features! We're working hard to bring you a great experience.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(ComingSoonDialog);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});