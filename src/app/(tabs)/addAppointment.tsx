import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import TextBox from '@/components/textBox';
import Button from '@/components/button';
import { useState, useEffect, useCallback, useMemo } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, appointment } from 'types';
import WarningModal from '@/components/warningModal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFocusEffect, useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { format24to12 } from '@/components/functions/timeUtils';
import { Calendar } from '@marceloterreiro/flash-calendar';

export default function AddAppointment() {
    const router = useRouter();
    const [doctorName, setDoctorName] = useState("");
    const [selectedDate, setSelectedDate] = useState<number>(Date.now());
    const [time, setTime] = useState("");
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [profileArray, setProfileArray] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchProfiles = async () => {
                try {
                    const storedProfiles = await AsyncStorage.getItem('profileArray');
                    if (storedProfiles && storedProfiles.length > 0) {
                        console.log("Profiles fetched successfully [index.tsx]");
                        setProfileArray(JSON.parse(storedProfiles));
                    } else {
                        router.replace('/createProfile');
                    }
                } catch (e) {
                    console.error("Failed to fetch profiles [index.tsx]", e);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProfiles();
        }, []));

    const selectedProfile = useMemo(() => {
        return profileArray.find((profile: Profile) => profile.isSelected);
    }, [profileArray]);

    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, { duration: 50 })
        };
    });


    useEffect(() => {
        if (warningModalVisible || showTimePicker) {
            opacity.value = withTiming(0.25);
        } else {
            opacity.value = withTiming(1);
        }
    }, [warningModalVisible, showTimePicker]);

    const saveAppointmentToProfile = async (newAppointment: appointment) => {
        try {
            const profileArray = JSON.parse(await AsyncStorage.getItem("profileArray") ?? "[]");
            if (profileArray.length > 0) {
                const currentProfile = profileArray.find((profile: Profile) => profile.isSelected);
                if (currentProfile) {
                    if (!currentProfile.appointments) {
                        currentProfile.appointments = [];
                    }
                    currentProfile.appointments.push(newAppointment);
                    await AsyncStorage.setItem("profileArray", JSON.stringify(profileArray));
                    console.log("New Appointment Added");
                }
            }
        } catch (error) {
            console.error("Error saving appointment:", error);
        }
    }

    const handleConfirmTime = (date: Date) => {
        setShowTimePicker(false);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time24 = `${hours}:${minutes}`;
        setTime(time24);
    };

    const saveAppointment = async () => {
        if (doctorName === "" || time === "" || !selectedDate) {
            setWarningText("Please fill in all fields");
            setWarningModalVisible(true);
            return;
        }

        const newAppointment: appointment = {
            id: Crypto.randomUUID(),
            doctorName: doctorName,
            date: selectedDate,
            time: time,
        };

        await saveAppointmentToProfile(newAppointment);

        // Reset form
        setDoctorName("");
        setTime("");
        setSelectedDate(Date.now());

        router.replace("/");
    };

    const handleCancel = () => {
        router.replace("/");
    };

    const dateString = new Date(selectedDate).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#FF69B4" />
                <Text className="text-pink-500 font-Milliard-Medium text-lg opacity-50 mt-6">Loading...</Text>
            </View>
        );
    }

    return (
        <Animated.View className="flex-1 items-center justify-center bg-white" style={animatedStyle}>
            <View className="w-5/6 items-center justify-center">
                <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-5">Add Appointment</Text>

                <View className="flex flex-col gap-3 w-full">
                    <View className="flex flex-col">
                        <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Doctor's Name</Text>
                        <TextBox
                            width="w-full"
                            placeholder="Doctor's Name"
                            onChangeText={setDoctorName}
                            value={doctorName}
                        />
                    </View>

                    <View className="flex flex-col mt-3">
                        <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Select Date</Text>
                        <View className="border border-pink-500 rounded-3xl p-2 mb-2 bg-pink-50">
                            <Text className="text-pink-600 text-center font-Milliard-ExtraBold py-2">{dateString}</Text>
                            <Calendar
                                calendarMonthId={new Date(selectedDate).toISOString().split('T')[0].substring(0, 7) + '-01'}
                                onCalendarDayPress={(dateId) => {
                                    setSelectedDate(new Date(dateId).getTime());
                                }}
                                calendarActiveDateRanges={[
                                    {
                                        startId: new Date(selectedDate).toISOString().split('T')[0],
                                        endId: new Date(selectedDate).toISOString().split('T')[0],
                                    }
                                ].concat(selectedProfile?.appointments.map((appointment: appointment) => ({
                                    startId: new Date(appointment.date).toISOString().split('T')[0],
                                    endId: new Date(appointment.date).toISOString().split('T')[0]
                                })) || [])}
                            />
                        </View>
                    </View>

                    <View className="flex flex-col mt-3">
                        <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Time</Text>
                        <TouchableOpacity
                            onPress={() => setShowTimePicker(true)}
                            className="w-full border border-pink-500 rounded-3xl p-4 bg-pink-100 items-center"
                        >
                            <Text className="text-pink-500 text-2xl font-Milliard-ExtraBold">
                                {time ? format24to12(time) : "Select Time"}
                            </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={showTimePicker}
                            mode="time"
                            display="spinner"
                            minuteInterval={5}
                            onConfirm={handleConfirmTime}
                            onCancel={() => setShowTimePicker(false)}
                        />
                    </View>

                    <View className="flex flex-row justify-between mt-10 mb-10">
                        <Button placeholder="Cancel" onPress={handleCancel} width="w-[48%]" />
                        <Button placeholder="Save" onPress={saveAppointment} width="w-[48%]" />
                    </View>
                </View>

                <WarningModal
                    header="Warning"
                    isOpen={warningModalVisible}
                    onClose={() => setWarningModalVisible(false)}
                    text={warningText}
                />
            </View>
        </Animated.View>
    );
}
