import React from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function EarlyLearningScreen() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Early Learning For All</Text>

                <View style={styles.card}>
                    <Text style={styles.paragraph}>
                        Ninety percent of your child's brain develops during the first five years. High-quality child care and preschool help children's brains develop, support physical and emotional growth, and prepare them for kindergarten.
                    </Text>
                    <Text style={styles.paragraph}>
                        The Department of Early Childhood (DEC) helps ensure every child in San Francisco has access to early care and education. Two-thirds of families in SF are eligible for free child care, and many more can receive tuition discounts through the Early Learning For All initiative.
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="checkmark-circle-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>Find Out if You Qualify</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        Early Learning For All offers financial support based on family size and income:
                    </Text>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Fully-Funded Tuition:</Text> Free enrollment for families earning up to 110% of the Area Median Income (up to $164,850/year for a family of four).</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Tuition Credit:</Text> 50% off published tuition rates for families earning between 111%-150% of the AMI (up to $224,800/year for a family of four).</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        You can check eligibility and start your application online. The process involves verifying income, address, and preferences for hours, location, and language.
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="list-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>Other Ways to Apply</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Resource and Referral Agencies:</Text> Contact Children's Council, Wu Yee Children's Services, or Compass Family Services (for families experiencing homelessness) for help.</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Directly through Programs:</Text> Apply through an Early Learning For All network program.</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="information-circle-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>About the Programs</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        Over 500 programs are part of the network, meeting high-quality standards for curriculum, teachers, safety, and family partnerships.
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
