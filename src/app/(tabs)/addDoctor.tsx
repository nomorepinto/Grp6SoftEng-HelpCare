import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Button from '@/components/button';
import TextBox from '@/components/textBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { doctor, day } from 'types';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import WarningModal from '@/components/warningModal';

const DAYS: day[] = ["M", "T", "W", "Th", "F", "S", "Su"];

const colorArray = [
    "bg-red-100",
    "bg-amber-100",
    "bg-lime-100",
    "bg-emerald-100",
    "bg-cyan-100",
    "bg-blue-100",
    "bg-violet-100",
    "bg-fuchsia-100"
];

export default function AddDoctor() {
    const router = useRouter();
    const [doctorName, setDoctorName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [secretary, setSecretary] = useState('');
    const [selectedDays, setSelectedDays] = useState<day[]>([]);
    const [colorIndex, setColorIndex] = useState(0);
    const [warningModalVisible, setWarningModalVisible] = useState(false);

    const selectColor = () => {
        const color = colorArray[colorIndex];
        setColorIndex((prevIndex) => (prevIndex + 1) % colorArray.length);
        return color;
    }

    const toggleDay = (day: day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const addDoctor = async () => {
        if (doctorName === '' || specialty === '' || secretary === '' || selectedDays.length === 0) {
            setWarningModalVisible(true);
            return;
        }

        try {
            const doctorsString = await AsyncStorage.getItem('doctors');
            const doctors: doctor[] = doctorsString ? JSON.parse(doctorsString) : [];

            const newDoctor: doctor = {
                id: Date.now().toString(),
                name: doctorName,
                specialization: specialty,
                secretary,
                color: selectColor(),
                daysAvailable: selectedDays,
            };

            await AsyncStorage.setItem('doctors', JSON.stringify([...doctors, newDoctor]));
            router.back();
        } catch (error) {
            console.error(error);
        }
    };

    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, { duration: 50 })
        };
    });

    useEffect(() => {
        if (warningModalVisible) {
            opacity.value = withTiming(0.25);
        } else {
            opacity.value = withTiming(1);
        }
    }, [warningModalVisible]);

    return (
        <Animated.View className="flex-1 bg-white" style={animatedStyle}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View className="flex-1 justify-center items-center w-5/6 mx-auto py-20">
                    <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-8 text-center">
                        Add Doctor
                    </Text>

                    <View className="w-full gap-4">
                        <View className="flex flex-col">
                            <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Doctor's Name</Text>
                            <TextBox
                                placeholder="Doctor Name"
                                value={doctorName}
                                onChangeText={setDoctorName}
                                width="w-full"
                            />
                        </View>
                        <View className="flex flex-col">
                            <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Specialty</Text>
                            <TextBox
                                placeholder="Specialty"
                                value={specialty}
                                onChangeText={setSpecialty}
                                width="w-full"
                            />
                        </View>
                        <View className="flex flex-col">
                            <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Secretary</Text>
                            <TextBox
                                placeholder="Secretary"
                                value={secretary}
                                onChangeText={setSecretary}
                                width="w-full"
                            />
                        </View>
                    </View>

                    <View className="w-full mt-6">
                        <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Days Available</Text>
                        <View className="flex flex-row justify-between w-full">
                            {DAYS.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    onPress={() => toggleDay(day)}
                                    className={`px-3 py-2 rounded-xl border border-pink-600 ${selectedDays.includes(day)
                                        ? 'bg-pink-500'
                                        : 'bg-pink-100'
                                        }`}
                                >
                                    <Text className={`font-Milliard-Medium ${selectedDays.includes(day)
                                        ? 'text-white'
                                        : 'text-pink-500'
                                        }`}>
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="flex flex-row w-full justify-center gap-2 mt-12 mb-10">
                        <Button
                            placeholder="Cancel"
                            onPress={() => router.back()}
                            width="w-[48%]"
                        />
                        <Button
                            placeholder="Confirm"
                            onPress={addDoctor}
                            width="w-[48%]"
                        />
                    </View>
                </View>
            </ScrollView>
            <WarningModal
                isOpen={warningModalVisible}
                onClose={() => setWarningModalVisible(false)}
                header="Warning"
                text="Please fill in all fields"
            />
        </Animated.View>
    );
}
