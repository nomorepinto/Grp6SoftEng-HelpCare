import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import TextBox from '@/components/textBox';
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '@/components/navBar';
import { Profile } from 'types';

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [profileArray, setProfileArray] = useState<Profile[]>([]);

  const router = useRouter();

  const saveProfileArray = async (updatedProfileArray: Profile[]) => {
    try {
      await AsyncStorage.setItem('profileArray', JSON.stringify(updatedProfileArray));
    } catch (e) {
      console.error("Failed to save profile array [index.tsx]", e);
    }
  }

  const selectProfile = async (profile: Profile) => {
    try {
      const updatedProfileArray = profileArray.map((p: Profile) => profile.id === p.id ? { ...p, isSelected: true } : { ...p, isSelected: false });
      setProfileArray(updatedProfileArray);
      await saveProfileArray(updatedProfileArray);
    } catch (e) {
      console.error("Failed to select profile [index.tsx]", e);
    }
  }

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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="text-pink-500 font-Milliard-Medium text-lg opacity-50 mt-6">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <NavBar profileArray={profileArray} selectProfile={selectProfile} />
      <View className="flex-1">
        <Text className="text text-2xl font-Milliard-ExtraBold">Hello, {selectedProfile?.name ?? "error"}</Text>
      </View>
    </>
  );
}
