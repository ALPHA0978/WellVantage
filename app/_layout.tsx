import BottomNavigation from "../components/BottomNavigation";
import ErrorBoundary from "../components/ErrorBoundary";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <BottomNavigation />
    </ErrorBoundary>
  );
}
