import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import TextBox from '@/components/textBox'; import Button from '@/components/button';
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from 'types';

export default function CreateProfile() {
    const [patientName, setPatientName] = useState("");
    const [age, setAge] = useState("");
    const [affliction, setAffliction] = useState("");

    const saveProfile = async () => {
        const profile: Profile = {
            name: patientName,
            age: parseInt(age),
            affliction: affliction,
            medicineSchedule: [],
            appointments: []
        };
        const profileArray: Profile[] = [];
        profileArray.push(profile);
        await AsyncStorage.setItem("profile", JSON.stringify(profileArray));
    };

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-3">Create Profile</Text>
            <View className="flex flex-col w-5/6 gap-3">
                <View className="flex flex-col">
                    <TextBox width="w-full" placeholder="Patient Name" onChangeText={setPatientName} value={patientName} />
                </View>
                <View className="flex flex-col">
                    <TextBox width="w-full" placeholder="Age" onChangeText={setAge} value={age} />
                </View>
                <View className="flex flex-col">
                    <TextBox width="w-full" placeholder="Affliction" onChangeText={setAffliction} value={affliction} />
                </View>
                <View className="flex flex-row justify-end">
                    <Button placeholder="Next" onPress={() => saveProfile()} width="w-1/2" />
                </View>
            </View>
        </View>
    );
}
