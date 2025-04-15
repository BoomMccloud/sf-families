import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHILDREN_COUNT_KEY = '@childrenCount';
const MIN_STEPPER_DISPLAY_VALUE = 5; // The value stepper starts at / decrements to

export default function ChildrenScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    const [selectedCount, setSelectedCount] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSelectOption = (count: number) => {
        setSelectedCount(count);
    };

    const handleIncrement = () => {
        setSelectedCount((prevCount) => {
            if (prevCount === null || prevCount < MIN_STEPPER_DISPLAY_VALUE) {
                return MIN_STEPPER_DISPLAY_VALUE; // Jump to 5 if below or null
            }
            return prevCount + 1; // Increment if 5 or more
        });
    };

    const handleDecrement = () => {
        setSelectedCount((prevCount) => {
            if (prevCount && prevCount > MIN_STEPPER_DISPLAY_VALUE) {
                return prevCount - 1;
            }
            return prevCount; // Keep current value (which might be 5, or 1-4)
        });
    };

    const handleContinue = async () => {
        const finalCount = selectedCount !== null && selectedCount >= 1 ? selectedCount : null;

        if (finalCount === null) {
             Alert.alert(t('childrenScreen.errorTitle'), t('childrenScreen.errorMessage'));
            return;
        }

        setIsProcessing(true);
        try {
            await AsyncStorage.setItem(CHILDREN_COUNT_KEY, finalCount.toString());
            console.log('Children count saved:', finalCount);
            router.push('/(tabs)');
        } catch (e) {
            console.error('Failed to save children count:', e);
            Alert.alert(t('common.error'), t('childrenScreen.saveError'));
            setIsProcessing(false);
        }
    };

    const isContinueDisabled = selectedCount === null || selectedCount < 1 || isProcessing;
    const isStepperSelected = selectedCount !== null && selectedCount >= MIN_STEPPER_DISPLAY_VALUE;
    const stepperDisplayValue = isStepperSelected ? selectedCount : MIN_STEPPER_DISPLAY_VALUE;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('childrenScreen.title')}</Text>

            <View style={styles.optionsContainer}>
                {[1, 2, 3, 4].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={[
                            styles.optionButton,
                            selectedCount === num && styles.selectedOptionButton,
                        ]}
                        onPress={() => handleSelectOption(num)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedCount === num && styles.selectedOptionText,
                            ]}
                        >
                            {num}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.orText}>{t('childrenScreen.or')}</Text>

            <View style={styles.stepperContainer}>
                <View style={[styles.stepperActiveView, isStepperSelected && styles.selectedStepperView]}>
                    <TouchableOpacity
                        onPress={handleDecrement}
                        disabled={selectedCount === null || selectedCount <= MIN_STEPPER_DISPLAY_VALUE}
                        style={[styles.stepperButton, (selectedCount === null || selectedCount <= MIN_STEPPER_DISPLAY_VALUE) && styles.disabledStepperButton]}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.stepperButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.stepperValueText}>{stepperDisplayValue}</Text>

                    <TouchableOpacity
                        onPress={handleIncrement}
                        style={styles.stepperButton}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.stepperButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.continueButton, isContinueDisabled && styles.disabledButton]}
                onPress={handleContinue}
                disabled={isContinueDisabled}
                activeOpacity={0.8}
            >
                 {isProcessing ? (
                     <ActivityIndicator size="small" color="#FFFFFF" />
                 ) : (
                    <Text style={styles.continueButtonText}>{t('childrenScreen.continue')}</Text>
                 )}
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (colorScheme: 'light' | 'dark' | null | undefined) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 25,
        backgroundColor: colorScheme === 'dark' ? '#121212' : '#F8F8F8',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        color: colorScheme === 'dark' ? '#FFFFFF' : '#1C1C1E',
        textAlign: 'center',
        marginBottom: 40,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 25,
    },
    optionButton: {
        borderWidth: 1.5,
        borderColor: colorScheme === 'dark' ? '#555555' : '#CCCCCC',
        borderRadius: 35,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: colorScheme === 'light' ? 0.1 : 0,
        shadowRadius: 2,
        elevation: colorScheme === 'light' ? 2 : 0,
    },
    selectedOptionButton: {
        borderColor: '#0A84FF',
        backgroundColor: colorScheme === 'dark' ? 'rgba(10, 132, 255, 0.3)' : 'rgba(10, 132, 255, 0.15)',
        borderWidth: 2,
    },
    optionText: {
        fontSize: 24,
        fontWeight: '500',
        color: colorScheme === 'dark' ? '#E5E5EA' : '#1C1C1E',
    },
    selectedOptionText: {
        fontWeight: '700',
        color: colorScheme === 'dark' ? '#FFFFFF' : '#0A84FF',
    },
    orText: {
        fontSize: 16,
        color: colorScheme === 'dark' ? '#AAAAAA' : '#555555',
        marginVertical: 20,
        fontWeight: '500',
    },
    stepperContainer: {
        width: '80%',
        alignItems: 'center',
        marginBottom: 30,
        minHeight: 60,
        justifyContent: 'center',
    },
    stepperActiveView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderWidth: 1.5,
        borderColor: colorScheme === 'dark' ? '#555555' : '#CCCCCC',
        width: '100%',
        minHeight: 56,
    },
    selectedStepperView: {
        borderColor: '#0A84FF',
        backgroundColor: colorScheme === 'dark' ? 'rgba(10, 132, 255, 0.3)' : 'rgba(10, 132, 255, 0.15)',
        borderWidth: 2,
    },
    stepperButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: colorScheme === 'dark' ? '#3A3A3C' : '#E5E5EA',
    },
    disabledStepperButton: {
        backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F0F0F0',
        opacity: 0.6,
    },
    stepperButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    },
    stepperValueText: {
        fontSize: 22,
        fontWeight: '600',
        color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        marginHorizontal: 25,
    },
    continueButton: {
        marginTop: 'auto',
        backgroundColor: '#0A84FF',
        paddingVertical: 16,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 54,
    },
    disabledButton: {
        backgroundColor: colorScheme === 'dark' ? '#3A3A3C' : '#E5E5EA',
        opacity: 0.7,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});
