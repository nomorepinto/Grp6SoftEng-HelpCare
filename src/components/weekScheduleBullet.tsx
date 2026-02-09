import { View, Text } from "react-native";
import type { medicine, groupedMedsByDays, day } from "types";

import { MedicineBulletWeek } from "./medicineBullet";

interface WeekScheduleBulletProps {
    day: groupedMedsByDays;
    selectMedicine: any;
}

const fullDayNames: Record<day, string> = {
    "M": "Monday",
    "T": "Tuesday",
    "W": "Wednesday",
    "Th": "Thursday",
    "F": "Friday",
    "S": "Saturday",
    "Su": "Sunday"
};

export default function WeekScheduleBullet({ day, selectMedicine }: WeekScheduleBulletProps) {
    return (
        <View className="flex flex-col w-[90%] bg-white border border-gray-200 rounded-3xl px-5 py-4 mb-3">
            <Text className="text-gray-700 font-Milliard-ExtraBold text-3xl ml-2">{fullDayNames[day.day]}</Text>
            <View className="flex flex-col w-full gap-2">
                {day.medicines.map((medicine, index) => (
                    <MedicineBulletWeek key={index} medicine={medicine} color={medicine.color} onPress={() => selectMedicine(medicine)} />
                ))}
            </View>
        </View>
    );
}
