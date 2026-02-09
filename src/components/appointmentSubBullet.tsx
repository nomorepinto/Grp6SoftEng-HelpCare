import { View, Text, Pressable } from "react-native";
import type { appointment } from "types";
import { format24to12 } from "./functions/timeUtils";

interface AppointmentSubBulletProps {
    appointment: appointment;
    color?: string;
    onPress?: () => void;
}

export default function AppointmentSubBullet({ appointment, color = "bg-pink-100", onPress }: AppointmentSubBulletProps) {
    return (
        <Pressable className={`flex flex-row w-full ${color} rounded-3xl px-5 py-2 active:opacity-55`}
            onPress={onPress}>
            <View className="flex flex-col w-full">
                <View className="flex flex-row justify-between items-center w-full">
                    <Text className="text-gray-700 font-Milliard-Medium text-xl">{appointment.doctorName}</Text>
                    <Text className="text-gray-700 font-Milliard-Medium bg-gray-100/75 px-3 py-1 border border-gray-300 rounded-full text-sm">
                        {format24to12(appointment.time)}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
