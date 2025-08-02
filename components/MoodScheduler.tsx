import React, { useState, useEffect } from 'react';
import MoodPopup from './MoodPopup';

interface Props {
  onMoodSaved: (mood: number) => void;
}

export default function MoodScheduler({ onMoodSaved }: Props) {
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [lastShownDate, setLastShownDate] = useState<string | null>(null);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toDateString();
      
      // Show between 9pm-11pm and only once per day
      if (hour >= 21 && hour < 23 && lastShownDate !== today) {
        setShowMoodPopup(true);
        setLastShownDate(today);
      }
    };

    // Check immediately
    checkTime();
    
    // Check every minute
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, [lastShownDate]);

  const handleMoodSaved = (mood: number) => {
    onMoodSaved(mood);
    setShowMoodPopup(false);
  };

  const handleClose = () => {
    setShowMoodPopup(false);
  };

  return (
    <MoodPopup
      visible={showMoodPopup}
      onClose={handleClose}
      onSaveMood={handleMoodSaved}
    />
  );
}