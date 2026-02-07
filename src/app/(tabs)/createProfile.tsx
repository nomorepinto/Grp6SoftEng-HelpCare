import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import TextBox from '@/components/textBox'; import Button from '@/components/button';
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from 'types';
import WarningModal from '@/components/warningModal';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';


export default function CreateProfile() {
    const router = useRouter();
    const [patientName, setPatientName] = useState("");
    const [age, setAge] = useState("");
    const [affliction, setAffliction] = useState("");
    const [warningModalVisible, setWarningModalVisible] = useState(false);

    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withTiming(warningModalVisible ? 0.5 : 1, { duration: 300 });
    }, [warningModalVisible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const saveProfile = async () => {
        try {
            if (patientName === "" || age === "" || affliction === "") {
                setWarningModalVisible(true);
                return;
            }

            const profile: Profile = {
                id: Crypto.randomUUID(),
                name: patientName,
                age: parseInt(age),
                affliction: affliction,
                medicineSchedule: [],
                appointments: [],
                isSelected: true
            };
            const profileArray = JSON.parse(await AsyncStorage.getItem("profileArray") ?? "[]");

            profileArray.forEach((profile: Profile) => {
                profile.isSelected = false;
                console.log(profile.name + " set to false")
            });

            profileArray.push(profile);
            await AsyncStorage.setItem("profileArray", JSON.stringify(profileArray));
            console.log("New Profile Saved")
            router.replace("/prescriptionPic");
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    return (
        <Animated.View style={[{ flex: 1 }, animatedStyle]} className="items-center justify-center bg-white">
            <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-3">Create Profile</Text>
            <View className="flex flex-col w-5/6 gap-3">
                <View className="flex flex-col">
                    <TextBox width="w-full" placeholder="Patient Name" onChangeText={setPatientName} value={patientName} />
                </View>
                <View className="flex flex-col">
                    <TextBox width="w-full" placeholder="Age" onChangeText={setAge} value={age} isNumeric />
                </View>
                <View className="flex flex-col">
                    <TextBox width="w-full" placeholder="Affliction" onChangeText={setAffliction} value={affliction} />
                </View>
                <View className="flex flex-row justify-end">
                    <Button placeholder="Next" onPress={() => saveProfile()} width="w-1/2" />
                </View>
            </View>
            <WarningModal header='Warning' isOpen={warningModalVisible} onClose={() => setWarningModalVisible(false)} text="Please fill in all fields" />
        </Animated.View>
    );
}
