import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import * as Localization from 'expo-localization';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';

// Define supported languages with native names and BCP-47 codes from Chirp 3 list
const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh-CN', name: '中文 (简体)' }, // Simplified Chinese
    { code: 'zh-TW', name: '中文 (繁體)' }, // Traditional Chinese
    { code: 'fil', name: 'Filipino' }, // Filipino
    { code: 'vi', name: 'Tiếng Việt' }, // Vietnamese
    { code: 'ru', name: 'Русский' }, // Russian
];

const ONBOARDING_COMPLETED_KEY = '@onboardingCompleted';
const SELECTED_LANGUAGE_KEY = '@selectedLanguage';

export default function OnboardingScreen() {
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    const { updateLanguageAndReconnect } = useLiveAPIContext();

    let defaultLangCode: string | null = null;

    useEffect(() => {
        // Detect system language to *pre-select* the most likely choice
        // This makes the UI match the potential system language initially
        const locales = Localization.getLocales();
        const locale = locales[0]; // Get the first locale object
        const systemLanguageCode = locale?.languageCode;
        const systemRegionCode = locale?.regionCode;
        // Safely access scriptCode, checking if the property exists and is a string
        const systemScriptCode = locale && 'scriptCode' in locale && typeof locale.scriptCode === 'string' ? locale.scriptCode : undefined;

        // Original detection logic
        if (systemLanguageCode === 'zh') {
            // Fallback for Chinese variants if exact tag not found
            if (systemScriptCode === 'Hans') defaultLangCode = 'zh-CN';
            else if (systemScriptCode === 'Hant') defaultLangCode = 'zh-TW';
            else if (systemRegionCode === 'CN' || systemRegionCode === 'SG') defaultLangCode = 'zh-CN';
            else if (systemRegionCode === 'TW' || systemRegionCode === 'HK' || systemRegionCode === 'MO') defaultLangCode = 'zh-TW';
            else defaultLangCode = 'zh-CN'; // Default 'zh'
        } else {
            // Original fallback
            const supportedLang = supportedLanguages.find(lang => lang.code === systemLanguageCode);
            if (supportedLang) {
                defaultLangCode = supportedLang.code;
            }
        }

        // Final fallback to en
        setSelectedLanguage(defaultLangCode ?? 'en');
        console.log('Onboarding: Pre-selected language based on detection:', defaultLangCode ?? 'en');
    }, []); // Run only once on mount

    const handleSelectLanguage = (languageCode: string) => {
        setSelectedLanguage(languageCode);
        // Call i18n.changeLanguage here for immediate UI update
        i18n.changeLanguage(languageCode).catch((err) => {
            console.error("Failed to change language on select:", err);
            // Optionally handle the error, though it's less critical here than on save
        });
    };

    const handleContinue = async () => {
        if (selectedLanguage) {
            setIsProcessing(true);
            try {
                // Language should already be changed, but ensure it's set before saving
                if (i18n.language !== selectedLanguage) {
                     await i18n.changeLanguage(selectedLanguage);
                     console.log('i18n language synced before save:', selectedLanguage);
                }

                // Save selection and onboarding status
                await AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, selectedLanguage);
                console.log('Language and onboarding status saved.');

                // Update system instruction and reconnect
                try {
                    // Map app language code to API BCP-47 code
                    const appLanguageCode = selectedLanguage;
                    let apiLanguageCode: string;
                    switch (appLanguageCode) {
                        case 'en': apiLanguageCode = 'en-US'; break; // Default English to US
                        case 'es': apiLanguageCode = 'es-US'; break; // Default Spanish to US
                        case 'zh-CN': apiLanguageCode = 'cmn-CN'; break; // Simplified Chinese
                        case 'zh-TW': apiLanguageCode = 'cmn-CN'; break; // Map Traditional Chinese to Simplified Chinese for API
                        case 'fil': apiLanguageCode = 'en-US'; break; // Map Filipino to English US for API
                        case 'vi': apiLanguageCode = 'vi-VN'; break; // Vietnamese
                        case 'ru': apiLanguageCode = 'ru-RU'; break; // Russian
                        default: apiLanguageCode = 'en-US'; // Fallback to English US
                    }

                    // const instructionText = `RESPOND IN ${languageCode}. YOU MUST RESPOND UNMISTAKABLY IN ${languageCode}.`;
                    // const newSystemInstruction = { parts: [{ text: instructionText }] }; // This will be constructed in the hook function
                    console.log(`Attempting to set language code ${apiLanguageCode} (mapped from ${appLanguageCode}) and reconnect...`);
                    await updateLanguageAndReconnect(apiLanguageCode); // Pass the mapped BCP-47 code
                    console.log('System instruction updated and reconnected successfully.');
                    // Proceed with navigation only after successful reconnect
                    router.push('/onboarding/children');
                } catch (reconnectError) {
                    console.error('Failed to set system instruction and reconnect:', reconnectError);
                    // Handle the error appropriately - maybe show a message to the user?
                    // For now, we stop processing and don't navigate.
                    setIsProcessing(false);
                    // Optionally, alert the user:
                    // Alert.alert("Connection Error", "Could not update language settings. Please try again.");
                    return; // Stop execution here if reconnect fails
                }
            } catch (e) {
                console.error('Failed to save onboarding data or change language:', e);
                setIsProcessing(false);
            }
        } else {
            console.warn('No language selected.');
        }
    };

    // No need for the initial loading check here anymore, _layout handles app readiness

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                 <Text style={styles.title}>{t('onboarding.title')}</Text>
                 <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {supportedLanguages.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        style={[
                            styles.languageButton,
                            selectedLanguage === lang.code && styles.selectedLanguageButton,
                        ]}
                        onPress={() => handleSelectLanguage(lang.code)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.languageText,
                                selectedLanguage === lang.code && styles.selectedLanguageText,
                            ]}
                        >
                            {lang.name}
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
        // Remove alignItems: 'center' if you want ScrollView/Button to stretch full width naturally
        // alignItems: 'center', // Keep if children should be centered horizontally
    },
    headerContainer: {
        alignItems: 'center', // Center title and subtitle
        marginBottom: 25, // Keep space below subtitle
        width: '100%', // Ensure it takes width if container doesn't align items center
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
        // Removed marginBottom here, handled by headerContainer
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
        alignItems: 'center', // Keep alignItems for centering the text/indicator inside
        justifyContent: 'center',
        minHeight: 54,
    },
    disabledButton: {
        backgroundColor: colorScheme === 'dark' ? '#3A3A3C' : '#E5E5EA',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600', // Semibold - corrected from previous comment
    },
});

// Note: For SafeAreaView, you would typically import it from 'react-native-safe-area-context'
// and wrap the main <View> inside it for better handling of notches and status bars.
// Example: import { SafeAreaView } from 'react-native-safe-area-context';
//          return <SafeAreaView style={{flex: 1, backgroundColor: ...}}><View>...</View></SafeAreaView>;
