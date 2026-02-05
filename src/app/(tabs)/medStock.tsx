import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Button from '@/components/button';
import { medicine, day } from 'types'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

//might need to base on actual database later
const dayLabels: Record<day, string> = {
    'M': 'Monday',
    'T': 'Tuesday',
    'W': 'Wednesday',
    'Th': 'Thursday',
    'F': 'Friday',
    'S': 'Saturday',
    'Su': 'Sunday',
};

export default function MedStock() {
    const router = useRouter();

/*  const saveMedicine = async (medicine: medicine) => {
        const medicines = JSON.parse(await AsyncStorage.getItem('medicines') || '[]');
        medicines.push(medicine);
        await AsyncStorage.setItem('medicines', JSON.stringify(medicines));
    };*/

    // Sample medicine data - to be replaced
    const [medicines, setMedicines] = useState<medicine[]>([
        {
            name: 'Aspirin',
            quantity: 30,
            times: ['08:00 AM', '08:00 PM'],
            days: ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'],
        },
        {
            name: 'Vitamin D',
            quantity: 60,
            times: ['09:00 AM'],
            days: ['M', 'W', 'F'],
        },
    ]);

    const deleteMedicine = (index: number) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const formatDays = (days: day[]) => {
        return days.map(d => dayLabels[d]).join(', ');
    };

    return (
        <View className="flex-1 bg-white pt-10 justify-between">
            <View className="px-6 py-6 border-b border-pink-200">
                <Text className="text-2xl font-Milliard-ExtraBold text-pink-500">
                    Medicine Stock
                </Text>
            </View>

            <ScrollView className="flex-1 px-6 py-4">
                {medicines.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-12">
                        <Text className="text-gray-400 text-base">
                            No medicines added yet
                        </Text>
                    </View>
                ) : (
                    <View className="gap-4">
                        {medicines.map((med, index) => (
                            <View
                                key={index}
                                className="border border-pink-300 rounded-2xl p-4 bg-pink-50"
                            >
                                <Text className="text-lg font-Milliard-Medium text-pink-500 mb-3">
                                    {med.name}
                                </Text>

                                <View className="mb-3">
                                    <Text className="text-sm font-Milliard-Medium text-gray-600">
                                        Quantity
                                    </Text>
                                    <Text className="text-base text-gray-800">
                                        {med.quantity} pills
                                    </Text>
                                </View>

                                <View className="mb-3">
                                    <Text className="text-sm font-Milliard-Medium text-gray-600">
                                        Times
                                    </Text>
                                    <Text className="text-base text-gray-800">
                                        {med.times.join(', ')}
                                    </Text>
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-Milliard-Medium text-gray-600">
                                        Days
                                    </Text>
                                    <Text className="text-base text-gray-800">
                                        {formatDays(med.days)}
                                    </Text>
                                </View>

                                <Pressable
                                    onPress={() => deleteMedicine(index)}
                                    className="bg-red-100 rounded-lg py-2 px-4"
                                >
                                    <Text className="text-red-600 font-Milliard-Medium text-center">
                                        Delete
                                    </Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <View className="px-6 py-4 border-t border-pink-200">
                <Button placeholder="Add Medicine" width="w-full" onPress={() => router.push('/inputMedicine')} />
            </View>
        </View>
    );
}
