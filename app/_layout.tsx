import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import '../lib/i18n'; // Import to initialize i18next (assuming path lib/i18n.ts)
import i18n from '../lib/i18n'; // Import the configured instance

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const ONBOARDING_COMPLETED_KEY = '@onboardingCompleted';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isI18nReady, setIsI18nReady] = useState(false); // State for i18n readiness
  const router = useRouter();

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

  // Wait until fonts AND i18n are ready before rendering anything
  // This prevents rendering before translations are loaded or fonts are ready
  if (!fontsLoaded || !isI18nReady) {
    return null; // Keep showing splash screen (or return a custom loading component)
  }

  // Render the app structure once everything is ready
  return (
    // react-i18next's initReactI18next handles the provider context implicitly
    <View style={styles.rootContainer} onLayout={onLayoutRootView}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="test" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  }
});
