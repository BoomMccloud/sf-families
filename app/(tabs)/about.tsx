import React from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function AboutScreen() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    const { t } = useTranslation(); // Get translation function

    // Simple placeholder content based on the structure of sfdec.org/about/
    // Could be expanded with more specific sections like Leadership, Strategic Plan etc.
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>{t('tabs.about.header')}</Text>

                {/* Intro Section Card */}
                <View style={styles.card}>
                    <Text style={styles.paragraph}>
                        {t('tabs.about.card1.p1')}
                    </Text>
                    <Text style={styles.paragraph}>
                        {t('tabs.about.card1.p2')}
                    </Text>
                </View>

                {/* Our Work Section Card */}
                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="briefcase-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>{t('tabs.about.card2.subHeader')}</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        {t('tabs.about.card2.p1')}
                    </Text>
                     <Text style={styles.paragraph}>
                        {t('tabs.about.card2.p2')}
                    </Text>
                </View>

                {/* Placeholder for other sections like Leadership, Plan, etc. */}

            </ScrollView>
        </SafeAreaView>
    );
}

// Re-use the enhanced styles
const getStyles = (colorScheme: 'light' | 'dark' | null | undefined) => {
    const isDark = colorScheme === 'dark';
    const cardBackgroundColor = isDark ? '#1C1C1E' : '#F3F3F3';
    const textColor = isDark ? '#CCCCCC' : '#333333';
    const headerColor = isDark ? '#FFFFFF' : '#000000';
    const subHeaderColor = isDark ? '#EFEFEF' : '#111111';

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
        },
        scrollContent: {
            paddingVertical: 20,
            paddingHorizontal: 15,
        },
        header: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 25,
            textAlign: 'center',
            color: headerColor,
        },
        card: {
            backgroundColor: cardBackgroundColor,
            borderRadius: 12,
            padding: 15,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        subHeaderContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        subHeaderIcon: {
            marginRight: 8,
        },
        subHeader: {
            fontSize: 22,
            fontWeight: '600',
            color: subHeaderColor,
        },
        paragraph: {
            fontSize: 16,
            lineHeight: 24,
            // Remove bottom margin from last paragraph in card for better spacing
            // marginBottom: 15, - Handled by card padding
            color: textColor,
        },
        // Removed list styles as they aren't used here
        // listItem, bulletIcon, listText, bold
    });
};
