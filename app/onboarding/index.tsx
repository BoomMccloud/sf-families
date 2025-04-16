import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import * as Localization from 'expo-localization';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
// Import the new language configuration and helper
import { supportedLanguagesConfig, getApiCodeByAppCode } from '../../config/languageConfig'; // Adjust path if necessary

// Define key for storing selected language
const SELECTED_LANGUAGE_KEY = '@selectedLanguage';

export default function OnboardingScreen() {
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    const { updateLanguageAndReconnect } = useLiveAPIContext();

    useEffect(() => {
        let defaultLangCode: string | null = null;

        const locales = Localization.getLocales();
        const locale = locales[0];
        const systemLanguageCode = locale?.languageCode;
        const systemRegionCode = locale?.regionCode;
        const systemScriptCode = locale && 'scriptCode' in locale && typeof locale.scriptCode === 'string' ? locale.scriptCode : undefined;

        let detectedAppCode: string | undefined;

        // Attempt to map detected locale to our supported app codes
        if (systemLanguageCode === 'zh') {
            if (systemScriptCode === 'Hans' || systemRegionCode === 'CN' || systemRegionCode === 'SG') detectedAppCode = 'zh-CN';
            else if (systemScriptCode === 'Hant' || systemRegionCode === 'TW' || systemRegionCode === 'HK' || systemRegionCode === 'MO') detectedAppCode = 'zh-TW';
            else detectedAppCode = 'zh-CN'; // Default Chinese variant
        } else {
            // Find if the detected language code directly matches one of our app codes
            detectedAppCode = supportedLanguagesConfig.find(lang => lang.appCode === systemLanguageCode)?.appCode;
        }

        // Use the detected code if valid, otherwise fallback to 'en'
        defaultLangCode = detectedAppCode ?? 'en';

        setSelectedLanguage(defaultLangCode);
        console.log('Onboarding: Pre-selected language based on detection:', defaultLangCode);
    }, []);

    const handleSelectLanguage = (appCode: string) => {
        setSelectedLanguage(appCode);
        i18n.changeLanguage(appCode).catch((err) => {
            console.error("Failed to change language on select:", err);
        });
    };

    const handleContinue = async () => {
        if (!selectedLanguage) {
            console.warn('No language selected.');
            return;
        }

        setIsProcessing(true);
        try {
            // Ensure i18n is updated (though handleSelectLanguage likely did it)
            if (i18n.language !== selectedLanguage) {
                 await i18n.changeLanguage(selectedLanguage);
                 console.log('i18n language synced before save:', selectedLanguage);
            }

            // Save the selected app language code
            await AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, selectedLanguage);
            console.log('Language saved to storage.');

            // Get the corresponding API code from the config
            const apiLanguageCode = getApiCodeByAppCode(selectedLanguage);

            if (!apiLanguageCode) {
                console.error(`Could not find API language code for selected app code: ${selectedLanguage}. Defaulting to en-US.`);
                // Handle this error case - maybe default or show an error
                await updateLanguageAndReconnect('en-US'); // Fallback
            } else {
                console.log(`Attempting to set language code ${apiLanguageCode} (mapped from ${selectedLanguage}) and reconnect...`);
                await updateLanguageAndReconnect(apiLanguageCode);
            }

            console.log('System instruction updated and reconnected successfully.');
            router.push('/onboarding/children');

        } catch (error) {
            console.error('Error during continue process (save/reconnect): ', error);
            // If reconnect failed, updateLanguageAndReconnect should have logged it.
            // If AsyncStorage failed, log it here.
            setIsProcessing(false);
            // Optionally show an alert to the user
            // Alert.alert("Error", "Could not save settings or update language. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                 <Text style={styles.title}>{t('onboarding.title')}</Text>
                 <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {/* Map over the imported config to generate buttons */}
                {supportedLanguagesConfig.map((lang) => (
                    <TouchableOpacity
                        key={lang.appCode} // Use appCode as key
                        style={[
                            styles.languageButton,
                            selectedLanguage === lang.appCode && styles.selectedLanguageButton,
                        ]}
                        onPress={() => handleSelectLanguage(lang.appCode)} // Pass appCode
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.languageText,
                                selectedLanguage === lang.appCode && styles.selectedLanguageText,
                            ]}
                        >
                            {lang.displayName} {/* Use displayName for text */}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={[styles.continueButton, (!selectedLanguage || isProcessing) && styles.disabledButton]}
                onPress={handleContinue}
                disabled={!selectedLanguage || isProcessing}
            >
                {isProcessing ? (
                     <ActivityIndicator size="small" color="#FFFFFF" />
                 ) : (
                    <Text style={styles.continueButtonText}>{t('onboarding.continue')}</Text>
                 )}
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (colorScheme: 'light' | 'dark' | null | undefined) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60, // Or use SafeAreaView
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 25,
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        textAlign: 'center',
    },
     subtitle: {
        fontSize: 16,
        color: colorScheme === 'dark' ? '#AAAAAA' : '#555555',
        textAlign: 'center',
    },
    scrollView: {
        width: '100%',
        flex: 1,
    },
    scrollViewContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingBottom: 0,
    },
    languageButton: {
        paddingVertical: 18,
        paddingHorizontal: 10,
        borderWidth: 1.5,
        borderColor: colorScheme === 'dark' ? '#555555' : '#CCCCCC',
        borderRadius: 12,
        marginBottom: 15,
        width: '48%',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
        minHeight: 70,
    },
    selectedLanguageButton: {
        borderColor: '#0A84FF',
        backgroundColor: colorScheme === 'dark' ? 'rgba(10, 132, 255, 0.2)' : 'rgba(10, 132, 255, 0.1)',
        borderWidth: 2,
    },
    languageText: {
        fontSize: 18,
        fontWeight: '500',
        color: colorScheme === 'dark' ? '#E5E5EA' : '#1C1C1E',
        textAlign: 'center',
    },
    selectedLanguageText: {
        fontWeight: '600',
        color: colorScheme === 'dark' ? '#FFFFFF' : '#0A84FF',
    },
    continueButton: {
        marginTop: 15,
        backgroundColor: '#0A84FF',
        paddingVertical: 16,
        borderRadius: 14,
        width: '100%',
        alignSelf: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 54,
    },
    disabledButton: {
        backgroundColor: colorScheme === 'dark' ? '#3A3A3C' : '#E5E5EA',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

// Note: For SafeAreaView, you would typically import it from 'react-native-safe-area-context'
// and wrap the main <View> inside it for better handling of notches and status bars.
// Example: import { SafeAreaView } from 'react-native-safe-area-context';
//          return <SafeAreaView style={{flex: 1, backgroundColor: ...}}><View>...</View></SafeAreaView>;
