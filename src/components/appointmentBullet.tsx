import { View, Text } from "react-native";
import type { appointment, groupedAppointmentsByDate } from "types";
import AppointmentSubBullet from "./appointmentSubBullet";

interface AppointmentBulletProps {
    dayAppointments: groupedAppointmentsByDate;
    onPress?: (appointment: appointment) => void;
}

export default function AppointmentBullet({ dayAppointments, onPress }: AppointmentBulletProps) {
    const date = new Date(dayAppointments.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <View className="flex flex-col w-[90%] bg-white border border-gray-200 rounded-3xl px-5 py-4 mb-3">
            <Text className="text-gray-700 font-Milliard-ExtraBold text-2xl ml-2 mb-2">{formattedDate}</Text>
            <View className="flex flex-col w-full gap-2">
                {dayAppointments.appointments.map((appointment, index) => (
                    <AppointmentSubBullet
                        key={index}
                        appointment={appointment}
                        onPress={() => onPress?.(appointment)}
                    />
                ))}
            </View>
        </View>
    );
}
