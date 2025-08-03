import React, { useEffect, useState } from 'react';
import { ImageBackground, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';

type Page = {
  id: number;
  title: string;
  description: string;
  color: string;
  image: string;
};

export default function ViewPager() {
  const [currentPage, setCurrentPage] = useState(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        goToPrevious();
      } else if (gestureState.dx < -50) {
        goToNext();
      }
    },
  });

  const pages: Page[] = [
    { id: 1, title: "Gym Equipment", description: "Professional gym equipment for your fitness journey!", color: "#DBEAFE", image: "https://harshhospital.in/wp-content/uploads/2022/05/7-1.png" },
    { id: 2, title: "Personal Training", description: "Get fit with our expert trainers and programs.", color: "#DCFCE7", image: "https://thumbs.dreamstime.com/b/gym-cartoon-poster-treadmill-promotional-flyer-promocode-weight-lifting-body-building-personal-training-special-offer-216472462.jpg" },
    { id: 3, title: "Your Only Limit Is You", description: "Push beyond your limits and achieve greatness.", color: "#F3E8FF", image: "https://media.istockphoto.com/id/805211262/vector/your-only-limit-is-you-inspiring-creative-motivation-quote-poster-template-vector-typography.jpg?s=612x612&w=0&k=20&c=tjJ3-XBJoXHxnhLicfL7zmdRv6DEA01V4xr1o06AUz4=" },
  ];

  const totalPages = pages.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalPages]);

  const goToNext = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const goToPrevious = () => {
    setCurrentPage((prevPage) => prevPage === 0 ? totalPages - 1 : prevPage - 1);
  };

  return (
    <View 
      style={styles.container}
      {...panResponder.panHandlers}
    >
        <ImageBackground 
          source={{ uri: pages[currentPage].image }}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.indicators}>
              {pages.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    currentPage === index ? styles.activeIndicator : styles.inactiveIndicator
                  ]}
                  onPress={() => setCurrentPage(index)}
                />
              ))}
            </View>
          </View>
        </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  indicators: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});