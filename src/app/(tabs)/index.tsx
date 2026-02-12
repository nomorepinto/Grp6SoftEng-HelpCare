import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '@/components/navBar';
import { Profile, medicine, groupedMedsByHours, groupedMedsByDays, day, sampleMedicine, appointment, groupedAppointmentsByDate } from 'types';
import DayScheduleBullet from '@/components/dayScheduleBullet';
import Button from '@/components/button';
import LightButton from '@/components/lightButton';
import WeekScheduleBullet from '@/components/weekScheduleBullet';
import AppointmentBullet from '@/components/appointmentBullet';
import PagerView from 'react-native-pager-view';
import MedInfoModal from '@/components/medInfoModal';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { Calendar } from '@marceloterreiro/flash-calendar';
import WarningModal from '@/components/warningModal';
import useNotifications from '@/components/functions/useNotifications';
import HowManyTakenModal from '@/components/howManyTakenModal';
import { timeStringToCountdown } from '@/components/functions/timeUtils';
import { pinkCalendarTheme } from '@/components/themes/pinkCalendarTheme';


export default function Home() {
  // ----------------------------------------------------------------------
  // 1. Setup & Custom Hooks
  // ----------------------------------------------------------------------
  const router = useRouter();
  const { expoPushToken, notification, scheduleNotification, error } = useNotifications();

  // ----------------------------------------------------------------------
  // 2. State Definitions
  // ----------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [profileArray, setProfileArray] = useState<Profile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentDate, setCurrentDate] = useState(Date.now());

  // Modal States
  const [isMedInfoModalOpen, setIsMedInfoModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isHowManyTakenModalOpen, setIsHowManyTakenModalOpen] = useState(false);

  // Selection States
  const [selectedMed, setSelectedMed] = useState<medicine | null>(null);
  const [selectedHour, setSelectedHour] = useState<groupedMedsByHours | null>(null);
  const [selectedMedicineID, setSelectedMedicineID] = useState<string | null>(null);

  // ----------------------------------------------------------------------
  // 3. Animation Values
  // ----------------------------------------------------------------------
  const opacity = useSharedValue(0);

  // ----------------------------------------------------------------------
  // 4. Constants
  // ----------------------------------------------------------------------
  const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayAbbreviationMap: day[] = ["Su", "M", "T", "W", "Th", "F", "S"];
  const colors = require("tailwindcss/colors");

  // ----------------------------------------------------------------------
  // 5. Derived State (useMemo)
  // ----------------------------------------------------------------------
  const selectedProfile = useMemo(() => {
    return profileArray.find((profile: Profile) => profile.isSelected);
  }, [profileArray]);

  const hours: groupedMedsByHours[] = useMemo(() => {

    if (isLoading || !selectedProfile || !selectedProfile.medicineSchedule) {
      console.log("No medicine schedule");
      return [];
    }
    const currentDayAbbreviation = dayAbbreviationMap[new Date(currentDate).getDay()];
    const todaysMedicines = selectedProfile.medicineSchedule.filter((medicine: medicine) =>
      medicine.days.includes(currentDayAbbreviation)
    );
    // Get all unique hours from today's medicines
    const allTimes = todaysMedicines.flatMap((medicine: medicine) => medicine.times);
    // Deduplicate by time string
    const uniqueTimeStrings = [...new Set(allTimes.map(t => t.time))];
    // Sort unique hours chronologically
    const sortedTimeStrings = uniqueTimeStrings.sort((a, b) => {
      const [hoursA, minutesA] = a.split(':').map(Number);
      const [hoursB, minutesB] = b.split(':').map(Number);
      const totalMinutesA = hoursA * 60 + minutesA;
      const totalMinutesB = hoursB * 60 + minutesB;
      return totalMinutesA - totalMinutesB;
    });
    // Group medicines by hour string
    const groupedHours = sortedTimeStrings.map((timeStr: string) => {
      return {
        hour: timeStr,
        medicines: todaysMedicines.filter((medicine: medicine) =>
          medicine.times.some(t => t.time === timeStr)
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
  }, [selectedProfile, currentDate, isLoading]);

  const groupedAppointments: groupedAppointmentsByDate[] = useMemo(() => {
    if (!selectedProfile?.appointments) return [];

    const grouped = selectedProfile.appointments.reduce((acc: { [key: number]: appointment[] }, app) => {
      const date = new Date(app.date);
      date.setHours(0, 0, 0, 0);
      const timestamp = date.getTime();

      if (!acc[timestamp]) {
        acc[timestamp] = [];
      }
      acc[timestamp].push(app);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([timestamp, appointments]) => ({
        date: parseInt(timestamp),
        appointments: appointments.sort((a, b) => a.time.localeCompare(b.time))
      }))
      .sort((a, b) => a.date - b.date);
  }, [selectedProfile]);

  // ----------------------------------------------------------------------
  // 6. Effects
  // ----------------------------------------------------------------------

  // Init: Fetch Profiles
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
    }, [])
  );


  // Date Check Interval
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const current = new Date(currentDate);

      // Compare only the date parts (year, month, day)
      if (
        now.getDate() !== current.getDate() ||
        now.getMonth() !== current.getMonth() ||
        now.getFullYear() !== current.getFullYear()
      ) {
        setCurrentDate(Date.now());
        setTakeMedicineFalseAfterDayChange();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  // Notifications
  useEffect(() => {
    // Cancel all previous notifications for this profile
    const scheduledIds: string[] = [];

    hours.forEach((hour: groupedMedsByHours) => {
      hour.medicines.forEach((medicine: medicine) => {
        medicine.times.forEach((time: { time: string; isTaken: boolean }) => {
          // Skip if already taken
          if (time.isTaken) return;

          const countdown = timeStringToCountdown(time.time);

          // Only schedule if countdown is positive (future time)
          if (countdown > 0) {
            const notificationId = `${medicine.id}-${time.time}`;
            scheduleNotification(
              "Take your medicine",
              medicine.name,
              { id: medicine.id, notificationId },
              countdown
            );
            scheduledIds.push(notificationId);
          }
        });
      });
    });

    return () => {
      scheduledIds.forEach(id => {
        // cancelNotification(id);
      });
    };
  }, [hours, currentDate]);

  // Animation Trigger
  useEffect(() => {
    if (isMedInfoModalOpen || isWarningModalOpen || isHowManyTakenModalOpen) {
      opacity.value = withTiming(0.25);
    } else {
      opacity.value = withTiming(1);
    }
  }, [isMedInfoModalOpen, isWarningModalOpen, isHowManyTakenModalOpen]);


  // ----------------------------------------------------------------------
  // 7. Animation Styles
  // ----------------------------------------------------------------------
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 50 })
    };
  });

  // ----------------------------------------------------------------------
  // 8. Helper Functions & Event Handlers
  // ----------------------------------------------------------------------
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
      console.log("Profile selected " + updatedProfileArray.find((p: Profile) => p.isSelected)?.name);
    } catch (e) {
      console.error("Failed to select profile [index.tsx]", e);
    }
  }

  const deleteProfile = async (profile: Profile) => {
    try {
      if (profileArray.length === 1) {
        setIsWarningModalOpen(true);
        return;
      }
      if (profile.isSelected) {
        setIsWarningModalOpen(true);
        return;
      }
      const updatedProfileArray = profileArray.filter((p: Profile) => profile.id !== p.id);
      setProfileArray(updatedProfileArray);
      await saveProfileArray(updatedProfileArray);
    } catch (e) {
      console.error("Failed to delete profile [index.tsx]", e);
    }
  }

  const takeMedicine = async (medicine: medicine, timeStr: string, amountToBeTaken: number) => {
    if (!selectedProfile) return;

    const updatedMeds = selectedProfile.medicineSchedule.map((med) => {
      if (med.id === medicine.id) {
        const timeToUpdate = med.times.find(t => t.time === timeStr);
        if (timeToUpdate) {
          med.amountRemaining = timeToUpdate.isTaken ? med.amountRemaining : (med.amountRemaining > 0 ? med.amountRemaining - amountToBeTaken : 0);
          timeToUpdate.isTaken = true;
          med.amountTaken = timeToUpdate.isTaken ? med.amountTaken + amountToBeTaken : med.amountTaken;
        }
      }
      return med;
    });

    const updatedProfileArray = profileArray.map((p: Profile) =>
      p.id === selectedProfile.id ? { ...p, medicineSchedule: updatedMeds } : p
    );

    setProfileArray(updatedProfileArray);
    await saveProfileArray(updatedProfileArray);
  };

  const setTakeMedicineFalseAfterDayChange = async () => {
    if (!selectedProfile) return;

    const updatedMeds = selectedProfile.medicineSchedule.map((med) => {
      med.times.forEach((t) => (t.isTaken = false));
      return med;
    });

    const updatedProfileArray = profileArray.map((p: Profile) =>
      p.id === selectedProfile.id ? { ...p, medicineSchedule: updatedMeds } : p
    );

    setProfileArray(updatedProfileArray);
    await saveProfileArray(updatedProfileArray);
  };

  const handleSelectedHour = (hour: groupedMedsByHours, medicineID: string) => {
    setSelectedHour(hour);
    setSelectedMedicineID(medicineID);
    setIsHowManyTakenModalOpen(true);
  };

  // ----------------------------------------------------------------------
  // 9. Loading Check
  // ----------------------------------------------------------------------
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="text-pink-500 font-Milliard-Medium text-lg opacity-50 mt-6">Loading...</Text>
      </View>
    );
  }

  // ----------------------------------------------------------------------
  // 10. Main Return
  // ----------------------------------------------------------------------
  return (
    <Animated.View className="flex-1" style={animatedStyle}>
      <NavBar profileArray={profileArray} selectProfile={selectProfile} deleteProfile={deleteProfile} />
      <View className="flex-1 justify-start pt-5 bg-gray-150">
        {(selectedProfile?.medicineSchedule.length === 0 || selectedProfile?.medicineSchedule.length === undefined || selectedProfile === undefined) ?
          (
            <View className="flex w-full items-center justify-center mt-60">
              <Text className="text-3xl font-Milliard-ExtraBold text-pink-500 opacity-50">No medicines added yet</Text>
            </View>
          ) :
          (
            <>
              <View className="flex flex-row w-[90%] justify-between mb-4 self-center">
                <Animated.View className={`w-[32%] h-2 rounded-full bg-pink-500`}
                  style={{
                    backgroundColor: currentPage === 0 ? colors.pink[500] : colors.gray[300],
                    transitionProperty: 'backgroundColor',
                    transitionDuration: 100,
                  }}>
                </Animated.View>
                <Animated.View className={`w-[32%] h-2 rounded-full bg-pink-500`} style={{
                  backgroundColor: currentPage === 1 ? colors.pink[500] : colors.gray[300],
                  transitionProperty: 'backgroundColor',
                  transitionDuration: 100,
                }}>
                </Animated.View>
                <Animated.View className={`w-[32%] h-2 rounded-full bg-pink-500`} style={{
                  backgroundColor: currentPage === 2 ? colors.pink[500] : colors.gray[300],
                  transitionProperty: 'backgroundColor',
                  transitionDuration: 100,
                }}>
                </Animated.View>
              </View>
              <PagerView
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
              >
                <View key="1" className="flex flex-col gap-2 w-full h-full ml-5">
                  <Text className="text-gray-700 font-Milliard-ExtraBold text-3xl rounded-full bg-white px-5 py-2 w-[90%]">{dayMap[new Date(currentDate).getDay()]} -  {new Date(currentDate).toLocaleString('en-US', { month: 'short', day: 'numeric' })}</Text>
                  <ScrollView className="flex-1">
                    {hours.map((hour: groupedMedsByHours, index: number) => (
                      <DayScheduleBullet
                        key={index}
                        hour={hour}
                        selectMedicine={(medicine: medicine) => {
                          setSelectedMed(medicine);
                          setIsMedInfoModalOpen(true);
                        }}
                        onCheck={handleSelectedHour}
                      />
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

                <View key="3" className="flex flex-col gap-2 w-full h-full ml-5">
                  <Text className="text-gray-700 font-Milliard-ExtraBold text-3xl rounded-full bg-white px-5 py-2 w-[90%]">Doctor's Appointments</Text>
                  <View className="rounded-3xl bg-white px-5 py-8 w-[90%]">
                    <Calendar
                      calendarMonthId={new Date(currentDate).toISOString().split('T')[0].substring(0, 7) + '-01'}
                      onCalendarDayPress={dateId => {
                        console.log('selected day', dateId);
                      }}
                      calendarActiveDateRanges={selectedProfile?.appointments.map((appointment: appointment) => ({
                        startId: new Date(appointment.date).toISOString().split('T')[0],
                        endId: new Date(appointment.date).toISOString().split('T')[0]
                      }))}
                      theme={pinkCalendarTheme}
                    />
                  </View>
                  <View className="max-h-[40%]">
                    <ScrollView className="flex-grow-0">
                      {groupedAppointments.map((group, index) => (
                        <AppointmentBullet
                          key={index}
                          dayAppointments={group}
                          onPress={(app) => {
                            console.log("Appointment pressed", app);
                          }}
                        />
                      ))}
                    </ScrollView>
                  </View>
                  <Button placeholder="Add Appointment" onPress={() => router.push('/addAppointment')} width='w-[90%]' />
                </View>

              </PagerView>
            </>
          )

        }
        <WarningModal isOpen={isWarningModalOpen} onClose={() => setIsWarningModalOpen(false)} header="Warning" text="Cannot Deleted Current Profile, Please Select Another Profile Before Deleting." />
        <MedInfoModal isOpen={isMedInfoModalOpen} onClose={() => setIsMedInfoModalOpen(false)} medicine={selectedMed ?? sampleMedicine} />
        <HowManyTakenModal isOpen={isHowManyTakenModalOpen} onClose={() => setIsHowManyTakenModalOpen(false)} selectedHour={selectedHour ?? { hour: "", medicines: [] }} selectedMedicineID={selectedMedicineID ?? ""} takeMedicine={takeMedicine} />
      </View>
      <View className="flex flex-col items-center pt-5 pb-8 bg-white">
        <Button placeholder="Med Stock" onPress={() => router.push('/medStock')} width='w-3/4' />
      </View>
    </Animated.View>
  );
}

