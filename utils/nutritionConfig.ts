// Configuration for nutrition tracking
export const NUTRITION_CONFIG = {
  // Replace with your OpenRouter API key from https://openrouter.ai/keys
  OPENROUTER_API_KEY: 'ADD YOUR OPENROUTER API KEY',
  
  // Using free model (try different ones if one fails)
  MODEL: 'google/gemini-flash-1.5',
  
  // Daily nutrition goals (optional - for future progress tracking)
  DAILY_GOALS: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  },
  
  // Alternative: Free nutrition database option
  USE_FREE_DATABASE: false, // Set to true to use free database instead of AI
};

// Free nutrition database (if ai fail to response)
export const COMMON_FOODS = {
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  'egg': { calories: 70, protein: 6, carbs: 0.6, fat: 5 },
  'bread': { calories: 80, protein: 4, carbs: 14, fat: 1 },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  'salmon': { calories: 208, protein: 22, carbs: 0, fat: 12 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  'pasta': { calories: 220, protein: 8, carbs: 44, fat: 1.1 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15 },
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
  'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
};
