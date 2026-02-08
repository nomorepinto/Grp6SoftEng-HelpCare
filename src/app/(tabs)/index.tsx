import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import TextBox from '@/components/textBox';
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '@/components/navBar';
import { Profile, medicine, groupedMedsByHours, groupedMedsByDays, day, sampleMedicine } from 'types';
import DayScheduleBullet from '@/components/dayScheduleBullet';
import Button from '@/components/button';
import LightButton from '@/components/lightButton';
import WeekScheduleBullet from '@/components/weekScheduleBullet';
import PagerView from 'react-native-pager-view';
import MedInfoModal from '@/components/medInfoModal';
import Animated, {
  useSharedValue, useAnimatedStyle,
  interpolateColor,
  withTiming
} from 'react-native-reanimated';


export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [profileArray, setProfileArray] = useState<Profile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [isMedInfoModalOpen, setIsMedInfoModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<medicine | null>(null);

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 50 })
    };
  });

  useEffect(() => {
    if (isMedInfoModalOpen) {
      opacity.value = withTiming(0.25);
    } else {
      opacity.value = withTiming(1);
    }
  }, [isMedInfoModalOpen]);



  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = Date.now();
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayAbbreviationMap: day[] = ["Su", "M", "T", "W", "Th", "F", "S"];

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

  const hours: groupedMedsByHours[] = useMemo(() => {
    if (!selectedProfile?.medicineSchedule) return [];

    const currentDayAbbreviation = dayAbbreviationMap[new Date(currentDate).getDay()];

    const todaysMedicines = selectedProfile.medicineSchedule.filter((medicine: medicine) =>
      medicine.days.includes(currentDayAbbreviation)
    );

    // Get all unique hours from today's medicines
    const hoursArray = todaysMedicines.flatMap((medicine: medicine) => medicine.times);
    const uniqueHours = [...new Set(hoursArray)];

    // Sort unique hours chronologically
    const sortedHours = uniqueHours.sort((a, b) => {
      // Convert "HH:MM" to minutes for comparison
      const [hoursA, minutesA] = a.split(':').map(Number);
      const [hoursB, minutesB] = b.split(':').map(Number);

      const totalMinutesA = hoursA * 60 + minutesA;
      const totalMinutesB = hoursB * 60 + minutesB;

      return totalMinutesA - totalMinutesB;
    });

    // Group medicines by hour
    const groupedHours = sortedHours.map((hour: string) => {
      return {
        hour: hour,
        medicines: todaysMedicines.filter((medicine: medicine) =>
          medicine.times.includes(hour)
        )
      };
    });

    return groupedHours;
  }, [selectedProfile, currentDate]);

  const days: groupedMedsByDays[] = useMemo(() => {
    if (!selectedProfile?.medicineSchedule) return [];

    // Get all unique days from all medicines
    const daysArray = selectedProfile.medicineSchedule.flatMap((medicine: medicine) => medicine.days);
    const uniqueDays = [...new Set(daysArray)];

    // Sort days in week order
    const dayOrder: day[] = ["M", "T", "W", "Th", "F", "S", "Su"];
    const sortedDays = uniqueDays.sort((a, b) => {
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });

    // Group medicines by day
    const groupedDays = sortedDays.map((day: day) => {
      return {
        day: day,
        medicines: selectedProfile.medicineSchedule.filter((medicine: medicine) =>
          medicine.days.includes(day)
        )
      };
    });

    return groupedDays;
  }, [selectedProfile]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="text-pink-500 font-Milliard-Medium text-lg opacity-50 mt-6">Loading...</Text>
      </View>
    );
  }

  return (
    <Animated.View className="flex-1" style={animatedStyle}>
      <NavBar profileArray={profileArray} selectProfile={selectProfile} />
      <View className="flex-1 justify-start pt-5 bg-gray-150">
        {selectedProfile?.medicineSchedule.length === 0 ?
          (
            <View className="flex w-full items-center justify-center mt-60">
              <Text className="text-3xl font-Milliard-ExtraBold text-pink-500 opacity-50">No medicines added yet</Text>
            </View>
          ) :
          (
            <PagerView
              style={{ flex: 1 }}
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              <View key="1" className="flex flex-col gap-2 w-full h-full ml-5">
                <Text className="text-gray-700 font-Milliard-ExtraBold text-3xl ml-2">{dayMap[new Date(currentDate).getDay()]}</Text>
                <ScrollView className="flex-1">
                  {hours.map((hour: groupedMedsByHours, index: number) => (
                    <DayScheduleBullet key={index} hour={hour} selectMedicine={(medicine: medicine) => {
                      setSelectedMed(medicine);
                      setIsMedInfoModalOpen(true);
                    }} />
                  ))}
                </ScrollView>
              </View>

              <View key="2" className="flex flex-col gap-2 w-full h-full ml-5">
                <ScrollView className="flex-1">
                  {days.map((dayGroup: groupedMedsByDays, index: number) => (
                    <WeekScheduleBullet key={index} day={dayGroup} selectMedicine={(medicine: medicine) => {
                      setSelectedMed(medicine);
                      setIsMedInfoModalOpen(true);
                    }} />
                  ))}
                </ScrollView>
              </View>

            </PagerView>
          )

        }
        <MedInfoModal isOpen={isMedInfoModalOpen} onClose={() => setIsMedInfoModalOpen(false)} medicine={selectedMed ?? sampleMedicine} />
      </View>
      <View className="flex flex-col items-center pt-5 pb-8 bg-white">
        <Button placeholder="Med Stock" onPress={() => router.push('/medStock')} width='w-3/4' />
      </View>
    </Animated.View>
  );
}
