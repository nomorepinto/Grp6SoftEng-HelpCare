import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import TextBox from '@/components/textBox';
import Button from '@/components/button';
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, medicine, day } from 'types';
import WarningModal from '@/components/warningModal';

const DAYS: day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AddMedicine() {
    const [medicineName, setMedicineName] = useState("");
    const [time, setTime] = useState("");
    const [times, setTimes] = useState<string[]>([]);
    const [quantity, setQuantity] = useState("");
    const [selectedDays, setSelectedDays] = useState<day[]>([]);
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [warningText, setWarningText] = useState("");

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
            name: medicineName,
            quantity: parsedQuantity,
            times: times,
            days: selectedDays
        };

        // Add medicine to the current profile's schedule
        const profileArray: Profile[] = JSON.parse(await AsyncStorage.getItem("profileArray") || "[]");
        if (profileArray.length > 0) {
            // Assuming you want to add to the last/current profile
            const currentProfile = profileArray[profileArray.length - 1];
            currentProfile.medicineSchedule.push(newMedicine);
            await AsyncStorage.setItem("profileArray", JSON.stringify(profileArray));
        }

        // Reset form
        setMedicineName("");
        setTimes([]);
        setQuantity("");
        setSelectedDays([]);
    };
    
    return (
        <View className="flex-1 items-center justify-center pt-20">
           
            <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-3">Add Medicine</Text>
            
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }} className="w-5/6" showsVerticalScrollIndicator={false}>
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

                    <View className="flex flex-col">
                        <Text className="text-pink-500 text-lg font-Milliard-Bold mb-2">Times</Text>
                        <View className="flex flex-row gap-2">
                            <View className="flex-1">
                                <TextBox 
                                    width="w-full" 
                                    placeholder="Time (e.g., 8:00 AM)" 
                                    onChangeText={setTime} 
                                    value={time} 
                                />
                            </View>
                            <Button placeholder="Add" onPress={addTime} width="w-20" />
                        </View>
                        {times.length > 0 && (
                            <View className="flex flex-col gap-2 mt-2">
                                {times.map((t, index) => (
                                    <View key={index} className="flex flex-row justify-between items-center bg-pink-100 p-3 rounded-lg">
                                        <Text className="text-pink-500 font-Milliard-Medium">{t}</Text>
                                        <TouchableOpacity onPress={() => removeTime(index)}>
                                            <Text className="text-pink-500 font-Milliard-Bold">✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View className="flex flex-col">
                        <Text className="text-pink-500 text-lg font-Milliard-Bold mb-2">Days</Text>
                        <View className="flex flex-row flex-wrap gap-2">
                            {DAYS.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    onPress={() => toggleDay(day)}
                                    className={`px-4 py-2 rounded-lg ${
                                        selectedDays.includes(day) 
                                            ? 'bg-pink-500' 
                                            : 'bg-pink-100'
                                    }`}
                                >
                                    <Text className={`font-Milliard-Medium ${
                                        selectedDays.includes(day) 
                                            ? 'text-white' 
                                            : 'text-pink-500'
                                    }`}>
                                        {day.substring(0, 3)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="flex flex-row justify-end mt-4">
                        <Button placeholder="Save" onPress={saveMedicine} width="w-1/2" />
                    </View>
                </View>
            </ScrollView>
            <WarningModal 
                isOpen={warningModalVisible} 
                onClose={() => setWarningModalVisible(false)} 
                text={warningText} 
            />
        </View>
    );
}