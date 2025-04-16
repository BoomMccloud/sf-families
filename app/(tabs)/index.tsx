import React from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function EarlyLearningScreen() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>{t('tabs.index.header')}</Text>

                <View style={styles.card}>
                    <Text style={styles.paragraph}>
                        {t('tabs.index.card1.p1')}
                    </Text>
                    <Text style={styles.paragraph}>
                        {t('tabs.index.card1.p2')}
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="checkmark-circle-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>{t('tabs.index.card2.subHeader')}</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        {t('tabs.index.card2.p1')}
                    </Text>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>{t('tabs.index.card2.listItem1.bold')}</Text> {t('tabs.index.card2.listItem1.text')}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>{t('tabs.index.card2.listItem2.bold')}</Text> {t('tabs.index.card2.listItem2.text')}</Text>
                    </View>
                    <Text style={styles.paragraph}>
                       {t('tabs.index.card2.p2')}
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="list-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>{t('tabs.index.card3.subHeader')}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>{t('tabs.index.card3.listItem1.bold')}</Text> {t('tabs.index.card3.listItem1.text')}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>{t('tabs.index.card3.listItem2.bold')}</Text> {t('tabs.index.card3.listItem2.text')}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="information-circle-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>{t('tabs.index.card4.subHeader')}</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        {t('tabs.index.card4.p1')}
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

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
            marginBottom: 15,
            color: textColor,
        },
        listItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 10,
            paddingLeft: 5,
        },
        bulletIcon: {
            marginRight: 10,
            marginTop: 7,
            color: textColor,
        },
        listText: {
            flex: 1,
            fontSize: 16,
            lineHeight: 24,
            color: textColor,
        },
        bold: {
            fontWeight: 'bold',
        },
    });
};
