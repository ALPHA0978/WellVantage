import BottomNavigation from "../components/BottomNavigation";
import ErrorBoundary from "../components/ErrorBoundary";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <BottomNavigation />
    </ErrorBoundary>
  );
}
