# WellVantage - Civic Issue Reporter 🏙️

A React Native app built with Expo for reporting and tracking civic issues in your community. Help make your city better by reporting problems like potholes, electricity issues, water supply problems, and more.

## Features

- 📱 **Easy Issue Reporting**: Report civic problems with just a few taps
- 📍 **Location-Based**: Automatically capture location data for accurate reporting
- 🏷️ **Categorized Issues**: Organize reports by type (potholes, electricity, water, etc.)
- 📊 **Real-time Statistics**: View community-wide issue statistics and resolution rates
- 📋 **Issue Tracking**: Monitor the status of all reported issues
- 🔥 **Firebase Integration**: Real-time data synchronization with Firestore
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Issue Categories

- 🕳️ Potholes
- ⚡ Electricity Issues
- 💧 Water Supply Problems
- 🗑️ Garbage Collection
- 💡 Street Light Issues
- 🌊 Drainage Problems
- 🚦 Traffic Issues
- 📝 Other Issues

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Update `config/firebase.ts` with your Firebase project credentials
   - Enable Firestore in your Firebase console
   - Set up the `issues` collection

3. **Start the app**
   ```bash
   npx expo start
   ```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Update the Firebase configuration in `config/firebase.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

## App Structure

- **Home**: Quick issue reporting and category selection
- **Report**: Detailed issue reporting form with location capture
- **Issues**: List view of all reported issues with real-time updates
- **Statistics**: Community-wide analytics and resolution tracking
- **Profile**: User profile and civic engagement metrics

## Technologies Used

- **React Native** with Expo
- **TypeScript** for type safety
- **Firebase Firestore** for real-time database
- **Expo Location** for GPS functionality
- **React Native Reanimated** for smooth animations
- **Expo Linear Gradient** for modern UI design

## Contributing

Help improve civic engagement in your community! Feel free to submit issues and enhancement requests.

## License

This project is open source and available under the MIT License.
