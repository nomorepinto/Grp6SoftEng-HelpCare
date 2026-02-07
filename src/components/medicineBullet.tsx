import { View, Text, Pressable } from "react-native";
import type { medicine } from "types";
import Entypo from '@expo/vector-icons/Entypo';

interface MedicineBulletProps {
    medicine: medicine;
    color: string;
    onPress: () => void;
}

export default function MedicineBullet({ medicine, color, onPress }: MedicineBulletProps) {
    return (
        <Pressable className={`flex flex-row w-full ${color} rounded-3xl px-5 py-2 active:opacity-55`}
            onPress={onPress}>
            <View className="flex flex-col w-[75%]">
                <Text className="text-gray-700 font-Milliard-Medium text-xl">{medicine.name}</Text>
                <Text className={`text-gray-700 font-Milliard-Medium px-2 py-1 border border-gray-300 rounded-full  ${medicine.amountRemaining === 0 ? " bg-red-400" : "bg-gray-100/75"}`}>{medicine.amountRemaining} / {medicine.amountBought} Remaining</Text>
            </View>
            <View className="flex flex-col w-[25%] justify-center items-center">

            </View>
        </Pressable>
    );
}
