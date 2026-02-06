import { View, Text, Pressable } from "react-native";
import { Profile } from "types";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function NavBar({ profileArray, selectProfile }: { profileArray: Profile[], selectProfile: any }) {
    const [profileDropdown, setProfileDropdown] = useState(false);
    const router = useRouter();

    const clearProfile = async () => {
        try {
            await AsyncStorage.removeItem('profileArray');
            console.log("Profile array cleared [navBar.tsx]");
        } catch (e) {
            console.error("Failed to clear profile array [navBar.tsx]", e);
        }
    }

    return (
        <View className="flex flex-row bg-pink-500 pt-16 pb-5 px-5 justify-between">
            <View className="flex flex-row w-1/3 justify-start">
                <Text className="text-white text-3xl font-Milliard-ExtraBold">Schedule</Text>
            </View>

            <Pressable className="flex flex-row w-[40%] rounded-3xl border border-white px-5 ml-5 bg-pink-50 justify-between" onPress={() => setProfileDropdown(!profileDropdown)}>
                <Text className="text-pink-500 text-2xl font-Milliard-ExtraBold">{profileArray.map((profile: Profile) => profile.isSelected ? profile.name : "")}</Text>
                <FontAwesome name="caret-down" size={30} color="#FF69B4" className="self-center" />
            </Pressable>

            {
                profileDropdown && (
                    <View className="absolute top-[6.5rem] right-5 w-[40%] bg-white rounded-xl border border-pink-500 z-50">
                        {profileArray.map((profile: Profile, index: number) => (
                            <Pressable
                                key={index}
                                onPress={async () => {
                                    await selectProfile(profile);
                                    setProfileDropdown(false);
                                }}
                                className="px-5 py-2 border-b border-pink-100 active:bg-pink-50"
                            >
                                <Text className="text-pink-500 text-lg font-Milliard-Heavy">
                                    {profile.name}
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable
                            onPress={() => {
                                setProfileDropdown(false);
                                router.replace("/createProfile");
                            }}
                            className="px-5 py-2 border-b border-pink-100 active:bg-pink-50"
                        >
                            <Text className="text-pink-500 text-lg font-Milliard-Heavy">
                                Create New
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                clearProfile();
                                setProfileDropdown(false);
                            }}
                            className="px-5 py-2 border-b border-pink-100 active:bg-pink-50"
                        >
                            <Text className="text-pink-500 text-lg font-Milliard-Heavy">
                                Clear All
                            </Text>
                        </Pressable>
                    </View>
                )
            }
        </View>

    );
}