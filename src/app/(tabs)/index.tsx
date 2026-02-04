import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import TextBox from '@/components/textBox';
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [profileArray, setProfileArray] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const storedProfiles = await AsyncStorage.getItem('profileArray');
        if (storedProfiles) {
          setProfileArray(JSON.parse(storedProfiles));
        }
      } catch (e) {
        console.error("Failed to fetch profiles", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (profileArray.length <= 0) {
      router.replace('/createProfile');
    }
  }, [profileArray]);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-2xl font-Milliard-ExtraBold">Home</Text>
      <TextBox width="w-full" placeholder="Name" onChangeText={() => { }} value="" />
    </View>
  );
}
