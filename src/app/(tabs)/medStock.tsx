import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ProgressBar } from '@/components/progressBar';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Button from '@/components/button';
import { medicine, day, Profile } from 'types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import clsx from 'clsx';
import { format24to12 } from '@/components/functions/timeUtils';
import MedEditModal from "@/components/medEditModal";

function MedicineItem({
    med,
    onDelete,
    days,
    onEdit
}: {
    med: medicine;
    onDelete: () => void;
    days: day[];
    onEdit: () => void;
}) {
    const [totalQuantity, setTotalQuantity] = useState(med.totalQuantity);
    const [amountTaken, setAmountTaken] = useState(med.amountTaken);

    useFocusEffect(
        useCallback(() => {
            setTotalQuantity(med.totalQuantity);
            setAmountTaken(med.amountTaken);
        }, [med])
    );

    return (
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
                        {med.amountRemaining} / {med.totalQuantity}
                    </Text>
                </View>
            </View>
            <View className="flex flex-row gap-2 mb-2 items-center">
                <Text className="text-xl font-Milliard-Medium text-gray-700">
                    Times:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
                    <View className="flex flex-row gap-2">
                        {med.times.map((medTime, index) => (
                            <View key={index} className="rounded-full bg-gray-100 border border-gray-300 px-3 py-1">
                                <Text className="text-gray-700 text-sm font-Milliard-Heavy">{format24to12(medTime.time)}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <View className="mb-2 flex flex-row gap-3">
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
            <View className="mb-4 flex flex-row gap-3 items-center">
                <Text className="text-xl font-Milliard-Medium text-gray-700">
                    Amount Taken:
                </Text>
                <ProgressBar current={amountTaken} total={totalQuantity} />
            </View>
            <View className="flex flex-row justify-between">
                <Pressable
                    onPress={onDelete}
                    className="rounded-full py-2 px-4 w-[48%] active:bg-slate-300 bg-red-400"
                >
                    <Text className="font-Milliard-Medium text-center text-white">
                        Delete
                    </Text>
                </Pressable>
                <Pressable
                    onPress={onEdit}
                    className="rounded-full py-2 px-4 w-[48%] active:bg-slate-300 bg-gray-400"
                >
                    <Text className="font-Milliard-Medium text-center text-white">
                        Edit
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function MedStock() {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<medicine | null>(null);
    const [medicines, setMedicines] = useState<medicine[]>([]);

    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, { duration: 50 })
        };
    });

    useEffect(() => {
        if (isEditModalOpen) {
            opacity.value = withTiming(0.25);
        } else {
            opacity.value = withTiming(1);
        }
    }, [isEditModalOpen]);

    const handleEdit = (med: medicine) => {
        setSelectedMedicine(med);
        setIsEditModalOpen(true);
    };

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


    useFocusEffect(
        useCallback(() => {
            getMedicines();
        }, [])
    );

    const updateMedicineInList = async (updatedMed: medicine) => {
        const updatedMedicines = medicines.map((med) =>
            med.id === updatedMed.id ? updatedMed : med
        );
        saveMedicines(updatedMedicines);
    };

    const saveMedicines = async (updatedMedicines: medicine[]) => {
        setMedicines(updatedMedicines);
        const profileArrayRaw = await AsyncStorage.getItem("profileArray");
        const profileArray = JSON.parse(profileArrayRaw ?? "[]");
        try {
            if (profileArray.length > 0) {
                const currentProfile = profileArray.find((profile: Profile) => profile.isSelected);
                if (currentProfile) {
                    currentProfile.medicineSchedule = updatedMedicines;
                    await AsyncStorage.setItem("profileArray", JSON.stringify(profileArray));
                    console.log("Medicines Saved");
                }
            }
        } catch (error) {
            console.error("Error saving medicines:", error);
        }
    };

    const deleteMedicine = async (index: number) => {
        const updatedMedicines = medicines.filter((_, i) => i !== index);
        saveMedicines(updatedMedicines);
    };

    return (
        <Animated.View className="flex-1" style={animatedStyle}>
            <View className="px-6 pt-16 pb-5 bg-white items-center justify-center">
                <Text className="text-3xl font-Milliard-ExtraBold text-pink-500">
                    Medicine Stock
                </Text>
            </View>
            <View className="flex-1 bg-gray-150 justify-between">


                <ScrollView className="flex-1 px-6 py-4">
                    {medicines.length === 0 ? (
                        <View className="flex w-full items-center justify-center mt-60">
                            <Text className="text-3xl font-Milliard-ExtraBold text-pink-500 opacity-50">No medicines added yet</Text>
                        </View>
                    ) : (
                        <View className="gap-4">
                            {medicines.map((med, index) => (
                                <MedicineItem
                                    key={index}
                                    med={med}
                                    onDelete={() => deleteMedicine(index)}
                                    days={med.days}
                                    onEdit={() => handleEdit(med)}
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
            <MedEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                medicine={selectedMedicine ?? undefined}
                onUpdate={updateMedicineInList}
            />
        </Animated.View>
    );
}
