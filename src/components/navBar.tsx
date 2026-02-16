import { View, Text, Pressable } from "react-native";
import { Profile } from "types";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, SlideInUp, SlideOutUp } from "react-native-reanimated";


export default function NavBar({ profileArray, selectProfile, deleteProfile }: { profileArray: Profile[], selectProfile: any, deleteProfile: any }) {
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
        <View className="flex flex-row bg-white pt-16 pb-5 px-5 justify-between">
            <View className="flex flex-row w-1/3 justify-start">
                <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold">Schedule</Text>
            </View>

            <Pressable className="flex flex-row w-[40%] rounded-3xl border border-pink-500 px-5 ml-5 bg-pink-500 justify-between" onPress={() => setProfileDropdown(!profileDropdown)}>
                <Text className="text-white text-2xl font-Milliard-ExtraBold">{profileArray.map((profile: Profile) => profile.isSelected ? profile.name : "")}</Text>
                <FontAwesome name="caret-down" size={30} color="white" className="self-center" />
            </Pressable>

            {
                profileDropdown && (
                    <>
                        <Animated.View className="absolute top-[6.5rem] right-[45%] w-[40%] bg-white rounded-xl z-50"
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(200)}>
                            {profileArray.map((profile: Profile, index: number) => (
                                <Pressable
                                    key={index}
                                    onPress={async () => {
                                        await deleteProfile(profile);
                                        setProfileDropdown(false);
                                    }}
                                    className="px-5 py-2 border-b bg-red-500 active:bg-red-700 rounded-xl"
                                >
                                    <Text className="text-white text-lg font-Milliard-Heavy">
                                        Delete
                                    </Text>
                                </Pressable>
                            ))}
                        </Animated.View>
                        <Animated.View className="absolute top-[6.5rem] right-5 w-[40%] bg-white rounded-xl border border-pink-500 z-50"
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(200)}>
                            {profileArray.map((profile: Profile, index: number) => (
                                <Pressable
                                    key={index}
                                    onPress={async () => {
                                        await selectProfile(profile.id);
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
                        </Animated.View>
                    </>
                )
            }
        </View>

    );
}