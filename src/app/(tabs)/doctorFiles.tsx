import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ProgressBar } from '@/components/progressBar';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Button from '@/components/button';
import { medicine, day, Profile, doctor } from 'types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import clsx from 'clsx';
import { format24to12 } from '@/components/functions/timeUtils';
import MedEditModal from "@/components/medEditModal";
import DoctorEditModal from "@/components/doctorEditModal";


function DoctorBullet({
    doctor,
    onDelete,
    onEdit
}: {
    doctor: doctor;
    onDelete: () => void;
    onEdit: () => void;
}) {


    return (
        <View className={`flex flex-col w-full ${doctor.color || 'bg-white'} rounded-3xl px-5 py-4`}>
            <View className="flex flex-row justify-between items-center w-full">
                <Text className="text-gray-700 font-Milliard-Heavy text-2xl">{doctor.name}</Text>
                <View className="bg-gray-100/75 px-3 py-1 border border-gray-300 rounded-full">
                    <Text className="text-gray-700 font-Milliard-Medium text-sm">
                        Available
                    </Text>
                </View>
            </View>

            <View className="flex flex-col items-center mt-2 gap-2">
                <Text className="w-full text-gray-700 font-Milliard-Medium bg-white/70 px-5 py-1 rounded-full text-sm">
                    {doctor.specialization}
                </Text>
                <Text className="w-full text-gray-700 font-Milliard-Medium bg-white/70 px-5 py-1 rounded-full text-sm">
                    Secretary: {doctor.secretary}
                </Text>
            </View>

            <View className="flex flex-col mt-3 gap-1">
                <Text className="text-gray-700 font-Milliard-Medium text-sm ml-2">Days Available:</Text>
                <View className="flex flex-row flex-wrap gap-1">
                    {doctor.daysAvailable.map((day, index) => (
                        <View key={index} className="justify-center items-center bg-gray-100/75 border border-gray-300 rounded-full px-3 py-1">
                            <Text className="text-gray-700 text-xs font-Milliard-ExtraBold">{day}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View className="flex flex-row justify-between mt-4">
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

export default function DoctorFiles() {

    useFocusEffect(
        useCallback(() => {
            getDoctors();
        }, [])
    );

    const getDoctors = async () => {
        try {
            const doctorsString = await AsyncStorage.getItem("doctors");
            const doctorsArray: doctor[] = JSON.parse(doctorsString ?? "[]");
            setDoctors(doctorsArray);
            console.log("Doctors Array Loaded");
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    }

    const saveDoctors = async (updatedDoctors: doctor[]) => {
        setDoctors(updatedDoctors);
        try {
            await AsyncStorage.setItem("doctors", JSON.stringify(updatedDoctors));
            console.log("Doctors Saved");
        } catch (error) {
            console.error("Error saving doctors:", error);
        }
    };

    const deleteDoctor = async (index: number) => {
        const updatedDoctors = doctors.filter((_, i) => i !== index);
        saveDoctors(updatedDoctors);
    };

    const router = useRouter();
    const [doctors, setDoctors] = useState<doctor[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<doctor | null>(null);

    const updateDoctorInList = async (updatedDoc: doctor) => {
        const updatedDoctors = doctors.map((doc) =>
            doc.id === updatedDoc.id ? updatedDoc : doc
        );
        saveDoctors(updatedDoctors);
    };

    const handleEdit = (doctor: doctor) => {
        setSelectedDoctor(doctor);
        setIsEditModalOpen(true);
    };

    const opacity = useSharedValue(0);

    useEffect(() => {
        if (isEditModalOpen) {
            opacity.value = withTiming(0.25);
        } else {
            opacity.value = withTiming(1);
        }
    }, [isEditModalOpen]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, { duration: 50 })
        };
    });

    return (
        <Animated.View className="flex-1" style={animatedStyle}>
            <View className="px-6 pt-16 pb-5 bg-white items-center justify-center">
                <Text className="text-3xl font-Milliard-ExtraBold text-pink-500">
                    Doctors
                </Text>
            </View>
            <View className="flex-1 bg-gray-150 justify-between">
                <ScrollView className="flex-1 px-6 py-4">
                    {doctors.length === 0 ? (
                        <View className="flex w-full items-center justify-center mt-60">
                            <Text className="text-3xl font-Milliard-ExtraBold text-pink-500 opacity-50">No doctors added yet</Text>
                        </View>
                    ) : (
                        <View className="gap-4">
                            {doctors.map((doc, index) => (
                                <DoctorBullet
                                    key={doc.id}
                                    doctor={doc}
                                    onDelete={() => deleteDoctor(index)}
                                    onEdit={() => handleEdit(doc)}
                                />
                            ))}
                        </View>
                    )}
                </ScrollView>
            </View>
            <View className="px-6 pt-4 pb-6 bg-white">
                <Button placeholder="Add Doctor" width="w-full" onPress={() => router.push('/addDoctor')} />
                <Button placeholder="Done" width="w-full mt-2" onPress={() => router.push('/')} />
            </View>
            <DoctorEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                doctor={selectedDoctor ?? undefined}
                onUpdate={updateDoctorInList}
            />
        </Animated.View>
    );
}
