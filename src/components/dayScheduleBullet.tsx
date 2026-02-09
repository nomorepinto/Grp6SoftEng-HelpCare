import { View, Text } from "react-native";
import type { medicine, groupedMedsByHours } from "types";

import { MedicineBulletDay } from "./medicineBullet";
import { format24to12 } from './functions/timeUtils';

interface DayScheduleBulletProps {
    hour: groupedMedsByHours;
    selectMedicine: (medicine: medicine) => void;
    onCheck: (medicine: medicine, time: string) => void;
}

export default function DayScheduleBullet({ hour, selectMedicine, onCheck }: DayScheduleBulletProps) {

    return (
        <View className="flex flex-col w-[90%] bg-white border border-gray-200 rounded-3xl px-5 py-4 mb-3">
            <Text className="text-gray-700 font-Milliard-ExtraBold text-3xl ml-2">{format24to12(hour.hour)}</Text>
            <View className="flex flex-col w-full gap-2">
                {hour.medicines.map((medicine, index) => (
                    <MedicineBulletDay
                        key={index}
                        medicine={medicine}
                        color={medicine.color}
                        onPress={() => selectMedicine(medicine)}
                        time={hour.hour}
                        onCheck={() => onCheck(medicine, hour.hour)}
                    />
                ))}
            </View>

        </View>
    );
}