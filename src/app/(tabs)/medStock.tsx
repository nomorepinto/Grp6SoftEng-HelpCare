import { View, Text, ScrollView, Pressable } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Button from '@/components/button';
import { medicine, day, Profile } from 'types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const MedicineItem = ({
    med,
    onDelete,
    days
}: {
    med: medicine;
    onDelete: () => void;
    days: day[];
}) => (
    <View className="border border-pink-300 rounded-2xl p-4 bg-pink-50">
        <Text className="text-xl font-Milliard-Heavy text-pink-500 mb-3">
            {med.name}
        </Text>
        <View className="flex flex-row w-full gap-2 mb-2">
            <View className="w-1/4">
                <Text className="text-lg font-Milliard-Medium text-pink-500">
                    Quantity
                </Text>
                <Text className="text-base text-gray-700">
                    {med.quantity} pills
                </Text>
            </View>

            <View className="w-3/4">
                <Text className="text-lg font-Milliard-Medium text-pink-500">
                    Times
                </Text>
                <Text className="text-base text-gray-700">
                    {med.times.join(', ')}
                </Text>
            </View>
        </View>


        <View className="mb-4">
            <Text className="text-lg font-Milliard-Medium text-pink-500">
                Days
            </Text>
            <View className="flex flex-row gap-2">
                {days.map((day, index) => (
                    <View key={index} className="justify-center items-center bg-pink-100 border border-pink-500 rounded-3xl px-3 py-1">
                        <Text className="text-pink-500 text-sm font-Milliard-ExtraBold">{day}</Text>
                    </View>
                ))}
            </View>
        </View>

        <Pressable
            onPress={onDelete}
            className="bg-red-100 rounded-lg py-2 px-4"
        >
            <Text className="text-red-600 font-Milliard-Medium text-center">
                Delete
            </Text>
        </Pressable>
    </View>
);

export default function MedStock() {
    const router = useRouter();

    const getMedicines = async () => {
        const profileArray = JSON.parse(await AsyncStorage.getItem("profileArray") ?? "[]");
        try {
            if (profileArray.length > 0) {
                const currentProfile = profileArray.find((profile: Profile) => profile.isSelected);
                if (currentProfile) {
                    setMedicines(currentProfile.medicineSchedule);
                    console.log("Medicine Array Loaded")
                }
            }
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    }

    const [medicines, setMedicines] = useState<medicine[]>([]);

    useFocusEffect(
        useCallback(() => {
            getMedicines();
        }, [])
    );

    const deleteMedicine = async (index: number) => {

        const updatedMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(updatedMedicines);
        const profileArray = JSON.parse(await AsyncStorage.getItem("profileArray") ?? "[]");
        try {
            if (profileArray.length > 0) {
                const currentProfile = profileArray.find((profile: Profile) => profile.isSelected);
                if (currentProfile) {
                    currentProfile.medicineSchedule = updatedMedicines;
                    await AsyncStorage.setItem("profileArray", JSON.stringify(profileArray));
                    console.log("Medicine Deleted")
                }
            }
        } catch (error) {
            console.error("Error deleting medicine:", error);
        }
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
                            <MedicineItem
                                key={index}
                                med={med}
                                onDelete={() => deleteMedicine(index)}
                                days={med.days}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <View className="px-6 py-4 border-t border-pink-200">
                <Button placeholder="Add Medicine" width="w-full" onPress={() => router.push('/inputMedicine')} />
                <Button placeholder="Done" width="w-full mt-2" onPress={() => router.push('/')} />
            </View>
        </View>
    );
}
