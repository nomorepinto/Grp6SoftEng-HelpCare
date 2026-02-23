import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import TextBox from '@/components/textBox';
import Button from '@/components/button';
import { useState, useEffect, useCallback, useMemo } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, appointment, doctor } from 'types';
import WarningModal from '@/components/warningModal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFocusEffect, useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { format24to12 } from '@/components/functions/timeUtils';
import { Calendar } from '@marceloterreiro/flash-calendar';
import { pinkCalendarTheme } from '@/components/themes/pinkCalendarTheme';
import DoctorSelector from '@/components/doctorSelector';
import type { day } from 'types';

const DAYS: day[] = ["M", "T", "W", "Th", "F", "S", "Su"];

export default function AddAppointment() {
    const router = useRouter();
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [selectedDate, setSelectedDate] = useState<number>(Date.now());
    const [time, setTime] = useState("");
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [profileArray, setProfileArray] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [doctorSelectorVisible, setDoctorSelectorVisible] = useState(false);
    const [doctorArray, setDoctorArray] = useState<doctor[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchProfiles = async () => {
                try {
                    const storedProfiles = await AsyncStorage.getItem('profileArray');
                    if (storedProfiles && storedProfiles.length > 0) {
                        console.log("Profiles fetched successfully [addAppointment.tsx]");
                        setProfileArray(JSON.parse(storedProfiles));
                        const storedDoctors = await AsyncStorage.getItem('doctors');
                        if (storedDoctors && storedDoctors.length > 0) {
                            console.log("Doctors fetched successfully [addAppointment.tsx]");
                            setDoctorArray(JSON.parse(storedDoctors));
                        }
                    } else {
                        router.replace('/createProfile');
                    }
                } catch (e) {
                    console.error("Failed to fetch profiles [addAppointment.tsx]", e);
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
        if (selectedDoctorId === "" || time === "" || !selectedDate) {
            setWarningText("Please fill in all fields");
            setWarningModalVisible(true);
            return;
        }

        const newAppointment: appointment = {
            id: Crypto.randomUUID(),
            doctor: doctorArray.find((doctor: doctor) => doctor.id === selectedDoctorId) || doctorArray[0],
            date: selectedDate,
            time: time,
        };

        await saveAppointmentToProfile(newAppointment);

        // Reset form
        setSelectedDoctorId("");
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
        <Animated.View className="flex-1 bg-white" style={animatedStyle}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View className="w-5/6 items-center justify-center py-10">
                    <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-5">Add Appointment</Text>

                    <View className="flex flex-col gap-3 w-full">
                        <View className="flex flex-col">
                            <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Doctor</Text>
                            <TouchableOpacity
                                onPress={() => setDoctorSelectorVisible(true)}
                                className="border border-gray-500 rounded-3xl p-2 mb-2 bg-white"
                            >
                                <Text className="text-pink-500 text-center font-Milliard-ExtraBold text-2xl rounded-full p-2">
                                    {doctorArray.find((doctor: doctor) => doctor.id === selectedDoctorId)?.name || "Select Doctor"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex flex-col mt-3">
                            <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Select Date</Text>
                            <View className="border border-gray-500 rounded-3xl p-5 mb-2 bg-white h-96">
                                <Text className="text-gray-700 text-center font-Milliard-ExtraBold mb-5 text-xl rounded-full border border-gray-300 p-2">{dateString}</Text>
                                <Calendar.List
                                    calendarInitialMonthId={`${new Date(selectedDate).getFullYear()}-${String(new Date(selectedDate).getMonth() + 1).padStart(2, '0')}-01`}
                                    onCalendarDayPress={(dateId) => {
                                        if (new Date(dateId) < new Date()) {
                                            setWarningText("You cannot select a past date");
                                            setWarningModalVisible(true);
                                            return;
                                        }
                                        if (!selectedDoctorId) {
                                            setWarningText("Please select a doctor");
                                            setWarningModalVisible(true);
                                            return;
                                        }

                                        /*
                                        doesnt work
                                        if (!doctorArray.find((doctor: doctor) => doctor.id === selectedDoctorId)?.daysAvailable.includes(DAYS[new Date(dateId).getDay()])) {
                                            setWarningText("The selected doctor is not available on the selected date");
                                            setWarningModalVisible(true);
                                            return;
                                        }
                                        */
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
                                    theme={pinkCalendarTheme}

                                />
                            </View>
                        </View>

                        <View className="flex flex-col mt-3">
                            <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Time</Text>
                            <TouchableOpacity
                                onPress={() => setShowTimePicker(true)}
                                className="w-full border border-gray-500 rounded-3xl p-4 bg-white items-center"
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

                    <DoctorSelector
                        doctors={doctorArray}
                        selectDoctor={(doctor) => setSelectedDoctorId(doctor.id)}
                        isOpen={doctorSelectorVisible}
                        onClose={() => setDoctorSelectorVisible(false)}
                    />

                    <WarningModal
                        header="Warning"
                        isOpen={warningModalVisible}
                        onClose={() => setWarningModalVisible(false)}
                        text={warningText}
                    />
                </View>
            </ScrollView>
        </Animated.View>
    );
}
