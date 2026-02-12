import { View, Text, Pressable } from "react-native";
import type { medicine } from "types";
import Entypo from '@expo/vector-icons/Entypo';
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";

interface MedicineBulletProps {
    medicine: medicine;
    color: string;
    onPress: () => void;
}

export function MedicineBulletWeek({ medicine, color, onPress }: MedicineBulletProps) {
    return (
        <Pressable className={`flex flex-row w-full ${color} rounded-3xl px-5 py-2 active:opacity-55`}
            onPress={onPress}>
            <View className="flex flex-col w-[75%]">
                <Text className="text-gray-700 font-Milliard-Medium text-xl">{medicine.name}</Text>
                <Text className={`text-gray-700 font-Milliard-Medium px-2 py-1 border border-gray-300 rounded-full  ${medicine.amountRemaining === 0 ? " bg-red-400" : "bg-gray-100/75"}`}>{medicine.amountRemaining} / {medicine.totalQuantity} Remaining</Text>
            </View>
            <View className="flex flex-col w-[25%] justify-center items-center">

            </View>
        </Pressable>
    );
}

interface MedicineBulletDayProps {
    medicine: medicine;
    color: string;
    onPress: () => void;
    time: string;
    onCheck: () => void;
}

export function MedicineBulletDay({ medicine, color, onPress, time, onCheck }: MedicineBulletDayProps) {
    const isTaken = time ? medicine.times.find(t => t.time === time)?.isTaken : false;

    return (
        <Pressable className={`flex flex-row w-full ${color} rounded-3xl px-5 py-2 active:opacity-55 justify-between`}
            onPress={onPress}>
            <View className="flex flex-col w-[75%]">
                <Text className="text-gray-700 font-Milliard-Medium text-xl">{medicine.name}</Text>
                <Text className={`text-gray-700 font-Milliard-Medium px-2 py-1 border border-gray-300 rounded-full  ${medicine.amountRemaining === 0 ? " bg-red-400" : "bg-gray-100/75"}`}>{medicine.amountRemaining} / {medicine.totalQuantity} Remaining</Text>
            </View>
            <View className="flex flex-col w-[25%] items-end">
                <Pressable
                    className={`flex flex-col w-[80%] h-16 justify-center items-center rounded-3xl  active:opacity-55 ${isTaken ? "bg-pink-500" : " border border-gray-300 bg-gray-100/75"}`}
                    onPress={() => {
                        if (isTaken) return;
                        onCheck();
                    }}
                >
                    <Entypo name="check" size={24} color={`${isTaken ? "white" : "gray"}`} />
                </Pressable>
            </View>
        </Pressable>
    );
}
