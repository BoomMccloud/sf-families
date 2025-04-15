import React from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChildDevelopmentScreen() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Child Development</Text>

                <Text style={styles.paragraph}>
                    All children deserve to reach their full potential, and early intervention makes that possible. The Department of Early Childhood offers free developmental screenings and early intervention services.
                </Text>

                <Text style={styles.subHeader}>What is a developmental screening?</Text>
                <Text style={styles.paragraph}>
                    A screening looks at how a child moves, plays, and talks at different ages to see if their development is on track. Finding delays early is crucial, and getting extra help can make a big difference.
                </Text>

                <Text style={styles.subHeader}>How to Get a Screening</Text>
                <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}><Text style={styles.bold}>Pediatrician's Office:</Text> Doctors screen children from birth to age 3.</Text>
                </View>
                 <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}><Text style={styles.bold}>Child Care Programs:</Text> Programs in the Early Learning For All network screen children ages 3-5.</Text>
                </View>
                 <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}><Text style={styles.bold}>Family Resource Centers:</Text> 26 centers offer free screenings.</Text>
                </View>
                 <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}><Text style={styles.bold}>Through DEC:</Text> Contact Support for Families via DEC for free screenings.</Text>
                </View>

                <Text style={styles.subHeader}>What if Concerns Arise?</Text>
                <Text style={styles.paragraph}>
                    If a screening indicates concerns, evaluations and services are available. You can be connected through your doctor or care provider, or reach out directly (no referral needed).
                </Text>
                 <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}><Text style={styles.bold}>Under Age 3:</Text> Contact Golden Gate Regional Center.</Text>
                </View>
                 <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}><Text style={styles.bold}>Age 3+:</Text> Contact SF Unified School District or Golden Gate Regional Center.</Text>
                </View>
                <Text style={styles.paragraph}>
                    Support for Families can assist with the evaluation and eligibility process.
                </Text>

                 <Text style={styles.subHeader}>Developmental Milestones (Examples)</Text>
                 <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}><Text style={styles.bold}>3 Months:</Text> Lifts head, reaches for toys, coos.</Text></View>
                 <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}><Text style={styles.bold}>6 Months:</Text> Sits without support, babbles.</Text></View>
                 <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}><Text style={styles.bold}>18 Months:</Text> Says single words, walks alone.</Text></View>
                 <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}><Text style={styles.bold}>2 Years:</Text> Says short sentences, kicks a ball.</Text></View>
                 <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}><Text style={styles.bold}>3 Years:</Text> Climbs well, plays make-believe.</Text></View>
                 <Text style={styles.paragraph}>Visit cdc.gov/ActEarly for full checklists.</Text>

                <Text style={styles.subHeader}>Get Sparkler</Text>
                <Text style={styles.paragraph}>
                    Sparkler is a free mobile app (iOS/Android) for SF families with children 0-5. Use code SF to check development, find activities, and connect with educators. Available in English, Spanish, and Chinese.
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

// Re-use styles from index.tsx or define similar ones
const getStyles = (colorScheme: 'light' | 'dark' | null | undefined) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    },
    subHeader: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
        color: colorScheme === 'dark' ? '#EFEFEF' : '#111111',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 15,
        color: colorScheme === 'dark' ? '#CCCCCC' : '#333333',
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingLeft: 5, // Indent list items slightly
    },
    bullet: {
        fontSize: 16,
        marginRight: 8,
        color: colorScheme === 'dark' ? '#CCCCCC' : '#333333',
        lineHeight: 24,
    },
    listText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: colorScheme === 'dark' ? '#CCCCCC' : '#333333',
    },
    bold: {
        fontWeight: 'bold',
    },
});
