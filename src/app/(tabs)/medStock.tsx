import { View, Text, ScrollView, Pressable } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Button from '@/components/button';
import { medicine, day, Profile } from 'types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import clsx from 'clsx';
import { format24to12 } from '@/components/functions/timeUtils';

const MedicineItem = ({
    med,
    onDelete,
    days
}: {
    med: medicine;
    onDelete: () => void;
    days: day[];
}) => (
    <View className={`border border-gray-200 rounded-2xl p-4 ${med.color}`}>
        <Text className="text-2xl font-Milliard-Heavy text-gray-700">
            {med.name}
        </Text>
        <View className="flex flex-row w-full gap-2 mb-2 items-center">
            <Text className="text-xl font-Milliard-Medium text-gray-700">
                Quantity:
            </Text>
            <View className="rounded-full bg-gray-100 border border-gray-300 px-3 py-1 ">
                <Text className="text-sm text-gray-700 font-Milliard-Heavy">
                    {med.amountRemaining} / {med.amountBought}
                </Text>
            </View>
        </View>
        <View className="flex flex-row gap-2 mb-2 items-center">
            <Text className="text-xl font-Milliard-Medium text-gray-700">
                Times:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
                <View className="flex flex-row gap-2">
                    {med.times.map((time, index) => (
                        <View key={index} className="rounded-full bg-gray-100 border border-gray-300 px-3 py-1">
                            <Text className="text-gray-700 text-sm font-Milliard-Heavy">{format24to12(time)}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
        <View className="mb-4 flex flex-row gap-3">
            <Text className="text-xl font-Milliard-Medium text-gray-700">
                Days:
            </Text>
            <View className="flex flex-row gap-1">
                {days.map((day, index) => (
                    <View key={index} className="justify-center items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1">
                        <Text className="text-gray-700 text-sm font-Milliard-ExtraBold">{day}</Text>
                    </View>
                ))}
            </View>
        </View>

        <Pressable
            onPress={onDelete}
            className="rounded-full py-2 px-4  active:bg-slate-300 bg-red-400"
        >
            <Text className="font-Milliard-Medium text-center text-white">
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
        <>
            <View className="px-6 pt-16 pb-5 bg-white items-center justify-center">
                <Text className="text-3xl font-Milliard-ExtraBold text-pink-500">
                    Medicine Stock
                </Text>
            </View>
            <View className="flex-1 bg-gray-150 justify-between">


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
            </View>
            <View className="px-6 pt-4 pb-6 bg-white">
                <View className="flex flex-row justify-between">
                    <Button placeholder="Add Medicine" width="w-[49%]" onPress={() => router.push('/inputMedicine')} />
                    <Button placeholder="Scan Medicine" width="w-[49%]" onPress={() => router.push('/prescriptionPic')} />
                </View>
                <Button placeholder="Done" width="w-full mt-2" onPress={() => router.push('/')} />
            </View>
        </>
    );
}
