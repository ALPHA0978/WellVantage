import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ProgressArcProps {
  progress: number; // A number between 0 and 100
  size: number; // The size of the SVG container
  strokeWidth: number; // The thickness of the arc
  current: number; // Current value
  target: number; // Target value
}

const ProgressArc = ({ progress, size, strokeWidth, current, target }: ProgressArcProps) => {
  // Calculate progress percentage from current/target if progress is invalid
  const calculatedProgress = target > 0 ? (current / target) * 100 : 0;
  const validProgress = !isNaN(progress) && progress >= 0 ? progress : calculatedProgress;
  
  // Ensure progress is within the valid range [0, 100]
  const clampedProgress = Math.max(0, Math.min(100, validProgress));

  // Make the arc wider by using a wider radius
  const arcWidth = size * 1.2; // Stretch horizontally
  const radius = (arcWidth - strokeWidth) / 2;

  // The circumference of a full circle
  const circumference = 2 * Math.PI * radius;

  // Calculate the total length of the semi-circle path
  const totalArcLength = circumference / 2;

  // Calculate the length of the green progress arc
  const progressArcLength = (clampedProgress / 100) * totalArcLength;

  // Create the path for the semi-circle (stretched horizontally)
  const createArcPath = () => {
    const centerY = size / 2 + strokeWidth * 1.5;
    const startX = strokeWidth / 2;
    const startY = centerY;
    const endX = arcWidth - strokeWidth / 2;
    const endY = centerY;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  const arcPath = createArcPath();

  return (
    <View style={[styles.container, { width: size * 1.2, height: size / 2 + strokeWidth * 3 + 40 }]}>
      <Svg width={size * 1.2} height={size / 2 + strokeWidth * 3} viewBox={`0 0 ${size * 1.2} ${size / 2 + strokeWidth * 3}`} style={styles.svg}>
        {/* Background arc (gray) */}
        <Path
          d={arcPath}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc (green) */}
        <Path
          d={arcPath}
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progressArcLength} ${totalArcLength - progressArcLength}`}
        />
      </Svg>
      
      {/* Progress text */}
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>{Math.round(clampedProgress)}%</Text>
        <Text style={styles.valueText}>{current} / {target} cal</Text>
        <Text style={styles.remainingText}>{Math.max(0, target - current)} left</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    overflow: 'visible',
  },
  textContainer: {
    position: 'absolute',
    bottom: 45,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  remainingText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '400',
  },
});

export default ProgressArc;