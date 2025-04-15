import React from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    // Simple placeholder content based on the structure of sfdec.org/about/
    // Could be expanded with more specific sections like Leadership, Strategic Plan etc.
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>About SF DEC</Text>

                <Text style={styles.paragraph}>
                    The San Francisco Department of Early Childhood (DEC) is dedicated to ensuring that all children in San Francisco have access to high-quality early care and education.
                </Text>
                <Text style={styles.paragraph}>
                    Our mission is to support the healthy development and school readiness of young children through comprehensive services, community partnerships, and policy advocacy.
                </Text>

                <Text style={styles.subHeader}>Our Work</Text>
                <Text style={styles.paragraph}>
                    We focus on initiatives like Early Learning For All, supporting Family Resource Centers, promoting Child Development resources, and ensuring fair Workforce Compensation for educators.
                </Text>
                 <Text style={styles.paragraph}>
                    Through strategic planning and collaboration, we aim to create a robust early childhood system that benefits children, families, and the entire community.
                </Text>

                {/* Placeholder for other sections like Leadership, Plan, etc. */}

            </ScrollView>
        </SafeAreaView>
    );
}

// Re-use styles or define similar ones
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
});
