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
import { format24to12 } from '@/components/functions/timeUtils';

const DAYS: day[] = ["M", "T", "W", "Th", "F", "S", "Su"];

export default function AddMedicine() {
    const router = useRouter();
    const [medicineName, setMedicineName] = useState("");
    const [time, setTime] = useState("");
    const [times, setTimes] = useState<string[]>([]);
    const [quantity, setQuantity] = useState("");
    const [amountBought, setAmountBought] = useState("");
    const [selectedDays, setSelectedDays] = useState<day[]>([]);
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [showTimePicker, setShowTimePicker] = useState(false);

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

    const getColorIndex = async () => {
        const color = await AsyncStorage.getItem("colorIndex");
        if (color) {
            await AsyncStorage.setItem("colorIndex", ((Number(color) + 1) % colorArray.length).toString());
            return Number(color);
        } else {
            await AsyncStorage.setItem("colorIndex", "1");
            return 0;
        }
    }

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
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time24 = `${hours}:${minutes}`;
        setTimes([...times, time24]);
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

        const parsedAmountBought = Number(amountBought);
        if (Number.isNaN(parsedAmountBought) || parsedAmountBought <= 0) {
            setWarningText("Please enter a valid amount bought");
            setWarningModalVisible(true);
            return;
        }

        const newMedicine: medicine = {
            id: Crypto.randomUUID(),
            name: medicineName,
            quantity: parsedQuantity,
            times: times,
            days: selectedDays,
            amountBought: parsedAmountBought,
            amountRemaining: parsedAmountBought,
            color: colorArray[await getColorIndex()]
        };

        // Add medicine to the current profile's schedule
        await saveMedicineToProfile(newMedicine);

        // Reset form
        setMedicineName("");
        setTimes([]);
        setQuantity("");
        setSelectedDays([]);
        setAmountBought("");

        router.replace("/medStock");
    };

    const handleCancel = () => {
        setMedicineName("");
        setTimes([]);
        setQuantity("");
        setSelectedDays([]);
        setAmountBought("");
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
                            isNumeric
                        />
                    </View>

                    <View className="flex flex-col">
                        <TextBox
                            width="w-full"
                            placeholder="Amount Bought (number)"
                            onChangeText={setAmountBought}
                            value={amountBought}
                            isNumeric
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
                            display="spinner"
                            minuteInterval={30}
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
                                                <Text className="text-pink-500 text-xl font-Milliard-Medium">{format24to12(t)}</Text>
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

                    <View className="flex flex-row justify-between mt-6 ">
                        <Button placeholder="Cancel" onPress={() => router.replace("/medStock")} width="w-[48%]" />
                        <Button placeholder="Save" onPress={saveMedicine} width="w-[48%]" />
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