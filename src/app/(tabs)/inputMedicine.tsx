import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import TextBox from '@/components/textBox';
import Button from '@/components/button';
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, medicine, day } from 'types';
import WarningModal from '@/components/warningModal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';

const DAYS: day[] = ["M", "T", "W", "Th", "F", "S", "Su"];

export default function AddMedicine() {
    const router = useRouter();
    const [medicineName, setMedicineName] = useState("");
    const [time, setTime] = useState("");
    const [times, setTimes] = useState<string[]>([]);
    const [quantity, setQuantity] = useState("");
    const [selectedDays, setSelectedDays] = useState<day[]>([]);
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [showTimePicker, setShowTimePicker] = useState(false);

    const saveMedicineToProfile = async (newMedicine: medicine) => {
        try {
            const profileArray = JSON.parse(await AsyncStorage.getItem("profileArray") ?? "[]");
            if (profileArray.length > 0) {
                const currentProfile = profileArray.find((profile: Profile) => profile.isSelected);
                if (currentProfile) {
                    currentProfile.medicineSchedule.push(newMedicine);
                    await AsyncStorage.setItem("profileArray", JSON.stringify(profileArray));
                    console.log("New Medicine Added")
                }
            }
        } catch (error) {
            console.error("Error saving medicine:", error);
        }
    }

    const toggleDay = (day: day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const addTime = () => {
        if (time === "") {
            setWarningText("Please enter a time");
            setWarningModalVisible(true);
            return;
        }
        setTimes([...times, time]);
        setTime("");
    };

    const handleConfirmTime = (date: Date) => {
        setShowTimePicker(false);
        setTimes([...times, date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })]);
    };

    const removeTime = (index: number) => {
        setTimes(times.filter((_, i) => i !== index));
    };

    const saveMedicine = async () => {
        if (medicineName === "" || times.length === 0 || selectedDays.length === 0 || quantity === "") {
            setWarningText("Please fill in all fields");
            setWarningModalVisible(true);
            return;
        }

        const parsedQuantity = Number(quantity);
        if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
            setWarningText("Please enter a valid quantity");
            setWarningModalVisible(true);
            return;
        }

        const newMedicine: medicine = {
            id: Crypto.randomUUID(),
            name: medicineName,
            quantity: parsedQuantity,
            times: times,
            days: selectedDays
        };

        // Add medicine to the current profile's schedule
        await saveMedicineToProfile(newMedicine);

        // Reset form
        setMedicineName("");
        setTimes([]);
        setQuantity("");
        setSelectedDays([]);

        router.replace("/medStock");
    };

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <View className="w-5/6 items-center justify-center">
                <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-5">Add Medicine</Text>
                <View className="flex flex-col gap-3 w-full">
                    <View className="flex flex-col">
                        <TextBox
                            width="w-full"
                            placeholder="Medicine Name"
                            onChangeText={setMedicineName}
                            value={medicineName}
                        />
                    </View>

                    <View className="flex flex-col">
                        <TextBox
                            width="w-full"
                            placeholder="Quantity (number)"
                            onChangeText={setQuantity}
                            value={quantity}
                        />
                    </View>

                    <View className="flex flex-col mt-5 mb-5">
                        <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Times</Text>
                        <View className="flex flex-row w-full justify-between">
                            <Button placeholder="Add Time" onPress={() => setShowTimePicker(true)} width="w-full" />
                        </View>
                        <DateTimePickerModal
                            isVisible={showTimePicker}
                            mode="time"
                            onConfirm={(date) => {
                                handleConfirmTime(date);
                            }}
                            onCancel={() => setShowTimePicker(false)}
                        />
                        <View className="max-h-40">
                            <ScrollView className="flex-grow-0">
                                <View className="flex flex-col gap-2 mt-2 ">
                                    {times.length === 0 ? (
                                        <View className="flex flex-row justify-center items-center border border-pink-500 rounded-3xl p-5 opacity-50">
                                            <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold">No times added</Text>
                                        </View>
                                    ) : (
                                        times.map((t, index) => (
                                            <View key={index} className="flex flex-row justify-between items-center bg-pink-100 p-3 rounded-lg">
                                                <Text className="text-pink-500 text-xl font-Milliard-Medium">{t}</Text>
                                                <TouchableOpacity onPress={() => removeTime(index)}>
                                                    <Text className="text-pink-500 text-xl font-Milliard-Bold">✕</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </View>

                    <View className="flex flex-col">
                        <Text className="text-pink-500 text-xl font-Milliard-Heavy mb-2">Days</Text>
                        <View className="flex flex-row justify-between">
                            {DAYS.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    onPress={() => toggleDay(day)}
                                    className={`px-4 py-2 rounded-xl border border-pink-600 ${selectedDays.includes(day)
                                        ? 'bg-pink-500'
                                        : 'bg-pink-100'
                                        }`}
                                >
                                    <Text className={`font-Milliard-Medium ${selectedDays.includes(day)
                                        ? 'text-white'
                                        : 'text-pink-500'
                                        }`}>
                                        {day.substring(0, 3)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="flex flex-row justify-end mt-6">
                        <Button placeholder="Save" onPress={saveMedicine} width="w-1/2" />
                    </View>
                </View>
                <WarningModal
                    header="Warning"
                    isOpen={warningModalVisible}
                    onClose={() => setWarningModalVisible(false)}
                    text={warningText}
                />
            </View>
        </View>
    );
}