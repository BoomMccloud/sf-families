import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import { useColorScheme } from '@/hooks/useColorScheme';
import '../lib/i18n'; // Import to initialize i18next (assuming path lib/i18n.ts)
import i18n from '../lib/i18n'; // Import the configured instance
import { LiveAPIProvider } from '@/contexts/LiveAPIContext';
import ControlTray from '@/components/control-tray/ControlTray';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Retrieve API Key (Do this outside the component to avoid re-running)
const apiKey = Constants.expoConfig?.extra?.apiKey as string | undefined;

const ONBOARDING_COMPLETED_KEY = '@onboardingCompleted';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isI18nReady, setIsI18nReady] = useState(false); // State for i18n readiness
  const router = useRouter();
  // Dummy ref for video - not used in native for now
  const videoRef = useRef<any>(null);

  // Effect for checking onboarding status
  useEffect(() => {
    async function checkStorage() {
      let onboardingComplete = false; // Default assumption
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        console.log(`AsyncStorage Check: Key='${ONBOARDING_COMPLETED_KEY}', Raw Value='${value}'`); // Keep logging
        onboardingComplete = value === 'true';
        console.log(`AsyncStorage Check: Parsed onboardingComplete=${onboardingComplete}`); // Keep logging
      } catch (e) {
        console.error('Failed to load onboarding status:', e);
        onboardingComplete = false;
      } finally {
        setIsOnboardingComplete(onboardingComplete);
        console.log('Onboarding state set to:', onboardingComplete);
      }
    }
    checkStorage();
  }, []);

  // Effect for initializing i18next and waiting for language detection
  useEffect(() => {
    const initI18n = () => {
        // Check if already initialized (e.g., due to Fast Refresh)
        if (i18n.isInitialized) {
            console.log('i18n already initialized.');
            setIsI18nReady(true);
            return; // Don't attach listeners if already done
        }

        console.log('Waiting for i18n initialization...');
        const handleInitialized = () => {
            console.log('i18n initialized successfully. Language:', i18n.language);
            setIsI18nReady(true);
            // Clean up listeners immediately after success
            i18n.off('initialized', handleInitialized);
            i18n.off('failedLoading', handleFailedLoading);
        };

        const handleFailedLoading = (lng: string, ns: string, msg: string) => {
            console.error('i18n failed loading:', lng, ns, msg);
            // Handle error, maybe fallback or show error message
            // Still set ready to prevent blocking UI indefinitely on load failure
            setIsI18nReady(true);
            // Clean up listeners immediately after failure
            i18n.off('initialized', handleInitialized);
            i18n.off('failedLoading', handleFailedLoading);
        };

        i18n.on('initialized', handleInitialized);
        i18n.on('failedLoading', handleFailedLoading);
    };

    initI18n();

    // Cleanup function to remove listeners if component unmounts *before* init completes
    return () => {
      i18n.off('initialized');
      i18n.off('failedLoading');
    };
  }, []); // Run only once on mount

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && isOnboardingComplete !== null && isI18nReady) {
      console.log('Layout Ready: Fonts, Onboarding Status, i18n');
      console.log(`Layout Check: isOnboardingComplete = ${isOnboardingComplete}`); // Keep logging

      await SplashScreen.hideAsync();
      console.log('Splash screen hidden.');

      if (isOnboardingComplete === false) {
        console.log('Redirect Condition Met: isOnboardingComplete is false. Redirecting...');
        router.replace('/onboarding'); // Redirect is correct
      } else {
        console.log('Redirect Condition Not Met: isOnboardingComplete is true. Staying on current/initial route.');
      }
    } else {
       console.log(`Layout Not Ready: Fonts=${fontsLoaded}, OnboardingChecked=${isOnboardingComplete !== null}, i18n=${isI18nReady}`); // Keep logging
    }
  }, [fontsLoaded, isOnboardingComplete, isI18nReady, router]);

  // Check if everything is ready before rendering the main layout
  if (!fontsLoaded || !isI18nReady || isOnboardingComplete === null) {
    return null; // Keep showing splash screen (or a loading view)
  }

  // Check for API Key before rendering the provider and tray
  if (!apiKey) {
    // Render an error message or a specific component if the API key is missing
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>API Key is missing. Please check your .env file and app.config.js</Text>
      </View>
    );
  }

  // Render the app structure once everything is ready
  return (
    <LiveAPIProvider apiKey={apiKey}>
      <View style={styles.rootContainer} onLayout={onLayoutRootView}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
        <StatusBar style="auto" />
        {/* Render ControlTray only on client-side web or native, not during SSR if applicable */}
        {Platform.OS !== 'web' || typeof window !== 'undefined' ? (
          <View style={styles.controlTrayWrapper}>
            <ControlTray videoRef={videoRef} supportsVideo={false} />
          </View>
        ) : null}
      </View>
    </LiveAPIProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: 'relative', // Needed for absolute positioning of children
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  // Add styles for ControlTray positioning later if needed
  // e.g., controlTray: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }
  controlTrayWrapper: {
    position: 'absolute', // Make it float
    bottom: Platform.OS === 'ios' ? 80 : 70, // Position near bottom + 50px
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it floats above other content
    alignItems: 'flex-end', // Align panel to the right edge
    pointerEvents: 'box-none',
  },
});
