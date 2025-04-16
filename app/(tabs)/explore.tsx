import React from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ChildDevelopmentScreen() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Child Development</Text>

                <View style={styles.card}>
                    <Text style={styles.paragraph}>
                        All children deserve to reach their full potential, and early intervention makes that possible. The Department of Early Childhood offers free developmental screenings and early intervention services.
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="search-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>What is a developmental screening?</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        A screening looks at how a child moves, plays, and talks at different ages to see if their development is on track. Finding delays early is crucial, and getting extra help can make a big difference.
                    </Text>
                </View>

                <View style={styles.card}>
                     <View style={styles.subHeaderContainer}>
                        <Ionicons name="list-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>How to Get a Screening</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Pediatrician's Office:</Text> Doctors screen children from birth to age 3.</Text>
                    </View>
                     <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Child Care Programs:</Text> Programs in the Early Learning For All network screen children ages 3-5.</Text>
                    </View>
                     <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Family Resource Centers:</Text> 26 centers offer free screenings.</Text>
                    </View>
                     <View style={styles.listItem}>
                        <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Through DEC:</Text> Contact Support for Families via DEC for free screenings.</Text>
                    </View>
                </View>

                <View style={styles.card}>
                     <View style={styles.subHeaderContainer}>
                        <Ionicons name="help-circle-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>What if Concerns Arise?</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        If a screening indicates concerns, evaluations and services are available. You can be connected through your doctor or care provider, or reach out directly (no referral needed).
                    </Text>
                     <View style={styles.listItem}>
                         <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Under Age 3:</Text> Contact Golden Gate Regional Center.</Text>
                    </View>
                     <View style={styles.listItem}>
                         <Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} />
                        <Text style={styles.listText}><Text style={styles.bold}>Age 3+:</Text> Contact SF Unified School District or Golden Gate Regional Center.</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        Support for Families can assist with the evaluation and eligibility process.
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="calendar-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>Developmental Milestones (Examples)</Text>
                    </View>
                    <View style={styles.listItem}><Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} /><Text style={styles.listText}><Text style={styles.bold}>3 Months:</Text> Lifts head, reaches for toys, coos.</Text></View>
                    <View style={styles.listItem}><Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} /><Text style={styles.listText}><Text style={styles.bold}>6 Months:</Text> Sits without support, babbles.</Text></View>
                    <View style={styles.listItem}><Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} /><Text style={styles.listText}><Text style={styles.bold}>18 Months:</Text> Says single words, walks alone.</Text></View>
                    <View style={styles.listItem}><Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} /><Text style={styles.listText}><Text style={styles.bold}>2 Years:</Text> Says short sentences, kicks a ball.</Text></View>
                    <View style={styles.listItem}><Ionicons name="ellipse" size={10} color={styles.listText.color} style={styles.bulletIcon} /><Text style={styles.listText}><Text style={styles.bold}>3 Years:</Text> Climbs well, plays make-believe.</Text></View>
                    <Text style={styles.paragraph}>Visit cdc.gov/ActEarly for full checklists.</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.subHeaderContainer}>
                        <Ionicons name="phone-portrait-outline" size={24} color={styles.subHeader.color} style={styles.subHeaderIcon} />
                        <Text style={styles.subHeader}>Get Sparkler</Text>
                    </View>
                    <Text style={styles.paragraph}>
                        Sparkler is a free mobile app (iOS/Android) for SF families with children 0-5. Use code SF to check development, find activities, and connect with educators. Available in English, Spanish, and Chinese.
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
