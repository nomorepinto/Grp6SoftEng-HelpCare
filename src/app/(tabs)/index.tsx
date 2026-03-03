import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '@/components/navBar';
import { Profile, medicine, groupedMedsByHours, groupedMedsByDays, day, sampleMedicine, appointment, groupedAppointmentsByDate, medicineTime } from 'types';
import DayScheduleBullet from '@/components/dayScheduleBullet';
import Button from '@/components/button';
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
import { pinkCalendarTheme } from '@/components/themes/pinkCalendarTheme';
import AskNotificationModal from '@/components/askNotificationModal';


export default function Home() {
  // ----------------------------------------------------------------------
  // 1. Setup & Custom Hooks
  // ----------------------------------------------------------------------
  const router = useRouter();
  const { scheduleNotification, scheduleAppointmentNotification, cancelAllScheduledNotifications, isRegistered } = useNotifications();

  // ----------------------------------------------------------------------
  // 2. State Definitions
  // ----------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [profileArray, setProfileArray] = useState<Profile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isDoctorArray, setIsDoctorArray] = useState<boolean>(false);
  const [appointmentsArray, setAppointmentsArray] = useState<appointment[]>([]); //for notifications useFocusEffect Only
  const [medicineArray, setMedicineArray] = useState<medicine[]>([]); //for notifications useFocusEffect Only

  // Modal States
  const [isMedInfoModalOpen, setIsMedInfoModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningModalText, setWarningModalText] = useState("");
  const [isHowManyTakenModalOpen, setIsHowManyTakenModalOpen] = useState(false);
  const [isAskNotificationModalOpen, setIsAskNotificationModalOpen] = useState(false);
  const [askAgainNotifications, setAskAgainNotifications] = useState<boolean>(true);

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
    return profileArray.find((profile: Profile) => profile.id === selectedProfileId);
  }, [profileArray, selectedProfileId]);

  const hours = useMemo<groupedMedsByHours[]>(() => {
    // 1. Guard Clause with optional chaining
    if (isLoading || !selectedProfile?.medicineSchedule) {
      console.log("No medicine schedule");
      return [];
    }
    const currentDayAbbreviation = dayAbbreviationMap[new Date(currentDate).getDay()] as day;
    const targetProfile = profileArray.find((p: Profile) => p.id === selectedProfileId);

    if (!targetProfile) return [];

    const todaysMedicines: medicine[] = targetProfile.medicineSchedule.filter((med: medicine) =>
      med.days.includes(currentDayAbbreviation)
    );

    // 4. Extract unique time strings (e.g., "08:00")
    const allTimes: medicineTime[] = todaysMedicines.flatMap((med: medicine) => med.times);
    const uniqueTimeStrings: string[] = [...new Set(allTimes.map(t => t.time))];

    // 5. Sort times (HH:mm format)
    const sortedTimeStrings = uniqueTimeStrings.sort((a, b) => {
      const [hA, mA] = a.split(':').map(Number);
      const [hB, mB] = b.split(':').map(Number);
      return (hA * 60 + mA) - (hB * 60 + mB);
    });

    // 6. Return the strictly typed grouped array
    return sortedTimeStrings.map((timeStr: string): groupedMedsByHours => ({
      hour: timeStr,
      medicines: todaysMedicines.filter((med: medicine) =>
        med.times.some((t: medicineTime) => t.time === timeStr)
      )
    }));
  }, [selectedProfile, currentDate, profileArray, selectedProfileId, isLoading]);

  const days: groupedMedsByDays[] = useMemo(() => {
    const targetProfile = profileArray.find((p: Profile) => p.id === selectedProfileId);
    if (!targetProfile?.medicineSchedule) return [];

    // Get all unique days from all medicines
    const daysArray = targetProfile.medicineSchedule.flatMap((medicine: medicine) => medicine.days);
    const uniqueDays = [...new Set(daysArray)];

    // Sort days in week order
    const dayOrder: day[] = ["M", "T", "W", "Th", "F", "S", "Su"];
    const sortedDays = uniqueDays.sort((a, b) => {
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });

    // Group medicines by day
    return sortedDays.map((day: day) => ({
      day: day,
      medicines: (targetProfile.medicineSchedule).filter((medicine: medicine) =>
        medicine.days.includes(day)
      )
    }));
  }, [profileArray, selectedProfileId]);

  const groupedAppointments: groupedAppointmentsByDate[] = useMemo(() => {
    const targetProfile = profileArray.find((p: Profile) => p.id === selectedProfileId);
    if (!targetProfile?.appointments) return [];

    const grouped = targetProfile.appointments.reduce((acc: { [key: number]: appointment[] }, app) => {
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
  }, [profileArray, selectedProfileId]);

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
            setSelectedProfileId(JSON.parse(storedProfiles).find((profile: Profile) => profile.isSelected)?.id);
            setMedicineArray(JSON.parse(storedProfiles).find((profile: Profile) => profile.isSelected)?.medicineSchedule);
            setAppointmentsArray(JSON.parse(storedProfiles).find((profile: Profile) => profile.isSelected)?.appointments);
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

  useFocusEffect(
    useCallback(() => {
      const fetchDoctors = async () => {
        try {
          const storedDoctors = await AsyncStorage.getItem('doctors');
          if (storedDoctors && storedDoctors.length > 0) {
            console.log("Doctors fetched successfully [index.tsx]");
            setIsDoctorArray(true);
          } else {
            setIsDoctorArray(false);
          }
        } catch (e) {
          console.error("Failed to fetch doctors [index.tsx]", e);
        }
      };
      fetchDoctors();
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

  const scheduleMedicineNotifications = async () => {
    if (!selectedProfile) return;
    for (const medicine of selectedProfile.medicineSchedule) {
      for (const d of medicine.days) {
        const weekday = dayAbbreviationMap.indexOf(d) + 1;
        for (const time of medicine.times) {
          const [h, m] = time.time.split(':').map(Number);
          await scheduleNotification(
            medicine.name,
            `Take your medicine ${medicine.name} at ${time.time}`,
            h,
            m,
            weekday
          );
        }
      }
    }
  };

  const scheduleAppointmentNotifications = async () => {
    const selectedProfileLocal = profileArray.find((p: Profile) => p.id === selectedProfileId);
    if (!selectedProfileLocal) return;
    for (const appointment of selectedProfileLocal.appointments) {
      const appointmentDate = new Date(appointment.date);
      const [h, m] = appointment.time.split(':').map(Number);

      // Day before reminder
      const dayBefore = new Date(appointmentDate);
      dayBefore.setDate(dayBefore.getDate() - 1);
      dayBefore.setHours(h, m, 0, 0);
      if (dayBefore.getTime() > Date.now()) {
        await scheduleAppointmentNotification(
          appointment.doctor.name,
          `You have an appointment with ${appointment.doctor.name} tomorrow at ${appointment.time}`,
          dayBefore
        );
      }

      // Day of reminder
      appointmentDate.setHours(h, m, 0, 0);
      if (appointmentDate.getTime() > Date.now()) {
        await scheduleAppointmentNotification(
          appointment.doctor.name,
          `Your appointment with ${appointment.doctor.name} is now`,
          appointmentDate
        );
      }
    }
  };

  useEffect(() => {
    const getAskAgainNotifications = async () => {
      const askAgain = await AsyncStorage.getItem("askAgain");
      if (askAgain) {
        setAskAgainNotifications(askAgain === "true");
      }
    };
    getAskAgainNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isLoading || !selectedProfile) return;
      if (!isRegistered && askAgainNotifications) {
        setIsAskNotificationModalOpen(true);
      }
      const setupNotifications = async () => {
        await cancelAllScheduledNotifications();
        await scheduleMedicineNotifications();
        await scheduleAppointmentNotifications();
      };
      setupNotifications();
    }, [
      selectedProfile,
      isLoading,
      selectedProfileId,
      medicineArray,
      appointmentsArray
    ])
  );


  // Animation Trigger
  useEffect(() => {
    if (isMedInfoModalOpen || isWarningModalOpen || isHowManyTakenModalOpen || isAskNotificationModalOpen) {
      opacity.value = withTiming(0.25);
    } else {
      opacity.value = withTiming(1);
    }
  }, [isMedInfoModalOpen, isWarningModalOpen, isHowManyTakenModalOpen, isAskNotificationModalOpen]);


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
  const handleDeleteAppointment = async (appointmentId: string) => {
    const updatedProfileArray = profileArray.map((profile: Profile) => profile.id === selectedProfileId ? { ...profile, appointments: profile.appointments.filter((appointment: appointment) => appointment.id !== appointmentId) } : profile);
    await saveProfileArray(updatedProfileArray);
    setProfileArray(updatedProfileArray);
  }

  const saveProfileArray = async (updatedProfileArray: Profile[]) => {
    try {
      await AsyncStorage.setItem('profileArray', JSON.stringify(updatedProfileArray));
    } catch (e) {
      console.error("Failed to save profile array [index.tsx]", e);
    }
  }

  const selectProfile = async (profileId: string) => {
    try {
      setSelectedProfileId(profileId);
      console.log("Profile selected " + profileArray.find((p: Profile) => p.id === profileId)?.name);
    } catch (e) {
      console.error("Failed to select profile [index.tsx]", e);
    }
  }

  const deleteProfile = async (profile: Profile) => {
    try {
      if (profileArray.length === 1) {
        setWarningModalText("Cannot Delete Current Profile, Please Select Another Profile Before Deleting.");
        setIsWarningModalOpen(true);
        return;
      }
      if (profile.isSelected) {
        setWarningModalText("Cannot Delete Current Profile, Please Select Another Profile Before Deleting.");
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

                <View key="3" className="w-full h-full ml-5">
                  <ScrollView
                    className="flex-1"
                    contentContainerClassName='flex flex-col gap-2 pb-4'
                  >
                    <Text className="text-gray-700 font-Milliard-ExtraBold text-3xl rounded-full bg-white px-5 py-2 w-[90%]">Doctor's Appointments</Text>
                    <View className="rounded-3xl bg-white px-5 py-8 w-[90%]">
                      <Calendar
                        calendarMonthId={new Date(currentDate).toISOString().split('T')[0].substring(0, 7) + '-01'}
                        onCalendarDayPress={() => { }}
                        calendarActiveDateRanges={selectedProfile?.appointments.map((appointment: appointment) => ({
                          startId: new Date(appointment.date).toISOString().split('T')[0],
                          endId: new Date(appointment.date).toISOString().split('T')[0]
                        }))}
                        theme={pinkCalendarTheme}
                      />
                    </View>
                    {groupedAppointments.map((group, index) => (
                      <AppointmentBullet
                        onDelete={handleDeleteAppointment}
                        key={index}
                        dayAppointments={group}
                      />
                    ))}
                    <View className="flex flex-row w-[90%] justify-between">
                      <Button placeholder="Doctors" onPress={() => router.push('/doctorFiles')} width='w-[49%]' />
                      <Button placeholder="+ Appointment" onPress={() => {
                        if (isDoctorArray) {
                          router.push('/addAppointment');
                        } else {
                          setWarningModalText("Please Add a Doctor First");
                          setIsWarningModalOpen(true);
                        }
                      }} width='w-[49%]' />
                    </View>
                  </ScrollView>
                </View>

              </PagerView>
            </>
          )

        }
        <WarningModal isOpen={isWarningModalOpen} onClose={() => setIsWarningModalOpen(false)} header="Warning" text={warningModalText} />
        <MedInfoModal isOpen={isMedInfoModalOpen} onClose={() => setIsMedInfoModalOpen(false)} medicine={selectedMed ?? sampleMedicine} />
        <HowManyTakenModal isOpen={isHowManyTakenModalOpen} onClose={() => setIsHowManyTakenModalOpen(false)} selectedHour={selectedHour ?? { hour: "", medicines: [] }} selectedMedicineID={selectedMedicineID ?? ""} takeMedicine={takeMedicine} />
        <AskNotificationModal isOpen={isAskNotificationModalOpen} onClose={() => setIsAskNotificationModalOpen(false)} neverAskAgain={() => { AsyncStorage.setItem("askAgain", "false"); setAskAgainNotifications(false); }} />
      </View>
      <View className="flex flex-col items-center pt-5 pb-8 bg-white">
        <Button placeholder="Med Stock" onPress={() => router.push('/medStock')} width='w-3/4' />
      </View>
    </Animated.View>
  );
}

